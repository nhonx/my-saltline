import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import prettier from 'prettier';

const html = fs.readFileSync('reference/original.html', 'utf8');
const legacyEnd = html.indexOf('</script>', html.indexOf('id="legacy-v8"'));
const scriptStart = html.indexOf('<script>', legacyEnd) + '<script>'.length;
const scriptEnd = html.lastIndexOf('</script>');
const bundle = html.slice(scriptStart, scriptEnd);

const threeMap = JSON.parse(fs.readFileSync('tools/out/three-map.json', 'utf8'));
// Remove BufferGeometryUtils functions if any collided, we handle Tr/HM explicitly
const ast = acorn.parse(bundle, { ecmaVersion: 2022, sourceType: 'script' });
const iifeBody = ast.body[0].expression.callee.body.body;

// Module ranges (inclusive statement indices in iifeBody)
const MODULES = [
  { name: 'core', ranges: [[332, 337]] },
  { name: 'geometry', ranges: [[338, 350]] },
  { name: 'render', ranges: [[351, 368]] },
  { name: 'mats', ranges: [[369, 416]] },
  { name: 'physics', ranges: [[417, 419]] },
  { name: 'props', ranges: [[420, 557]] },
  { name: 'level', ranges: [[558, 588]] },
  { name: 'backdrop', ranges: [[589, 626]] },
  { name: 'ground', ranges: [[627, 653]] },
  { name: 'fx', ranges: [[654, 675]] },
  { name: 'audio', ranges: [[676, 849]] },
  { name: 'input', ranges: [[850, 851]] },
  { name: 'player', ranges: [[852, 853]] },
  { name: 'combat', ranges: [[854, 856]] },
  { name: 'explosives', ranges: [[857, 858]] },
  { name: 'weapon', ranges: [[859, 903], [1009, 1044]] },
  { name: 'hands', ranges: [[904, 1008]] },
  { name: 'enemies', ranges: [[1045, 1069]] },
  { name: 'hud', ranges: [[1070, 1072]] },
  { name: 'menus', ranges: [[1073, 1080]] },
  { name: 'game', ranges: [[1081, 1082]] },
  { name: 'boot', ranges: [[1083, 1098]] },
];

// Verify 100% coverage of 332..1098
const covered = new Map();
for (const m of MODULES) {
  for (const [a, b] of m.ranges) {
    for (let i = a; i <= b; i++) {
      if (covered.has(i)) throw new Error(`Duplicate stmt ${i} in ${m.name} and ${covered.get(i)}`);
      covered.set(i, m.name);
    }
  }
}
for (let i = 332; i < iifeBody.length; i++) {
  if (!covered.has(i)) throw new Error(`Uncovered stmt ${i}`);
}

// Collect top-level declarations in #332..#1098 -> owning module
const symbolOwner = new Map();
function collectPatNames(pat, out) {
  if (!pat) return;
  if (pat.type === 'Identifier') out.push(pat.name);
  else if (pat.type === 'ArrayPattern') pat.elements.forEach(e => collectPatNames(e, out));
  else if (pat.type === 'ObjectPattern') pat.properties.forEach(p => collectPatNames(p.value || p.argument, out));
  else if (pat.type === 'RestElement') collectPatNames(pat.argument, out);
  else if (pat.type === 'AssignmentPattern') collectPatNames(pat.left, out);
}

for (const m of MODULES) {
  m.decls = new Set();
  for (const [a, b] of m.ranges) {
    for (let i = a; i <= b; i++) {
      const stmt = iifeBody[i];
      const names = [];
      if ((stmt.type === 'FunctionDeclaration' || stmt.type === 'ClassDeclaration') && stmt.id) {
        names.push(stmt.id.name);
      } else if (stmt.type === 'VariableDeclaration') {
        for (const d of stmt.declarations) collectPatNames(d.id, names);
      }
      for (const n of names) {
        m.decls.add(n);
        symbolOwner.set(n, m.name);
      }
    }
  }
}

// Also note `ar` (esbuild export helper) is from IIFE top-level before 332
symbolOwner.set('ar', 'core');

