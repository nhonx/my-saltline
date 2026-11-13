#!/usr/bin/env node
/**
 * Scope-aware identifier renamer for the recovered src/modules/*.js files.
 *
 * Commands
 *   node tools/rename.mjs list  [module ...]   write tools/out/bindings/<module>.txt (minified bindings per scope)
 *   node tools/rename.mjs check [module ...]   validate tools/renames/*.json (no writes)
 *   node tools/rename.mjs apply [module ...]   validate and rewrite src/modules/*.js (+ ./modules imports in src/*.ts)
 *
 * Mapping files: tools/renames/<module>.<part>.json
 *   {
 *     "globals": { "oldTopLevelName": "newName" },          // module-level bindings; applied to ALL modules/imports
 *     "fns":     { "line:col": { "oldLocal": "newName" } }  // function starting at line:col (1-based line, 0-based col)
 *   }
 * A "fns" entry renames every binding with that old name declared in that function's own scope tree
 * (params, var/let/const, nested blocks) but NOT inside nested functions (give those their own entry).
 * Use "old@LINE" (LINE = line of that binding's declaration) to rename one specific declaration when the same
 * minified name is reused for different things inside one function; "old@LINE" wins over "old".
 *
 * Renames are binding-based, so shadowing/capture is checked. On a clash the tool appends a numeric suffix
 * to the new name (reported) so a mapping never silently changes behaviour.
 */
import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';

const MOD_DIR = path.resolve('src/modules');
const REN_DIR = path.resolve('tools/renames');
const OUT_DIR = path.resolve('tools/out/bindings');
const RESERVED = new Set(
  'break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static await async of undefined NaN Infinity arguments eval'.split(
    ' ',
  ),
);
const ID_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const MINIFIED = (n) => /^[A-Za-z_$][A-Za-z0-9_$]?$/.test(n) || /^[A-Za-z]{1,2}\d{1,2}$/.test(n);

class Scope {
  constructor(kind, parent, node) {
    this.kind = kind; // module | function | block
    this.parent = parent;
    this.node = node;
    this.bindings = new Map();
    this.children = [];
    this.fnScope = kind === 'block' ? parent.fnScope : this;
    this.unres = new Set();
    if (parent) parent.children.push(this);
  }
}
class Binding {
  constructor(name, scope, kind) {
    this.name = name;
    this.scope = scope;
    this.kind = kind;
    this.decls = []; // {node, shorthand, spec}
    this.refs = []; // {node, shorthand, spec}
    this.newName = null;
  }
}

function lineCol(src, pos) {
  let line = 1;
  let last = -1;
  for (let i = src.indexOf('\n'); i !== -1 && i < pos; i = src.indexOf('\n', i + 1)) {
    line++;
    last = i;
  }
  return { line, col: pos - last - 1 };
}

