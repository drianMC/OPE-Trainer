# Version

## v0.1.0-pilot

Prototipo PWA con:

- 20 preguntas piloto.
- Mezcla de estados documentales.
- Modo estudio.
- Modo test.
- Progreso local.
- Filtros básicos.
- Interfaz compactada para móvil.
- PWA offline básica.

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

## v0.3.1-pilot

Cambios:

- El botón `Instalar app` pasa al panel desplegable de controles.
- El botón de instalación permanece visible aunque el navegador no dispare todavía el instalador automático.
- Si la instalación automática no está disponible, se muestra una indicación para usar `Añadir a pantalla de inicio`.
- El panel desplegable recibe un fondo azul suave para diferenciarlo del contenido.
- Cache PWA: `ope-trainer-pilot-v7`.

## v0.4.0-pilot

Cambios:

- Se separa la app en configurador, vista de preguntas y resumen de ronda.
- Se añade `Orden aleatorio`.
- Se añade `Ronda examen` con filtros bloqueados al iniciar.
- Se añade `Repasar falladas` usando el ratio histórico de fallos.
- Se persiste una ronda activa para poder continuarla después.
- Se permite finalizar ronda y guardar o descartar el registro de ronda.
- Se añade histórico por pregunta: intentos, aciertos, fallos y estado visual por número.
- Se añade listado de rondas guardadas.
- `Reiniciar piloto` pasa a `Borrar histórico` con doble confirmación.
- Las barras de rendimiento muestran aciertos en verde y fallos en rojo.
- Cache PWA: `ope-trainer-pilot-v8`.
