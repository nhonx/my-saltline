import fs from 'node:fs';
import path from 'node:path';
import * as acorn from 'acorn';

const htmlPath = path.resolve('reference/original.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Find the main game script (the last <script> block, after legacy-v8)
const legacyEnd = html.indexOf('</script>', html.indexOf('id="legacy-v8"'));
const scriptStart = html.indexOf('<script>', legacyEnd) + '<script>'.length;
const scriptEnd = html.lastIndexOf('</script>');
const bundle = html.slice(scriptStart, scriptEnd);

console.log(`Bundle length: ${bundle.length} chars`);

const ast = acorn.parse(bundle, { ecmaVersion: 2022, sourceType: 'script' });
// Expect outer IIFE: (()=>{ ... })();
const iifeExpr = ast.body[0].expression;
const fnBody = iifeExpr.callee.body.body;

console.log(`Top-level statements inside IIFE: ${fnBody.length}`);

const out = [];
for (let i = 0; i < fnBody.length; i++) {
  const stmt = fnBody[i];
  const len = stmt.end - stmt.start;
  let kind = stmt.type;
  let names = [];
  if (stmt.type === 'FunctionDeclaration' && stmt.id) {
    names.push(stmt.id.name);
  } else if (stmt.type === 'VariableDeclaration') {
    names = stmt.declarations.map(d => d.id.name).filter(Boolean);
  } else if (stmt.type === 'ClassDeclaration' && stmt.id) {
    names.push(stmt.id.name);
  }
  const preview = bundle.slice(stmt.start, Math.min(stmt.end, stmt.start + 90)).replace(/\s+/g, ' ');
  out.push({ i, start: stmt.start, end: stmt.end, len, kind, names, preview });
}

fs.mkdirSync('tools/out', { recursive: true });
fs.writeFileSync('tools/out/statements.json', JSON.stringify(out, null, 2));
console.log(`Wrote tools/out/statements.json (${out.length} statements)`);

// Print summary of statements after WebGLRenderer (around offset 669000+)
const webglIdx = out.findIndex(s => s.preview.includes('WebGLRenderer') || bundle.slice(s.start, s.end).includes('WebGLRenderer='));
console.log(`WebGLRenderer at stmt #${webglIdx} (start=${out[webglIdx]?.start})`);
for (let i = Math.max(0, webglIdx); i < Math.min(out.length, webglIdx + 40); i++) {
  const s = out[i];
  console.log(`#${s.i} [${s.start}..${s.end}] (${s.len}b) ${s.kind} ${s.names.join(',')} :: ${s.preview}`);
}

