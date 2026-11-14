// Arnes de regresión: abre index.html, corre los 9 casos y devuelve el JSON del motor.
// Uso: node tests/correr.mjs [ruta-index] > salida.json
import { createRequire } from 'module';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const puppeteer = require('/Users/hguaza/Documents/deepseek-harness/default-workspace/pdf-kit/node_modules/puppeteer-core');
const aquí = path.dirname(fileURLToPath(import.meta.url));
const archivo = path.resolve(process.argv[2] || path.join(aquí, '..', 'index.html'));

const b = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--no-sandbox', '--allow-file-access-from-files']
});
const p = await b.newPage();
const errores = []; p.on('pageerror', e => errores.push(e.message));
await p.goto('file://' + encodeURI(archivo), { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 1800));

const salida = await p.evaluate(() => {
  const out = {};
  for (const [k, c] of Object.entries(CASOS)) {
    const r = analizar(c);
    out[k] = {
      nota: r.nota, etq: r.etq, nv: r.nv,
      herr: r.H?.herr?.n || null, grupo: r.H?.grupo || null,
      cols: (r.crit || []).map(x => x.col)
    };
  }
  return out;
});
await b.close();
if (errores.length) { console.error('ERRORES DE PÁGINA:', errores); process.exit(1); }
console.log(JSON.stringify(salida, null, 1));
