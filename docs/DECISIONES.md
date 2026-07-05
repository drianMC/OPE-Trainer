# Decisiones tecnicas

## 001. Tipo de aplicacion

Decision: PWA estatica.

Motivo:

- No necesita backend.
- Compatible con GitHub Pages.
- Instalable en Android desde navegador.
- Funciona tambien en escritorio.
- Puede funcionar offline con service worker.

## 002. Framework

Decision inicial: HTML, CSS y JavaScript vanilla.

Motivo:

- Menos dependencias.
- Mejor para GitHub Pages.
- Menos riesgo de problemas de compilacion.
- Suficiente para el piloto.

Revisable si la app crece mucho.

## 003. Formato fuente

Decision: los Markdown siguen siendo la fuente editorial humana, pero la app consumira JSON.

Motivo:

- Markdown es bueno para estudiar y revisar.
- JSON es mejor para filtrar, corregir, guardar estadisticas y renderizar preguntas.

## 004. Almacenamiento local

Decision inicial: localStorage para piloto, IndexedDB para version completa si el modelo crece.

Motivo:

- localStorage basta para 20 preguntas.
- IndexedDB es mas adecuado para 1000 preguntas con historial detallado.

## 005. Estados documentales

Decision: los estados no son decorativos; afectan al comportamiento.

Reglas:

- `verified`: pregunta normal computable.
- `pending`: se puede estudiar, pero debe mostrarse advertencia.
- `test_error`: no debe tratarse como fallo ordinario.
- `multiple_possible`: debe mostrar explicacion y no forzar una unica respuesta.