// Scope-aware walker to find free variable references in a statement
function findFreeRefsAndThreeReplacements(stmtNode) {
  const replacements = []; // { start, end, text }
  const freeRefs = new Set();

  // Build scope chain on the fly
  const scopes = [new Set()]; // root scope = empty (so all outer IIFE vars are "free" wrt stmt)

  function addScopeBindings(node, scope) {
    if (!node) return;
    const names = [];
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
      if (node.id && node.type !== 'FunctionDeclaration') names.push(node.id.name);
      for (const p of node.params) collectPatNames(p, names);
    } else if (node.type === 'BlockStatement' || node.type === 'Program') {
      for (const s of node.body) {
        if (s.type === 'FunctionDeclaration' && s.id) names.push(s.id.name);
        else if (s.type === 'ClassDeclaration' && s.id) names.push(s.id.name);
        else if (s.type === 'VariableDeclaration') {
          for (const d of s.declarations) collectPatNames(d.id, names);
        }
      }
    } else if (node.type === 'ForStatement' || node.type === 'ForInStatement' || node.type === 'ForOfStatement') {
      const init = node.init || node.left;
      if (init && init.type === 'VariableDeclaration') {
        for (const d of init.declarations) collectPatNames(d.id, names);
      }
    } else if (node.type === 'CatchClause' && node.param) {
      collectPatNames(node.param, names);
    }
    for (const n of names) scope.add(n);
  }

  function isBound(name) {
    for (let i = scopes.length - 1; i >= 0; i--) {
      if (scopes[i].has(name)) return true;
    }
    return false;
  }

  // Also collect var-hoisted names inside a function body
  function collectVarHoisted(node, scope) {
    walk.simple(node, {
      VariableDeclaration(vd) {
        if (vd.kind === 'var') {
          const names = [];
          for (const d of vd.declarations) collectPatNames(d.id, names);
          names.forEach(n => scope.add(n));
        }
      },
    }, {
      ...walk.base,
      FunctionDeclaration() {},
      FunctionExpression() {},
      ArrowFunctionExpression() {},
    });
  }

  function visit(node, isRef = true) {
    if (!node || typeof node !== 'object') return;

    switch (node.type) {
      case 'Identifier': {
        if (isRef && !isBound(node.name)) {
          if (node.name === 'ut') {
            replacements.push({ start: node.start, end: node.end, text: 'THREE' });
          } else if (threeMap[node.name]) {
            replacements.push({ start: node.start, end: node.end, text: `THREE.${threeMap[node.name]}` });
          } else {
            freeRefs.add(node.name);
          }
        }
        return;
      }
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'ArrowFunctionExpression': {
        const sc = new Set();
        addScopeBindings(node, sc);
        if (node.body && node.body.type === 'BlockStatement') {
          collectVarHoisted(node.body, sc);
        }
        scopes.push(sc);
        if (node.body) visit(node.body, true);
        scopes.pop();
        return;
      }
      case 'BlockStatement': {
        const sc = new Set();
        addScopeBindings(node, sc);
        scopes.push(sc);
        for (const s of node.body) visit(s, true);
        scopes.pop();
        return;
      }
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement': {
        const sc = new Set();
        addScopeBindings(node, sc);
        scopes.push(sc);
        if (node.init) visit(node.init, true);
        if (node.left) visit(node.left, node.left.type !== 'VariableDeclaration');
        if (node.right) visit(node.right, true);
        if (node.test) visit(node.test, true);
        if (node.update) visit(node.update, true);
        if (node.body) visit(node.body, true);
        scopes.pop();
        return;
      }
      case 'CatchClause': {
        const sc = new Set();
        addScopeBindings(node, sc);
        scopes.push(sc);
        if (node.body) visit(node.body, true);
        scopes.pop();
        return;
      }
      case 'VariableDeclaration': {
        for (const d of node.declarations) {
          // Handle destructuring default values if any
          if (d.init) visit(d.init, true);
        }
        return;
      }
      case 'MemberExpression': {
        visit(node.object, true);
        if (node.computed) visit(node.property, true);
        return;
      }
      case 'Property': {
        if (node.computed) visit(node.key, true);
        if (node.shorthand && isRef && node.value.type === 'Identifier') {
          // `{ K }` -> `{ K: THREE.Vector3 }` if K is free & in threeMap!
          if (!isBound(node.value.name) && threeMap[node.value.name]) {
            replacements.push({ start: node.start, end: node.end, text: `${node.key.name}: THREE.${threeMap[node.value.name]}` });
            return;
          }
        }
        visit(node.value, true);
        return;
      }
      case 'ClassDeclaration':
      case 'ClassExpression': {
        if (node.superClass) visit(node.superClass, true);
        for (const el of node.body.body) visit(el, true);
        return;
      }
      case 'MethodDefinition':
      case 'PropertyDefinition': {
        if (node.computed) visit(node.key, true);
        if (node.value) visit(node.value, true);
        return;
      }
      case 'LabeledStatement': {
        visit(node.body, true);
        return;
      }
      case 'BreakStatement':
      case 'ContinueStatement': {
        return;
      }
      default: {
        for (const k of Object.keys(node)) {
          if (k === 'type' || k === 'start' || k === 'end') continue;
          const v = node[k];
          if (Array.isArray(v)) {
            for (const item of v) {
              if (item && typeof item.type === 'string') visit(item, true);
            }
          } else if (v && typeof v.type === 'string') {
            visit(v, true);
          }
        }
      }
    }
  }

  visit(stmtNode, true);
  return { replacements, freeRefs };
}

// Analyze all modules
const moduleImports = new Map(); // modName -> Map<otherMod, Set<sym>>
const moduleExports = new Map(); // modName -> Set<sym>
for (const m of MODULES) {
  moduleImports.set(m.name, new Map());
  moduleExports.set(m.name, new Set());
}