function analyze(src) {
  const ast = acorn.parse(src, { ecmaVersion: 2022, sourceType: 'module', allowHashBang: true });
  const moduleScope = new Scope('module', null, ast);
  const allScopes = [moduleScope];
  const pendingRefs = [];
  const imports = []; // ImportDeclaration nodes
  const exportsNamed = []; // ExportNamedDeclaration nodes

  const newScope = (kind, parent, node) => {
    const s = new Scope(kind, parent, node);
    allScopes.push(s);
    return s;
  };
  const declare = (scope, name, kind) => {
    let b = scope.bindings.get(name);
    if (!b) {
      b = new Binding(name, scope, kind);
      scope.bindings.set(name, b);
    }
    return b;
  };
  const ref = (node, scope, extra = {}) => pendingRefs.push({ node, scope, ...extra });

  function declarePattern(pat, scope, kind, shorthand = null) {
    if (!pat) return;
    switch (pat.type) {
      case 'Identifier':
        declare(scope, pat.name, kind).decls.push({ node: pat, shorthand });
        break;
      case 'ObjectPattern':
        for (const p of pat.properties) {
          if (p.type === 'RestElement') declarePattern(p.argument, scope, kind);
          else {
            if (p.computed) walk(p.key, scope);
            declarePattern(p.value, scope, kind, p.shorthand ? p.key.name : null);
          }
        }
        break;
      case 'ArrayPattern':
        pat.elements.forEach((e) => declarePattern(e, scope, kind));
        break;
      case 'AssignmentPattern':
        declarePattern(pat.left, scope, kind, shorthand);
        walk(pat.right, scope);
        break;
      case 'RestElement':
        declarePattern(pat.argument, scope, kind);
        break;
      default:
        throw new Error('unsupported pattern ' + pat.type);
    }
  }

  function walkFunction(node, scope) {
    const fs_ = newScope('function', scope, node);
    if (node.type === 'FunctionExpression' && node.id) declare(fs_, node.id.name, 'fname').decls.push({ node: node.id });
    for (const p of node.params) declarePattern(p, fs_, 'param');
    if (node.body.type === 'BlockStatement') node.body.body.forEach((s) => walk(s, fs_));
    else walk(node.body, fs_);
  }

  function walk(node, scope, extra = {}) {
    if (!node) return;
    switch (node.type) {
      case 'ImportDeclaration':
        imports.push(node);
        for (const sp of node.specifiers) {
          declare(scope, sp.local.name, 'import').decls.push({ node: sp.local, spec: sp, source: node.source.value });
        }
        return;
      case 'ExportNamedDeclaration':
        exportsNamed.push(node);
        if (node.declaration) walk(node.declaration, scope);
        else if (!node.source) for (const sp of node.specifiers) ref(sp.local, scope, { spec: sp });
        return;
      case 'ExportDefaultDeclaration':
      case 'ExportAllDeclaration':
        if (node.declaration) walk(node.declaration, scope);
        return;
      case 'FunctionDeclaration':
        declare(scope, node.id.name, 'function').decls.push({ node: node.id });
        walkFunction(node, scope);
        return;
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        walkFunction(node, scope);
        return;
      case 'ClassDeclaration':
        declare(scope, node.id.name, 'class').decls.push({ node: node.id });
        walk(node.superClass, scope);
        node.body.body.forEach((m) => walk(m, scope));
        return;
      case 'ClassExpression': {
        const cs = newScope('block', scope, node);
        if (node.id) declare(cs, node.id.name, 'class').decls.push({ node: node.id });
        walk(node.superClass, cs);
        node.body.body.forEach((m) => walk(m, cs));
        return;
      }
      case 'MethodDefinition':
      case 'PropertyDefinition':
        if (node.computed) walk(node.key, scope);
        if (node.value) walk(node.value, scope);
        return;
      case 'StaticBlock':
        node.body.forEach((s) => walk(s, scope));
        return;
      case 'VariableDeclaration': {
        const target = node.kind === 'var' ? scope.fnScope : scope;
        for (const d of node.declarations) {
          declarePattern(d.id, target, node.kind);
          walk(d.init, scope);
        }
        return;
      }
      case 'BlockStatement': {
        const bs = newScope('block', scope, node);
        node.body.forEach((s) => walk(s, bs));
        return;
      }
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement': {
        const bs = newScope('block', scope, node);
        for (const k of ['init', 'left', 'right', 'test', 'update', 'body']) walk(node[k], bs);
        return;
      }
      case 'CatchClause': {
        const cs = newScope('block', scope, node);
        if (node.param) declarePattern(node.param, cs, 'catch');
        node.body.body.forEach((s) => walk(s, cs));
        return;
      }
      case 'SwitchStatement': {
        walk(node.discriminant, scope);
        const ss = newScope('block', scope, node);
        for (const c of node.cases) {
          walk(c.test, ss);
          c.consequent.forEach((s) => walk(s, ss));
        }
        return;
      }
      case 'LabeledStatement':
        walk(node.body, scope);
        return;
      case 'BreakStatement':
      case 'ContinueStatement':
      case 'MetaProperty':
      case 'Literal':
      case 'TemplateElement':
        return;
      case 'Identifier':
        ref(node, scope, extra);
        return;
      case 'MemberExpression':
        walk(node.object, scope);
        if (node.computed) walk(node.property, scope);
        return;
      case 'Property':
        if (node.computed) walk(node.key, scope);
        if (node.shorthand) {
          const v = node.value.type === 'AssignmentPattern' ? node.value.left : node.value;
          ref(v, scope, { shorthand: node.key.name });
          if (node.value.type === 'AssignmentPattern') walk(node.value.right, scope);
        } else walk(node.value, scope);
        return;
      default:
        for (const k of Object.keys(node)) {
          if (k === 'type' || k === 'start' || k === 'end') continue;
          const v = node[k];
          if (Array.isArray(v)) v.forEach((c) => c && typeof c.type === 'string' && walk(c, scope));
          else if (v && typeof v.type === 'string') walk(v, scope);
        }
    }
  }

  ast.body.forEach((s) => walk(s, moduleScope));

  for (const r of pendingRefs) {
    let s = r.scope;
    let b = null;
    while (s && !(b = s.bindings.get(r.node.name))) s = s.parent;
    if (b) b.refs.push(r);
    else for (let t = r.scope; t; t = t.parent) t.unres.add(r.node.name);
  }
  return { ast, moduleScope, allScopes, imports, exportsNamed };
}

