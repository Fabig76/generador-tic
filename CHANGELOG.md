# Cambios

## v2 (14 de noviembre de 2026) — rama `v2`

Motor y pruebas
- Arnes de regresion en `tests/correr.mjs` con la linea base de los 9 casos (`tests/linea-base.json`).
- Las 9 notas de la v1 se conservan exactas tras todos los cambios.

Correcciones
- C1: existen las seis combinaciones de pregrado y posgrado (presencial, virtual, hibrida).
- C5: la evidencia se queda con el nivel mas alto que aparece, no con el ultimo. Se listan los demas en trazabilidad.
- C6: un resultado de aprendizaje corto pero valido ya se analiza (umbral 12 → 8 caracteres).
- C11: los chips son `role="radio"` con `aria-checked` y `aria-pressed`.
- C12: el indicador circular anuncia nota y etiqueta con `aria-label`.

M7 · Deteccion explicable
- El chip del verbo dice que palabra lo ubico y permite corregir el nivel; la correccion viaja en `d.fijado`.
- La trazabilidad explica la regla en palabras claras y muestra la evidencia fijada a mano.

M4 · Catalogo por disciplina (reducido)
- Diez herramientas nuevas: caso clinico con lista de chequeo, simulacion con maniqui, caso juridico con expediente,
  laboratorio o salida de campo, debate estructurado, estudio de caso con acta, escrito guiado, maqueta,
  lista de chequeo observacional y material concreto.
- La herramienta se elige dando prioridad a lo que el resultado de aprendizaje nombra sobre lo que nombra la evidencia.
- Enfermeria deja de recibir una hoja de calculo; Derecho deja de recibir un muro.

M1 · Perfil del docente
- `etapa` (8 niveles, de preescolar a educacion continua) y `modalidad` (4, incluida remota de conexion intermitente)
  separadas del campo `nivel`, que se conserva derivado para no romper enlaces de la v1.
- Al cambiar de etapa sin haber tocado la duracion, se aplica la sesion tipica de esa etapa.

M5 · Tiempo flexible
- Duraciones de 30, 45, 55, 60, 90 y 120 minutos, mas un campo libre de 20 a 240.
- `sesiones` (1 a 3) y reparto proporcional del tiempo cuando la duracion no es una de las tres clasicas.
- La viabilidad cuenta el total de sesiones y ofrece «Dividir en 2 sesiones».

## v2 · segunda tanda

M2 · Tres dominios de aprendizaje
- Escalas propias para psicomotor (percibir → naturalizar) y afectivo (recibir → caracterizar).
- Verbos, evidencias, rubrica del estudiante y minutos minimos por dominio.
- Deteccion por senales del contexto, con selector para corregir el dominio a mano.
- Grupos de herramienta nuevos: `practicar` y `reflexionar`.

M3 · Tipo de aprendizaje (Laurillard / ABC Learning Design)
- Cada actividad declara su forma: adquisicion, indagacion, practica, produccion, discusion o colaboracion.
- Si el resultado solo pide ver, leer o escuchar, el criterio 2 lo marca y ofrece convertirlo en produccion.
- La trazabilidad muestra el tipo y la regla que lo produjo.

M6 · Accesibilidad (DUA)
- Quinto criterio del semaforo con cinco senales; dos chips nuevos en el formulario.
- La nota pasa a ser el promedio de cinco criterios. El descenso es intencional y esta documentado.

M8 · PWA
- `manifest.json`, `sw.js` e iconos. Se registran solo por https; desde `file://` no se intenta nada.
- Sin asistente de IA: contradice el argumento de que el semaforo es determinista y auditable.

Pruebas
- `tests/pruebas.mjs`: 20 comprobaciones (carga, enlaces de la v1, controles, dominios, correccion manual, DUA, banco, impresion). Verdes en local y en la vista publicada.
