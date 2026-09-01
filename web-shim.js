/* ══════════════════════════════════════════════════
   CLASS BIT — WEB SHIM
   Implementa window.scheduleAPI sobre localStorage
   para que la app (renderer.js) funcione en el navegador
   (móvil iPhone/Android) sin Electron.
   ══════════════════════════════════════════════════ */
(function () {
  const DATA_KEY = 'classbit:data';
  const SETTINGS_KEY = 'classbit:settings';
  const SEED_FLAG = 'classbit:seeded';
  // Versión del shim: si cambia, se descartan datos previos (para arrancar limpio).
  const SHIM_VERSION = '2';

  function readJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {}
  }

  // App arranca TOTALMENTE limpia: sin clases precargadas.
  // El usuario (o tú) agrega sus propias materias.
  const SEED = {
    version: 3,
    classes: [],
    reminders: [],
    settings: { showClock: true, use24h: false, theme: "pixel", soundEnabled: true, soundChoice: "retro", remind15: true, remind5: true, remindTomorrow: true, custom: {} }
  };

  function seedIfNeeded() {
    // Si antes había datos de una versión anterior, se limpian para arrancar de cero.
    if (readJSON(DATA_KEY) && !readJSON(DATA_KEY).webClean) {
      localStorage.removeItem(DATA_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    }
    if (!localStorage.getItem(SEED_FLAG) || !readJSON(DATA_KEY)) {
      if (!readJSON(DATA_KEY)) writeJSON(DATA_KEY, { version: 3, webClean: true, classes: [], reminders: [] });
      if (!readJSON(SETTINGS_KEY)) writeJSON(SETTINGS_KEY, SEED.settings);
      localStorage.setItem(SEED_FLAG, '1');
    }
  }

  window.scheduleAPI = {
    loadData: () => {
      seedIfNeeded();
      const d = readJSON(DATA_KEY) || { version: 3, classes: [], reminders: [] };
      if (!Array.isArray(d.reminders)) d.reminders = [];
      return Promise.resolve(d);
    },
    saveData: (payload) => {
      const d = readJSON(DATA_KEY) || { version: 3, classes: [], reminders: [], webClean: true };
      // nuevo: payload puede ser el objeto completo { classes, reminders } o un array de clases
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        if (Array.isArray(payload.classes)) d.classes = payload.classes;
        if (Array.isArray(payload.reminders)) d.reminders = payload.reminders;
      } else if (Array.isArray(payload)) {
        d.classes = payload;
      }
      writeJSON(DATA_KEY, d);
      return Promise.resolve();
    },
    seedData: () => Promise.resolve(),
    loadSettings: () => { seedIfNeeded(); return Promise.resolve(readJSON(SETTINGS_KEY) || SEED.settings); },
    saveSettings: (settings) => { writeJSON(SETTINGS_KEY, settings); return Promise.resolve(); },
    getUpcomingHolidays: (count) => {
      const H = window.Holidays || {};
      if (typeof H.getUpcomingHolidays === 'function') {
        return Promise.resolve(H.getUpcomingHolidays(new Date(), count));
      }
      return Promise.resolve([]);
    },
    getTodayHoliday: () => {
      const H = window.Holidays || {};
      if (typeof H.getHolidayOn === 'function') {
        const h = H.getHolidayOn(new Date());
        return Promise.resolve(h ? h.name : null);
      }
      return Promise.resolve(null);
    },
    testNotification: () => {
      try {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification('Class BIT', { body: 'Notificación de prueba', icon: 'assets/icon.png' });
        }
      } catch (_) {}
      return Promise.resolve();
    },
    setTitleBarOverlay: () => Promise.resolve(),
    onNotificationSound: () => {},
  };

  seedIfNeeded();
})();
