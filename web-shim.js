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

  function readJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {}
  }

  // Horario inicial (solo la primera vez) — los datos de Rafael.
  const SEED = {
    version: 3,
    classes: [
      { id: "mt3dowwdtcba5l", name: "ECUACIONES DIFERENCIALES", teacher: "JAVIER MENDOZA BELTRAN", startTime: "19:30", endTime: "21:45", room: "C-304", days: [4], color: "#E74C3C" },
      { id: "mt3hjx5h4hay1a", name: "VISUALIZACION DE DATOS I", teacher: "DIANA PAOLA BEETAR BARAJA", startTime: "18:45", endTime: "20:15", room: "E-403", days: [0], color: "#E74C3C" },
      { id: "mt7y9127ao5grp", name: "ELECTIVA I", teacher: "FABIO GARCIA RAMIREZ", startTime: "20:15", endTime: "21:45", room: "E-403", days: [0], color: "#E74C3C" },
      { id: "mt7yce9kd9m2gy", name: "DESARROLLO DE SOFTWARE II", teacher: "RONALD CARRASCAL CARREAZO", startTime: "18:45", endTime: "21:45", room: "E-104", days: [1], color: "#E74C3C" },
      { id: "mt7yge17kt5irh", name: "BASES DE DATOS II", teacher: "JORGE LUIS CHAVARRIAGA VARGAS", startTime: "18:45", endTime: "21:45", room: "F-501", days: [2], color: "#E74C3C" },
      { id: "mt7yht7rr6uymy", name: "INGLES III", teacher: "JEIMMY VICTORIA DEVOZ", startTime: "18:45", endTime: "20:15", room: "D-102", days: [3], color: "#E74C3C" },
      { id: "mt7ykhh5lva9cq", name: "REDES Y COMPUTADORAS", teacher: "HEYBERTT MORENO DIAZ", startTime: "20:15", endTime: "21:45", room: "F-502", days: [3], color: "#E74C3C" }
    ],
    settings: { showClock: true, use24h: false, theme: "spider", soundEnabled: true, soundChoice: "retro", remind15: true, remind5: true, remindTomorrow: true, custom: {} }
  };

  function seedIfNeeded() {
    if (!localStorage.getItem(SEED_FLAG)) {
      if (!localStorage.getItem(DATA_KEY)) writeJSON(DATA_KEY, { version: 3, classes: SEED.classes });
      if (!localStorage.getItem(SETTINGS_KEY)) writeJSON(SETTINGS_KEY, SEED.settings);
      localStorage.setItem(SEED_FLAG, '1');
    }
  }

  window.scheduleAPI = {
    loadData: () => { seedIfNeeded(); return Promise.resolve(readJSON(DATA_KEY) || { version: 3, classes: [] }); },
    saveData: (classes) => { const d = readJSON(DATA_KEY) || { version: 3, classes: [] }; d.classes = classes; writeJSON(DATA_KEY, d); return Promise.resolve(); },
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
