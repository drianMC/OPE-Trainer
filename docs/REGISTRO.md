# Registro de trabajo

## 2026-07-05 - Prototipo piloto

Se crea un prototipo funcional de PWA con:

- 20 preguntas piloto:
  - 10 de informatica.
  - 10 de mantenimiento e instalaciones.
- Datos generados en `data/pilot.json`.
- Interfaz principal en `index.html`.
- Estilos en `styles.css`.
- Logica modular:
  - `src/app.js`
  - `src/quiz.js`
  - `src/storage.js`
- Manifest PWA en `manifest.json`.
- Service worker en `service-worker.js`.
- Icono SVG en `icons/icon.svg`.
- Extractor de datos en `tools/build_pilot_data.py`.

Validaciones realizadas:

- Servidor local iniciado en `http://127.0.0.1:8097/`.
- `index.html`, `data/pilot.json` y `manifest.json` responden HTTP 200.
- La app carga 20 preguntas.
- Selector de bancos visible.
- Modo estudio visible.
- Modo test probado con una respuesta correcta.
- Estadisticas locales actualizadas tras responder.
- Sin errores ni warnings de consola en la comprobacion inicial.

Incidencias detectadas:

- Algunos enunciados y opciones proceden de `questions.json` con acentos degradados por la extraccion original. Antes de escalar a todas las preguntas conviene normalizar texto desde fuente mas limpia o corregir el extractor.

## 2026-07-05 - Ajustes de filtros y progreso

Cambios aplicados:

- El apartado Estado deja de usar cuatro filtros independientes.
- Se crea un unico filtro documental: `Solo preguntas verificadas`.
- Si `Solo preguntas verificadas` esta desactivado, se muestran todos los estados.
- Se agregan contadores no clicables por estado documental:
  - verificadas,
  - pendientes de verificacion,
  - errores del test,
  - dos respuestas posibles.
- Se agrega filtro de progreso: `Solo sin responder`.
- El resumen indica cuantas preguntas quedan en el test tras aplicar filtros.
- El progreso se separa por banco:
  - informatica,
  - mantenimiento,
  - grupo actual.

## 2026-07-05 - Piloto con mezcla de estados

Se ajusta el piloto para seguir usando 20 preguntas, pero con estados documentales variados:

- Informatica: preguntas 1, 2, 3, 4, 5, 53, 91, 93, 101 y 102.
- Mantenimiento: preguntas 1, 2, 3, 4, 5, 38, 411, 412, 421 y 422.

Motivo:

- Con 20 preguntas todas verificadas no se podian probar correctamente los contadores ni los avisos de pendientes, errores del test y dos respuestas posibles.

## 2026-07-05 - Compactacion y enfoque movil

Cambios aplicados:

- Las zonas de Banco, Modo, Estado y Progreso pasan a secciones plegables.
- En escritorio quedan abiertas para tener todo visible.
- En movil quedan abiertas Banco y Modo, y plegadas Estado y Progreso para ahorrar espacio.
- Estado se compacta en contadores de dos columnas o cuatro columnas segun ancho disponible.
- Progreso reduce paddings y tipografias para ocupar menos.
- En pantallas muy estrechas, la barra Anterior/contador/Siguiente se apila para evitar solapes.
- Se incrementa cache PWA a `ope-trainer-pilot-v4`.

## 2026-07-05 - Filtros simplificados

Cambios aplicados:

- El desplegable `Estado` pasa a llamarse `Filtros`.
- `Solo sin responder` se mueve a `Filtros`.
- Se anade `Solo preguntas falladas`.
- El filtro de falladas usa historial local: si una pregunta se fallo alguna vez, queda marcada como `everWrong`.
- Se eliminan los contadores permanentes de verificadas, pendientes, errores y dos respuestas.
- El resumen de filtros queda en una sola frase compacta.
- Se incrementa cache PWA a `ope-trainer-pilot-v5`.
