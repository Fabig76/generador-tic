# Generador de actividades con TIC

Herramienta de un solo archivo que convierte cinco decisiones docentes en una ficha,
una secuencia con tiempos y dos rúbricas, y califica en vivo si esas decisiones se sostienen entre sí.

**Abrir:** https://fabig76.github.io/generador-tic/

## Qué hace

- **Semáforo de alineación.** Mientras el docente escribe, aplica la rúbrica del módulo a su diseño:
  detecta el verbo del resultado de aprendizaje, lo ubica en la taxonomía de Bloom revisada, avisa si no es
  observable («conocer», «comprender»), compara el nivel del verbo con el de la evidencia y revisa tiempo y
  restricciones. Cada criterio recibe nota, explicación y un botón para corregir.
- **Cinco piezas:** ficha de 5 campos, secuencia, rúbrica del diseño aplicada, rúbrica para valorar la
  evidencia del estudiante (cambia según el nivel del verbo) y trazabilidad de la herramienta.
- **Compartir con un colega.** Las decisiones viajan en el enlace (`#a=…`); no hay servidor.
- **Mi banco de actividades.** Se guarda en el navegador y se exporta o importa como archivo `.json`.
- **Sirve para cualquier disciplina** que pueda nombrar qué hace el estudiante y qué entrega; trae ejemplos
  cargables de salud, ingeniería, derecho, educación, ciencias económicas, comunicación y ciencias básicas.
- **Descargas:** PDF (impresión) y página `.html` autónoma.

La nota es una estimación por reglas, pensada para conversar sobre el diseño; no reemplaza el juicio docente.

## Archivos

- `index.html` — el generador (tema claro y oscuro, fondo 3D en canvas, sin dependencias, funciona sin conexión).
- `ejemplo.html` — salida real del botón «Descargar como página» para un curso de Ingeniería.

Actividad del módulo 72P05 «Una idea digital para mi área».
Heyler Fabio Guaza Lesmes · Especialización en Docencia Universitaria.


## Version 2 (rama `v2`)

- Perfil del docente con **etapa** (preescolar a educacion continua) y **modalidad** separadas.
- Duraciones de 30 a 240 minutos y actividades de **1 a 3 sesiones**.
- Catalogo con herramientas por disciplina: caso clinico, caso juridico, debate, laboratorio de campo, maqueta.
- **Deteccion explicable**: el chip del verbo permite corregir el nivel y la trazabilidad dice que regla se aplico.
- Pruebas de regresion en `tests/` (`node tests/correr.mjs`); las 9 notas de la v1 se conservan.

Vista previa: https://fabig76.github.io/generador-tic/v2/
