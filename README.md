# Canasta básica

Instrumento de observación de precios para una actividad de salida a terreno. La página inicial incluye una presentación pedagógica sobre su uso, valoración y límites desde distintas disciplinas.

## Uso en terreno

1. En un celular, crea una visita e ingresa una vez los datos del grupo y del supermercado.
2. Comparte el ID o el enlace de invitación. El resto del grupo se une solo con ese ID.
3. Distribuyan las categorías entre celulares y guarden cada captura para sincronizarla con la visita.
4. Revisen el total compartido y descarguen el registro en PDF. Las preguntas de análisis se trabajan en clases, no se registran durante la visita.

## Publicación y backend

- GitHub Pages publica los archivos estáticos desde la rama `main` y la raíz del repositorio. `index.html`, `app.js` y `trabajo_social_color.png` deben permanecer juntos en esa ubicación.
- Copia `apps-script/Code.gs` al proyecto de Apps Script vinculado a la hoja de cálculo y despliega una versión nueva como Web App, ejecutada como propietario y accesible para cualquiera.
- Si cambia la URL `/exec`, actualiza `API_URL` en `app.js`. La implementación ya publicada no incorpora automáticamente cambios hechos al archivo fuente.
- El backend crea las hojas `Visitas`, `Envios`, `Precios` y `Reemplazos` en la planilla vinculada (o en la indicada por `SPREADSHEET_ID`).
