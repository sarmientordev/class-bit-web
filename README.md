# Class BIT — Versión Web (móvil)

Versión portable del horario universitario **Class BIT** para abrir desde el navegador del móvil (iPhone/Android), sin necesidad de descargar la app de escritorio.

- El horario se guarda en el **localStorage** del navegador (cache del dispositivo). No requiere base de datos.
- Al primer acceso se precargan las 7 clases actuales (editables desde el móvil).
- Incluye la malla semanal, festivos de Colombia y temas (pixel/spider) de la app original.

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
