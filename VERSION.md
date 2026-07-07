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

## v0.4.1-pilot

Cambios:

- El mapa de preguntas sale de la tarjeta de `Configuración`.
- Se crea una tarjeta propia `Histórico de respuestas`.
- El histórico de respuestas se agrupa por banco en desplegables independientes.
- La tarjeta de `Configuración` muestra solo el alcance de la actividad preparada.
- Cache PWA: `ope-trainer-pilot-v9`.

## v1.0.0-full

Cambios:

- Se sustituye el banco piloto de 20 preguntas por el banco completo.
- Carga total: 1000 preguntas, 500 de Informática y 500 de Mantenimiento.
- Se conservan estados documentales, respuestas, fundamentos, normativa y observaciones.
- Se normalizan etiquetas de estado visibles.
- Se corrige el parser para recuperar opciones partidas por saltos de página en el PDF de mantenimiento.
- Cache PWA: `ope-trainer-full-v10`.

## v1.0.1-full

Cambios:

- Los números del `Histórico de respuestas` pasan a ser accesos directos.
- Al pulsar un número se abre esa pregunta en modo consulta, con la respuesta y resolución visibles.
- En esa consulta independiente solo queda disponible volver al menú principal.
- Cache PWA: `ope-trainer-full-v11`.

## v1.0.2-full

Cambios:

- En ronda, `Finalizar` pasa a la barra superior.
- `Anterior` y `Siguiente` pasan a la zona inferior de la pregunta.
- `Finalizar` exige doble confirmación.
- El histórico por banco queda plegado por defecto.
- `Actividad` pasa a llamarse `Tipo de ronda`.
- Se fuerza scroll superior al volver al configurador para evitar saltos visuales en móvil.
- Cache PWA: `ope-trainer-full-v12`.