function allBindings(info) {
  const out = [];
  for (const s of info.allScopes) for (const b of s.bindings.values()) out.push(b);
  return out;
}

const finalName = (b) => b.newName ?? b.name;

function loadMappings(only) {
  const globals = {};
  const fnsByModule = {};
  if (!fs.existsSync(REN_DIR)) return { globals, fnsByModule };
  const only = process.env.RENAME_ONLY ? process.env.RENAME_ONLY.split(',') : null; // e.g. RENAME_ONLY=audio.a,audio.b
  for (const f of fs.readdirSync(REN_DIR).sort()) {
    if (!f.endsWith('.json')) continue;
    if (only && !only.some((p) => f === p + '.json')) continue;
    const mod = f.split('.')[0];
    const j = JSON.parse(fs.readFileSync(path.join(REN_DIR, f), 'utf8'));
    for (const [k, v] of Object.entries(j.globals || {})) {
      if (globals[k] && globals[k] !== v) throw new Error(`global ${k} mapped twice: ${globals[k]} vs ${v} (${f})`);
      globals[k] = v;
    }
    fnsByModule[mod] ||= {};
    for (const [k, v] of Object.entries(j.fns || {})) fnsByModule[mod][k] = { ...(fnsByModule[mod][k] || {}), ...v };
  }
  return { globals, fnsByModule };
}

function validName(n, where) {
  if (!ID_RE.test(n) || RESERVED.has(n)) throw new Error(`invalid identifier "${n}" (${where})`);
}

/** Assign tentative newName values to bindings from mapping. */
function assign(info, src, globals, fns, modName, errors) {
  const fnKeyOf = new Map();
  for (const s of info.allScopes) {
    if (s.kind === 'function') {
      const { line, col } = lineCol(src, s.node.start);
      fnKeyOf.set(s, `${line}:${col}`);
    }
  }
  const usedKeys = new Set();
  for (const s of info.allScopes) {
    const owner = s.fnScope;
    for (const b of s.bindings.values()) {
      let nn = null;
      if (s === info.moduleScope) {
        if (globals[b.name]) nn = globals[b.name];
      } else if (owner.kind === 'function') {
        const key = fnKeyOf.get(owner);
        const m = fns[key];
        if (m) {
          const d0 = b.decls[0]?.node;
          const declLine = d0 ? lineCol(src, d0.start).line : -1;
          const exact = `${b.name}@${declLine}`;
          if (m[exact]) {
            nn = m[exact];
            usedKeys.add(key + '|' + exact);
          } else if (m[b.name]) {
            nn = m[b.name];
            usedKeys.add(key + '|' + b.name);
          }
        }
      }
      if (nn && nn !== b.name) {
        validName(nn, `${modName} ${b.name}`);
        b.newName = nn;
      }
    }
  }
  for (const [key, m] of Object.entries(fns)) {
    for (const old of Object.keys(m)) {
      if (!usedKeys.has(key + '|' + old)) errors.push(`${modName}: fns["${key}"]["${old}"] matched no binding (stale key or wrong name)`);
    }
  }
}

/** Find conflicts; return Set of bindings that should get a suffix. */
function findConflicts(info) {
  const bad = new Set();
  const bindings = allBindings(info);
  for (const s of info.allScopes) {
    const seen = new Map();
    for (const b of s.bindings.values()) {
      const n = finalName(b);
      if (seen.has(n)) bad.add(b.newName ? b : seen.get(n));
      else seen.set(n, b);
    }
  }
  for (const b of bindings) {
    const n = finalName(b);
    for (const r of b.refs) {
      for (let s = r.scope; s && s !== b.scope; s = s.parent) {
        const o = [...s.bindings.values()].find((x) => x !== b && finalName(x) === n);
        if (o) bad.add(b.newName ? b : o.newName ? o : b);
      }
    }
    if (b.scope.unres.has(n)) bad.add(b);
  }
  return bad;
}

