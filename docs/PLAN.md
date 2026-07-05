# Plan de trabajo

## Fase 0. Preparacion

Estado: en curso.

Acciones:

- Crear carpeta separada del proyecto.
- Registrar decisiones tecnicas.
- Definir modelo de datos.
- Definir alcance del piloto de 20 preguntas.

Resultado esperado:

- Proyecto ordenado y documentado antes de escribir la app.

## Fase 1. Datos piloto

Estado: en curso.

Acciones:

- Leer 10 preguntas de informatica.
- Leer 10 preguntas de mantenimiento.
- Convertirlas a `data/pilot.json`.
- Validar que cada pregunta tenga:
  - enunciado,
  - opciones,
  - respuesta,
  - estado,
  - fundamento,
  - normativa,
  - observaciones,
  - texto para memorizar.

Resultado esperado:

- Un JSON estable que represente correctamente el formato real de los manuales.

## Fase 2. App base

Estado: completada para prototipo.

Acciones:

- Crear `index.html`.
- Crear `src/app.js`.
- Crear `src/storage.js`.
- Crear `src/quiz.js`.
- Crear `styles.css`.
- Cargar `data/pilot.json`.

Resultado esperado:

- La web muestra el banco piloto y permite navegar pregunta a pregunta.

## Fase 3. Modo estudio

Estado: completada para prototipo.

Acciones:

- Mostrar pregunta.
- Mostrar opciones.
- Mostrar respuesta correcta.
- Mostrar fundamento, normativa, observaciones y resumen para memorizar.
- Mostrar etiqueta visible del estado documental.

Resultado esperado:

- La app sirve como manual de repaso.

## Fase 4. Modo test

Estado: completada para prototipo.

Acciones:

- Ocultar respuesta hasta contestar.
- Permitir seleccionar opcion.
- Indicar acierto/fallo.
- No penalizar automaticamente preguntas con `ERROR DEL TEST` o `DOS RESPUESTAS POSIBLES`.
- Guardar resultado local.

Resultado esperado:

- Entrenamiento realista sin ocultar conflictos documentales.

## Fase 5. Estadisticas locales

Estado: completada para prototipo.

Acciones:

- Guardar respuestas en IndexedDB o localStorage segun complejidad del piloto.
- Registrar:
  - preguntas vistas,
  - respondidas,
  - acertadas,
  - falladas,
  - pendientes de repaso,
  - favoritas.

Resultado esperado:

- El progreso persiste al cerrar la app.

## Fase 6. PWA

Estado: completada para prototipo con localStorage.

Acciones:

- Crear `manifest.json`.
- Crear iconos.
- Crear `service-worker.js`.
- Cachear HTML, CSS, JS y JSON.
- Probar instalacion y uso offline.

Resultado esperado:

- App instalable desde Chrome/Edge y usable sin conexion.

## Fase 7. Escalado

Estado: pendiente.

Acciones:

- Revisar piloto.
- Ajustar modelo de datos si hace falta.
- Convertir bancos completos.
- Crear filtros por categoria, bloque y estado.

Resultado esperado:

- Cargar todas las preguntas sin rehacer arquitectura.

## Fase 8. Publicacion piloto

Estado: preparada.

Acciones:

- Subir `C:\Codex\ope-trainer-pwa` a GitHub.
- Activar GitHub Pages.
- Probar instalacion en Android.
- Validar experiencia movil antes de importar todos los bancos.

Resultado esperado:

- Piloto de 20 preguntas instalable y probado en movil real.
