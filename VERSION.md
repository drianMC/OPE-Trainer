# Version

## v0.1.0-pilot

Prototipo PWA con:

- 20 preguntas piloto.
- Mezcla de estados documentales.
- Modo estudio.
- Modo test.
- Progreso local.
- Filtros basicos.
- Interfaz compactada para movil.
- PWA offline basica.

## v0.2.0-pilot

Cambios:

- `Estado` pasa a llamarse `Filtros`.
- Se agrupan en Filtros:
  - solo preguntas verificadas,
  - solo sin responder,
  - solo preguntas falladas.
- Se eliminan los contadores permanentes por estado documental.
- El resumen queda compacto: verificadas del banco, sin responder, falladas y preguntas restantes.
- Cache PWA: `ope-trainer-pilot-v5`.

## v0.3.0-pilot

Cambios:

- En móvil, los controles Banco/Modo/Filtros/Progreso quedan dentro del menú superior.
- La navegación de preguntas queda en una sola línea con contador y flechas.
- Se oculta el mensaje `Correcta.`; la respuesta se identifica por color.
- La resolución documentada ya no muestra `Respuesta` ni `Para memorizar`.
- Se corrigen textos visibles del piloto con tildes y caracteres degradados.
- Cache PWA: `ope-trainer-pilot-v6`.
