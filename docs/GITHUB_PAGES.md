# Publicacion en GitHub Pages

## Recomendacion

Publicar primero el piloto de 20 preguntas.

Motivo:

- Permite probar instalacion PWA en Android sin mover todavia todos los datos.
- Permite validar comodidad movil, filtros, progreso y modo offline.
- Evita mezclar problemas de interfaz con problemas de importacion masiva.

## Estructura publicable

La raiz del repositorio ya contiene los archivos que GitHub Pages necesita:

- `index.html`
- `styles.css`
- `manifest.json`
- `service-worker.js`
- `data/pilot.json`
- `src/`
- `icons/`

## Configuracion recomendada

En GitHub:

1. Crear repositorio, por ejemplo `OPE-Trainer`.
2. Subir el contenido de `C:\Codex\ope-trainer-pwa`.
3. Ir a `Settings > Pages`.
4. Seleccionar:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Abrir la URL publicada:
   - `https://tuusuario.github.io/OPE-Trainer/`

## Prueba en Android

1. Abrir la URL desde Chrome.
2. Menu de Chrome.
3. `Anadir a pantalla de inicio` o `Instalar aplicacion`.
4. Abrir desde el icono.
5. Probar:
   - modo estudio,
   - modo test,
   - filtro `Solo preguntas verificadas`,
   - filtro `Solo sin responder`,
   - progreso separado por banco,
   - modo avion tras primera carga.

## Antes de meter todas las preguntas

Validar en movil:

- Que no haya scroll horizontal.
- Que los botones sean comodos.
- Que Estado y Progreso no ocupen demasiado.
- Que las preguntas largas sean legibles.
- Que el modo test sea rapido de usar con una mano.