function resolveConflicts(info, modName, notes) {
  for (let iter = 0; iter < 30; iter++) {
    const bad = findConflicts(info);
    if (!bad.size) return true;
    let progressed = false;
    for (const b of bad) {
      if (!b.newName) continue;
      const m = b.newName.match(/^(.*?)(\d+)$/);
      const next = m ? m[1] + (Number(m[2]) + 1) : b.newName + '2';
      notes.push(`${modName}: "${b.name}" -> "${b.newName}" clashes, using "${next}"`);
      b.newName = next;
      progressed = true;
    }
    if (!progressed) return false;
  }
  return false;
}

function buildEdits(info, src, globals, srcIsSibling) {
  const edits = [];
  const push = (node, text) => edits.push({ start: node.start, end: node.end, text });
  for (const b of allBindings(info)) {
    if (!b.newName) continue;
    for (const d of b.decls) {
      if (d.spec) continue;
      push(d.node, d.shorthand ? `${d.shorthand}: ${b.newName}` : b.newName);
    }
    for (const r of b.refs) {
      if (r.spec) continue;
      push(r.node, r.shorthand ? `${r.shorthand}: ${b.newName}` : b.newName);
    }
  }
  const localOf = (id) => {
    const b = info.moduleScope.bindings.get(id.name);
    return b ? finalName(b) : id.name;
  };
  for (const imp of info.imports) {
    const sibling = String(imp.source.value).startsWith('./');
    for (const sp of imp.specifiers) {
      if (sp.type !== 'ImportSpecifier') continue;
      const imported = sibling ? globals[sp.imported.name] || sp.imported.name : sp.imported.name;
      const local = localOf(sp.local);
      const text = imported === local ? local : `${imported} as ${local}`;
      if (src.slice(sp.start, sp.end) !== text) edits.push({ start: sp.start, end: sp.end, text });
    }
  }
  for (const ex of info.exportsNamed) {
    if (ex.declaration) continue;
    for (const sp of ex.specifiers) {
      const exported = globals[sp.exported.name] || sp.exported.name;
      const local = ex.source ? sp.local.name : localOf(sp.local);
      const text = local === exported ? local : `${local} as ${exported}`;
      if (src.slice(sp.start, sp.end) !== text) edits.push({ start: sp.start, end: sp.end, text });
    }
  }
  return edits;
}

function applyEdits(src, edits) {
  edits.sort((a, b) => b.start - a.start);
  for (let i = 1; i < edits.length; i++) if (edits[i].end > edits[i - 1].start) throw new Error('overlapping edits');
  let out = src;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

function moduleList(args) {
  const all = fs
    .readdirSync(MOD_DIR)
    .filter((f) => f.endsWith('.js'))
    .map((f) => f.replace(/\.js$/, ''));
  return args.length ? args : all;
}

function cmdList(mods) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const m of mods) {
    const src = fs.readFileSync(path.join(MOD_DIR, m + '.js'), 'utf8');
    const info = analyze(src);
    const lines = [];
    let count = 0;
    const top = [...info.moduleScope.bindings.values()].filter((b) => MINIFIED(b.name));
    lines.push(`# ${m}.js  top-level minified bindings (use "globals")`);
    for (const b of top) {
      const { line } = lineCol(src, (b.decls[0]?.node ?? b.decls[0]).start);
      lines.push(`  ${b.name}  ${b.kind}  decl@L${line}  refs=${b.refs.length}`);
      count++;
    }
    for (const s of info.allScopes) {
      if (s.kind !== 'function') continue;
      const own = [];
      const stack = [s];
      while (stack.length) {
        const x = stack.pop();
        for (const c of x.children) if (c.kind === 'block') stack.push(c);
        for (const b of x.bindings.values()) if (MINIFIED(b.name)) own.push(b);
      }
      if (!own.length) continue;
      const { line, col } = lineCol(src, s.node.start);
      const head = src.slice(s.node.start, s.node.start + 90).replace(/\s+/g, ' ');
      const endLine = lineCol(src, s.node.end).line;
      lines.push('');
      lines.push(`## fns["${line}:${col}"]  L${line}-L${endLine}  ${head}`);
      lines.push('  ' + own.map((b) => `${b.name}@${lineCol(src, b.decls[0].node.start).line}(${b.kind},${b.refs.length})`).join('  '));
      count += own.length;
    }
    fs.writeFileSync(path.join(OUT_DIR, m + '.txt'), lines.join('\n') + '\n');
    console.log(`${m}: ${count} minified bindings -> tools/out/bindings/${m}.txt`);
  }
}

