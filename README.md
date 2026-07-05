# OPE Trainer PWA

Proyecto para convertir los manuales Markdown de OPE en una Progressive Web App instalable, usable offline y con estadisticas locales.

## Objetivo del piloto

Crear una primera version funcional con 20 preguntas:

- 10 preguntas de `ope-informatica-respuestas`.
- 10 preguntas de `ope-test-respuestas` mantenimiento/instalaciones.

El piloto debe validar:

- Estructura de datos JSON.
- Vista de estudio.
- Vista de test.
- Correccion de respuestas.
- Tratamiento de estados: verificada, pendiente, error del test, dos respuestas posibles.
- Estadisticas locales.
- Instalacion PWA.
- Funcionamiento offline.

## Criterio de calidad

La app no debe modificar el contenido doctrinal de las respuestas. Solo debe transformar los Markdown ya revisados a un formato util para entrenamiento.

Si una pregunta esta marcada como pendiente o error del test, la interfaz debe mostrarlo claramente.

