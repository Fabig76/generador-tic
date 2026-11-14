// Batería de pruebas de la v2. Uso: node tests/pruebas.mjs [url-o-archivo]
import { createRequire } from 'module';
import path from 'node:path'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const puppeteer = require('/Users/hguaza/Documents/deepseek-harness/default-workspace/pdf-kit/node_modules/puppeteer-core');
const aquí = path.dirname(fileURLToPath(import.meta.url));
const destino = process.argv[2] || path.join(aquí, '..', 'index.html');
const url = /^https?:/.test(destino) ? destino : 'file://' + encodeURI(path.resolve(destino));

const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--no-sandbox'] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 1000 });
const errores = []; p.on('pageerror', e => errores.push(e.message));
p.on('console', m => { if (m.type() === 'error') errores.push('consola: ' + m.text()); });

const res = []; const ok = (n, c, d = '') => res.push({ n, c: !!c, d });
await p.goto(url, { waitUntil: 'networkidle2' }); await new Promise(r => setTimeout(r, 2300));

ok('Carga sin errores', errores.length === 0, errores.slice(0, 2).join(' | '));
ok('Ejemplo cargado al abrir', await p.evaluate(() => document.getElementById('resultado').classList.contains('visible')));

const esperado = JSON.parse(fs.readFileSync(path.join(aquí, 'linea-base.json'), 'utf8'));
const actual = await p.evaluate(() => {
  const o = {}; for (const [k, c] of Object.entries(CASOS)) { const r = analizar(c); o[k] = { nota: r.nota, herr: r.H?.herr?.n }; } return o;
});
const bajadas = Object.keys(esperado).filter(k => actual[k].nota < esperado[k].nota - 0.05);
ok('Ningún caso baja de 4,0 tras el quinto criterio',
   bajadas.every(k => actual[k].nota >= 4.0) && actual.antes.nota <= 3.0,
   Object.keys(esperado).map(k => `${k} ${esperado[k].nota}→${actual[k].nota}`).join(' · '));

const compat = await p.evaluate(() => {
  const d = Object.assign({}, CASOS.ing); const cod = codificar(d); const r = decodificar(cod);
  return { rae: r.rae === d.rae, area: r.area === d.area, dur: r.duracion === d.duracion };
});
ok('Enlace #a= de la v1 se decodifica igual', compat.rae && compat.area && compat.dur, JSON.stringify(compat));

const ctrl = await p.evaluate(() => ({
  etapa: document.querySelectorAll('#etapa .opcion').length,
  modalidad: document.querySelectorAll('#modalidad .opcion').length,
  duracion: document.querySelectorAll('#duracion .opcion').length,
  sesiones: document.querySelectorAll('#sesiones .opcion').length,
  dua: document.querySelectorAll('#dua .opcion').length,
  criterios: document.querySelectorAll('#criterios .crit').length,
  pestanas: document.querySelectorAll('#pestanas button').length
}));
ok('Ocho etapas educativas', ctrl.etapa === 8, ctrl.etapa);
ok('Cuatro modalidades', ctrl.modalidad === 4, ctrl.modalidad);
ok('Siete opciones de duración', ctrl.duracion === 7, ctrl.duracion);
ok('Tres opciones de sesiones', ctrl.sesiones === 3, ctrl.sesiones);
ok('Dos chips de accesibilidad', ctrl.dua === 2, ctrl.dua);
ok('Cinco criterios en el semáforo', ctrl.criterios === 5, ctrl.criterios);
ok('Cinco pestañas de resultado', ctrl.pestanas === 5, ctrl.pestanas);

const recalc = await p.evaluate(() => {
  document.querySelector('#etapa .opcion[data-v="preescolar"]').click();
  const dur = leer().duracion;
  document.querySelector('#modalidad .opcion[data-v="virtual"]').click();
  return { dur, nivel: leer().nivel };
});
ok('Cambiar etapa ajusta la duración típica', recalc.dur === 30, `preescolar → ${recalc.dur} min`);
ok('Cambiar modalidad cambia el nivel', /virtual/.test(recalc.nivel), recalc.nivel);