function runAll(mods, write) {
  const { globals, fnsByModule } = loadMappings();
  const errors = [];
  const notes = [];
  const results = [];
  // Collect info for ALL modules so global renames propagate to importers.
  const allMods = moduleList([]);
  const infos = {};
  for (const m of allMods) {
    const src = fs.readFileSync(path.join(MOD_DIR, m + '.js'), 'utf8');
    const info = analyze(src);
    infos[m] = { src, info };
    assign(info, src, globals, fnsByModule[m] || {}, m, errors);
  }
  for (const m of allMods) {
    if (!resolveConflicts(infos[m].info, m, notes)) errors.push(`${m}: unresolved rename conflicts`);
  }
  // Global names must stay consistent across modules: a global rename suffixed in one module must not diverge.
  const gFinal = {};
  for (const m of allMods) {
    for (const b of infos[m].info.moduleScope.bindings.values()) {
      if (globals[b.name] && b.newName && b.newName !== globals[b.name]) {
        errors.push(`${m}: global "${b.name}" -> "${globals[b.name]}" conflicts locally and was suffixed to "${b.newName}"; pick another name`);
      }
      if (b.newName) {
        const prev = gFinal[b.name];
        if (prev && prev !== b.newName) errors.push(`global ${b.name} resolved to different names (${prev} / ${b.newName})`);
        gFinal[b.name] = b.newName;
      }
    }
  }
  for (const m of allMods) {
    const { src, info } = infos[m];
    const edits = buildEdits(info, src, globals);
    results.push({ m, out: edits.length ? applyEdits(src, edits) : src, changed: edits.length });
  }
  notes.forEach((n) => console.log('note:', n));
  if (errors.length) {
    errors.forEach((e) => console.error('ERROR:', e));
    console.error(`${errors.length} error(s); nothing written.`);
    process.exit(1);
  }
  // Re-parse outputs to make sure they are syntactically valid.
  for (const r of results) acorn.parse(r.out, { ecmaVersion: 2022, sourceType: 'module', allowHashBang: true });
  let total = 0;
  for (const r of results) {
    total += r.changed;
    if (write && r.changed) fs.writeFileSync(path.join(MOD_DIR, r.m + '.js'), r.out);
  }
  if (write) fixTsImports(globals);
  console.log(`${write ? 'applied' : 'checked'}: ${total} edits across ${results.filter((r) => r.changed).length} modules, ${Object.keys(globals).length} globals`);
}

/** Update `import {..} from './modules/x.js'` in src/*.ts and rename the imported locals used there. */
function fixTsImports(globals) {
  const dir = path.resolve('src');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ts'))) {
    const p = path.join(dir, f);
    let s = fs.readFileSync(p, 'utf8');
    const orig = s;
    const names = new Set();
    s = s.replace(/import\s*\{([^}]*)\}\s*from\s*'(\.\/modules\/[^']+)'/g, (m, list, from) => {
      const out = list.split(',').map((x) => x.trim()).filter(Boolean).map((n) => {
        if (n.includes(' as ')) return n;
        if (globals[n]) names.add(n);
        return globals[n] || n;
      });
      return `import { ${out.join(', ')} } from '${from}'`;
    });
    for (const n of names) s = s.replace(new RegExp(`(?<![\\w$.'"])${n.replace(/\$/g, '\\$')}(?![\\w$'"])`, 'g'), (mm, off) => (s.slice(off - 8, off).includes('import') ? mm : globals[n]));
    if (s !== orig) {
      fs.writeFileSync(p, s);
      console.log('updated imports in', f);
    }
  }
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === 'list') cmdList(moduleList(rest));
else if (cmd === 'check') runAll(moduleList(rest), false);
else if (cmd === 'apply') runAll(moduleList(rest), true);
else {
  console.error('usage: rename.mjs list|check|apply [module ...]');
  process.exit(2);
}
