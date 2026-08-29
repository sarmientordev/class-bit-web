# Class BIT — Versión Web 

Versión portable del horario universitario **Class BIT** para abrir desde el navegador del portátil o móvil (iPhone/Android), sin necesidad de descargar la app de escritorio.

- El horario se guarda en el **localStorage** del navegador (cache del dispositivo). No requiere base de datos.
- Al primer acceso la app arranca **vacía** (sin clases precargadas): cada usuario agrega sus propias materias desde el móvil.
- El tema por defecto es el **original** (pixel) y la elección de tema se guarda en el navegador.
- Tamaño de interfaz **optimizado para móvil** (responsive, bottom-nav fija con safe-area).
- Incluye la malla semanal, festivos de Colombia y temas (pixel/spider/forest/synthwave) de la app original.

## Deploy

Proyecto estático. Desplegado en Vercel:

- Web: [enlace de Vercel]
- Repo original de escritorio: https://github.com/sarmientordev/Class-BIT

## Archivos

- `index.html`, `renderer.js`, `style.css` — interfaz (reutilizados de la app Electron)
- `holidays.js` — festivos de Colombia (compatible navegador)
- `web-shim.js` — reemplaza la API de Electron por `localStorage` para que corra en navegador
- `assets/` — iconos

## Nota

La versión web es **independiente** de la app de escritorio: los cambios hechos en una no se reflejan en la otra (para sincronizarlas haría falta una base de datos online).
