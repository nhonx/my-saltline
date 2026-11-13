import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { chromium } from 'playwright';

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? 'true'];
  })
);

const mode = args.mode || 'verify'; // 'baseline' | 'verify'
const rootDir = path.resolve(args.dir || (mode === 'baseline' ? 'reference' : 'dist'));
const entryFile = args.entry || (mode === 'baseline' ? 'original.html' : 'index.html');
const outDir = path.resolve(mode === 'baseline' ? 'tools/baseline/expected' : 'tools/baseline/actual');
const expectedDir = path.resolve('tools/baseline/expected');

fs.mkdirSync(outDir, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function startServer(dir) {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const urlPath = (req.url || '/').split('?')[0];
      const rel = urlPath === '/' ? entryFile : urlPath.replace(/^\/+/, '');
      const full = path.join(dir, rel);
      if (!full.startsWith(dir) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(full);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(full).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, url: `http://127.0.0.1:${addr.port}/` });
    });
  });
}

// Minimal PNG RGBA decoder for pixel diffing without extra deps
function decodePngRgba(buf) {
  let off = 8; // skip signature
  let w = 0, h = 0, bitDepth = 0, colorType = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    off += 12 + len;
  }
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    throw new Error(`Unsupported PNG format: bitDepth=${bitDepth} colorType=${colorType}`);
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * bpp;
  const out = Buffer.alloc(w * h * 4);
  const prev = Buffer.alloc(stride);
  const curr = Buffer.alloc(stride);

  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)];
    const rowStart = y * (stride + 1) + 1;
    for (let i = 0; i < stride; i++) {
      const x = raw[rowStart + i];
      const a = i >= bpp ? curr[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let val = x;
      if (filter === 1) val = (x + a) & 0xff;
      else if (filter === 2) val = (x + b) & 0xff;
      else if (filter === 3) val = (x + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        val = (x + pr) & 0xff;
      }
      curr[i] = val;
    }
    for (let x = 0; x < w; x++) {
      const di = (y * w + x) * 4;
      const si = x * bpp;
      out[di] = curr[si];
      out[di + 1] = curr[si + 1];
      out[di + 2] = curr[si + 2];
      out[di + 3] = bpp === 4 ? curr[si + 3] : 255;
    }
    curr.copy(prev);
  }
  return { width: w, height: h, data: out };
}

function comparePng(expectedPath, actualPath) {
  const a = decodePngRgba(fs.readFileSync(expectedPath));
  const b = decodePngRgba(fs.readFileSync(actualPath));
  if (a.width !== b.width || a.height !== b.height) {
    return { match: false, reason: `size mismatch ${a.width}x${a.height} vs ${b.width}x${b.height}`, diffPct: 100 };
  }
  let diffPixels = 0;
  let maxDelta = 0;
  const total = a.width * a.height;
  for (let i = 0; i < a.data.length; i += 4) {
    const dr = Math.abs(a.data[i] - b.data[i]);
    const dg = Math.abs(a.data[i + 1] - b.data[i + 1]);
    const db = Math.abs(a.data[i + 2] - b.data[i + 2]);
    const d = Math.max(dr, dg, db);
    if (d > 4) {
      diffPixels++;
      if (d > maxDelta) maxDelta = d;
    }
  }
  const diffPct = (diffPixels / total) * 100;
  return { match: diffPct <= 0.5, diffPixels, total, diffPct: +diffPct.toFixed(4), maxDelta };
}

const SHOTS = [
  { name: 'title', query: '?seed=4207&noaudio=1&q=medium&dt=0.016&step=8' },
  { name: 'gameplay-spawn', query: '?seed=4207&noaudio=1&q=medium&autostart=1&dt=0.016&step=8' },
  { name: 'gameplay-quay', query: '?seed=4207&noaudio=1&q=medium&shot=1&cam=0,3,25,0,2,0&dt=0.016&step=5' },
  { name: 'gameplay-shed', query: '?seed=4207&noaudio=1&q=medium&shot=1&cam=-18,3,0,0,2,0&dt=0.016&step=5' },
  { name: 'show-mats', query: '?show=mats&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-level', query: '?show=level&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-backdrop', query: '?show=backdrop&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-ground', query: '?show=ground&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-fx', query: '?show=fx&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-weapon', query: '?show=weapon&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-hands', query: '?show=hands&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-enemies', query: '?show=enemies&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-props', query: '?show=props&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
  { name: 'show-render', query: '?show=render&seed=4207&noaudio=1&q=medium&dt=0.016&step=5' },
];

const { server, url } = await startServer(rootDir);
console.log(`Serving ${rootDir}/${entryFile} at ${url} (${mode})`);

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});

const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
const page = await context.newPage();

// Block external Google Fonts so offline/sandboxed runs don't stall
await page.route('https://fonts.googleapis.com/**', r => r.abort());
await page.route('https://fonts.gstatic.com/**', r => r.abort());

const report = [];
let failed = false;

for (const shot of SHOTS) {
  const pageErrors = [];
  const onPageErr = e => pageErrors.push(String(e));
  page.on('pageerror', onPageErr);

  await page.goto(url + shot.query, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => window.__ready === true || window.__fatal !== null, null, { timeout: 90000 });
  await page.waitForTimeout(750);

  const info = await page.evaluate(() => ({
    ready: window.__ready,
    fatal: window.__fatal,
    frames: window.__frames,
    errors: window.__errors || [],
    stats: typeof window.__stats === 'function' ? window.__stats() : null,
  }));

  const imgPath = path.join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: imgPath });
  page.off('pageerror', onPageErr);

  let diff = null;
  if (mode === 'verify') {
    const expPath = path.join(expectedDir, `${shot.name}.png`);
    if (fs.existsSync(expPath)) {
      diff = comparePng(expPath, imgPath);
      if (!diff.match) failed = true;
    } else {
      diff = { match: false, reason: 'missing baseline' };
      failed = true;
    }
  }

  if (info.fatal || info.errors.length > 0 || pageErrors.length > 0) {
    failed = true;
  }

  const row = { name: shot.name, ...info, pageErrors, diff };
  report.push(row);
  console.log(
    `[${shot.name}] ready=${info.ready} frames=${info.frames} errs=${info.errors.length + pageErrors.length}` +
      (diff ? ` diff=${diff.diffPct ?? diff.reason}% (${diff.match ? 'PASS' : 'FAIL'})` : '')
  );
}

fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
await browser.close();
server.close();

if (failed) {
  console.error('PARITY CHECK FAILED');
  process.exit(1);
}
console.log('PARITY CHECK PASSED');