const doms = await p.evaluate(() => {
  const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); };
  const r = {};
  set('area', 'Enfermería · urgencias'); set('rae', 'Ejecutar la técnica de RCP básica en un maniquí siguiendo la secuencia completa');
  set('evidencia', 'La lista de chequeo diligenciada por un par y el video de la ejecución');
  const a = analizar(leer()); r.psico = { dom: a.dom, nv: a.nv, nota: a.nota };
  set('area', 'Ética · convivencia'); set('rae', 'Valorar la diversidad cultural del grupo');
  set('evidencia', 'El diario reflexivo con tres decisiones propias');
  const b2 = analizar(leer()); r.afect = { dom: b2.dom, nv: b2.nv, nota: b2.nota };
  set('area', 'Derecho · familia'); set('rae', 'Analizar un caso de alimentos entre padres separados');
  set('evidencia', 'El escrito de análisis con la norma aplicada');
  const c = analizar(leer()); r.cog = { dom: c.dom, nv: c.nv, nota: c.nota };
  return r;
});
ok('RCP se detecta como psicomotor', doms.psico.dom === 'psicomotor' && doms.psico.nota >= 4.4, JSON.stringify(doms.psico));
ok('Valorar se detecta como afectivo', doms.afect.dom === 'afectivo' && doms.afect.nota >= 4.4, JSON.stringify(doms.afect));
ok('Derecho sigue en cognitivo', doms.cog.dom === 'cognitivo', JSON.stringify(doms.cog));

const fij = await p.evaluate(() => {
  const s = document.getElementById('fijarNivel'); if (!s) return { hay: false };
  s.value = 'crear'; s.dispatchEvent(new Event('change', { bubbles: true }));
  const a = analizar(leer()); return { hay: true, fijado: a.fijado, nv: a.nv };
});
ok('El docente puede fijar el nivel', fij.hay && fij.fijado === true && fij.nv === 'crear', JSON.stringify(fij));

const dua = await p.evaluate(() => {
  cargar(Object.assign({}, CASOS.ing)); generar(true);          /* caso limpio, sin tope por evidencia */
  const a1 = analizar(leer());
  document.querySelectorAll('#dua .opcion').forEach(b => b.click());
  const a2 = analizar(leer());
  return { marcados: document.querySelectorAll('#dua .opcion.on').length,
           colAntes: a1.crit[4].col, colDesp: a2.crit[4].col,
           notaAntes: a1.nota, notaDesp: a2.nota };
});
ok('Los chips DUA mejoran el quinto criterio', dua.marcados === 2 && dua.colDesp < dua.colAntes,
   `criterio ${dua.colAntes}→${dua.colDesp} · nota ${dua.notaAntes}→${dua.notaDesp}`);

const banco = await p.evaluate(() => { document.getElementById('guardar').click(); return leerBanco().length; });
ok('Guardar en el banco', banco >= 1, `${banco} actividades`);

await p.emulateMediaType('print'); await new Promise(r => setTimeout(r, 500));
const impresion = await p.evaluate(() => {
  const t = document.body.innerText;
  return { ficha: /Ficha/i.test(t), secuencia: /Secuencia/i.test(t), diseno: /Rúbrica del diseño/i.test(t),
           est: /Rúbrica para/i.test(t), traza: /Trazabilidad|Por qué esta herramienta/i.test(t) };
});
ok('La impresión trae las cinco secciones', Object.values(impresion).every(Boolean), JSON.stringify(impresion));

await b.close();
const mal = res.filter(r => !r.c);
console.log('\n' + res.map(r => `${r.c ? '✓' : '✗'} ${r.n}${r.d ? ' — ' + r.d : ''}`).join('\n'));
console.log(`\n${res.length - mal.length}/${res.length} en verde`);
process.exit(mal.length ? 1 : 0);
