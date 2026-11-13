import fs from 'node:fs';

const html = fs.readFileSync('reference/original.html', 'utf8');
const legacyEnd = html.indexOf('</script>', html.indexOf('id="legacy-v8"'));
const s = html.indexOf('<script>', legacyEnd) + 8;
const e = html.lastIndexOf('</script>');
const b = html.slice(s, e);

const m = b.match(/ar\(ut,\{([^}]+)\}\)/);
const pairs = m[1].split(',').map(x => x.split(':()=>'));
console.log('THREE exports count:', pairs.length);
const threeMap = Object.fromEntries(pairs.map(([pub, priv]) => [priv, pub]));
fs.writeFileSync('tools/out/three-map.json', JSON.stringify(threeMap, null, 2));

const stmts = JSON.parse(fs.readFileSync('tools/out/statements.json', 'utf8'));
for (const x of stmts) {
  if (x.i < 332) continue;
  if (x.preview.startsWith('ar(') || x.len > 3000 || x.names.some(n => ['v_', 'fv', 'cE', 'gE', 'xE', 'ey', 'yE', 'sT', 'pT', 'cL'].includes(n))) {
    console.log(`#${x.i} [${x.start}..${x.end}] (${x.len}b) ${x.names.join(',')}: ${x.preview.slice(0, 85)}`);
  }
}