for (const m of MODULES) {
  m.chunks = [];
  m.usesThree = false;
  for (const [a, b] of m.ranges) {
    for (let i = a; i <= b; i++) {
      const stmt = iifeBody[i];
      const { replacements, freeRefs } = findFreeRefsAndThreeReplacements(stmt);
      if (replacements.length > 0) m.usesThree = true;

      // Apply replacements in reverse order
      replacements.sort((x, y) => y.start - x.start);
      let code = bundle.slice(stmt.start, stmt.end);
      for (const r of replacements) {
        const rs = r.start - stmt.start;
        const re = r.end - stmt.start;
        code = code.slice(0, rs) + r.text + code.slice(re);
      }
      m.chunks.push(code);

      for (const ref of freeRefs) {
        if (m.decls.has(ref)) continue;
        const owner = symbolOwner.get(ref);
        if (owner && owner !== m.name) {
          if (!moduleImports.get(m.name).has(owner)) {
            moduleImports.get(m.name).set(owner, new Set());
          }
          moduleImports.get(m.name).get(owner).add(ref);
          moduleExports.get(owner).add(ref);
        }
      }
    }
  }
}

// Write modules to src/modules/
const outDir = path.resolve('src/modules');
fs.mkdirSync(outDir, { recursive: true });

for (const m of MODULES) {
  const lines = ['// @ts-nocheck'];
  if (m.usesThree) {
    lines.push("import * as THREE from 'three';");
  }
  const imps = moduleImports.get(m.name);
  for (const [other, syms] of imps.entries()) {
    lines.push(`import { ${[...syms].sort().join(', ')} } from './${other}.js';`);
  }
  lines.push('');

  if (m.name === 'core') {
    lines.push('export const ar = (n, e) => { for (const t in e) Object.defineProperty(n, t, { get: e[t], enumerable: true }); };');
    lines.push('');
  }

  lines.push(m.chunks.join('\n\n'));

  const exps = [...moduleExports.get(m.name)].filter(s => s !== 'ar').sort();
  if (exps.length > 0) {
    lines.push('');
    lines.push(`export { ${exps.join(', ')} };`);
  }

  let raw = lines.join('\n');
  // Patch legacy-v8 loader in menus.js to fetch /legacy/v8.html cleanly?
  // Note: in menus.js, rT() checks for legacy-v8 and aT() decodes it.
  // We'll keep rT/aT working by serving /legacy/v8.html via fetch or keeping a stub until P2,
  // or let's patch rT/aT right here if it's menus.
  if (m.name === 'menus') {
    raw = raw
      .replace(
        'function rT(){return!!document.getElementById(oT)}',
        'function rT(){return true}'
      )
      .replace(
        /function aT\(n\)\{[\s\S]*?return document\.open\(\),document\.write\(s\),document\.close\(\),!0\}/,
        'function aT(n){n.dead=!0;try{n.renderer.setAnimationLoop(null)}catch{}try{n.audio&&n.audio.ctx&&n.audio.ctx.close&&n.audio.ctx.close()}catch{}try{document.pointerLockElement&&document.exitPointerLock()}catch{}try{n.renderer.forceContextLoss()}catch{}location.href="/legacy/v8.html";return true}'
      );
  }

  let formatted = raw;
  try {
    formatted = await prettier.format(raw, { parser: 'babel', printWidth: 110, singleQuote: true });
  } catch (err) {
    console.warn(`Prettier failed for ${m.name}:`, err.message);
  }
  fs.writeFileSync(path.join(outDir, `${m.name}.js`), formatted);
  console.log(`Wrote src/modules/${m.name}.js (${m.chunks.length} stmts, ${exps.length} exports)`);
}

// Extract CSS -> src/styles/ui.css
const styleStart = html.indexOf('<style>') + '<style>'.length;
const styleEnd = html.indexOf('</style>');
const css = html.slice(styleStart, styleEnd).trim() + '\n';
fs.mkdirSync('src/styles', { recursive: true });
fs.writeFileSync('src/styles/ui.css', css);
console.log('Wrote src/styles/ui.css');

// Write src/main.ts
fs.writeFileSync(
  'src/main.ts',
  `import './styles/ui.css';\nimport './modules/boot.js';\n`
);

// Write root index.html
const newIndexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Saltline</title>
  <meta name="claude:viewport-fit-sides" content="cover">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;900&family=IBM+Plex+Mono:wght@400;500&family=Barlow+Condensed:wght@400;500;600&display=swap">
</head>
<body>
  <div id="app">
    <canvas id="view" tabindex="0"></canvas>
    <div id="ui"></div>
    <div id="boot">
      <div class="boot-mark">SALTLINE</div>
      <div class="boot-sub" id="boot-msg">Raising the terminal</div>
      <div class="boot-bar"><i id="boot-fill"></i></div>
    </div>
  </div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
`;
fs.writeFileSync('index.html', newIndexHtml);
console.log('Wrote root index.html and src/main.ts');
