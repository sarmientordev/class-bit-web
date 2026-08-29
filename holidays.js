/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   COLOMBIA HOLIDAYS â€” Festivos de Colombia
   Regidos por: Ley Emiliani (Ley 51 de 1983) y feriados
   basados en Semana Santa (fecha mÃ³vil).
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Ley Emiliani: si la fecha no es lunes, se traslada al lunes siguiente
function moveToMonday(date) {
  const day = date.getDay(); // 0=Dom, 1=Lun ... 6=Sab
  if (day === 1) return date;
  const add = (8 - day) % 7; // dÃ­as para el prÃ³ximo lunes
  return addDays(date, add);
}

function iso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Festivos fijos que NO se trasladan
const FIXED = [
  { m: 0, d: 1, name: 'AÃ±o Nuevo' },
  { m: 4, d: 1, name: 'DÃ­a del Trabajo' },
  { m: 6, d: 20, name: 'DÃ­a de la Independencia' },
  { m: 7, d: 7, name: 'Batalla de BoyacÃ¡' },
  { m: 11, d: 25, name: 'Navidad' },
];

// Festivos con traslado al lunes (Ley Emiliani)
const EMILIANI = [
  { m: 0, d: 6, name: 'DÃ­a de los Reyes Magos' },
  { m: 2, d: 19, name: 'DÃ­a de San JosÃ©' },
  { m: 5, d: 29, name: 'San Pedro y San Pablo' },
  { m: 7, d: 15, name: 'AsunciÃ³n de la Virgen' },
  { m: 9, d: 12, name: 'DÃ­a de la Raza' },
  { m: 10, d: 1, name: 'DÃ­a de Todos los Santos' },
  { m: 10, d: 11, name: 'Independencia de Cartagena' },
  { m: 11, d: 8, name: 'DÃ­a de la Inmaculada ConcepciÃ³n' },
];

// Festivos relativos a la Pascua (Semana Santa y posteriores)
function easterBased(year) {
  const easter = easterSunday(year);
  return [
    { date: addDays(easter, -3), name: 'Jueves Santo' },
    { date: addDays(easter, -2), name: 'Viernes Santo' },
    { date: moveToMonday(addDays(easter, 40)), name: 'DÃ­a de la AscensiÃ³n del SeÃ±or' },
    { date: moveToMonday(addDays(easter, 60)), name: 'Corpus Christi' },
    { date: moveToMonday(addDays(easter, 68)), name: 'Sagrado CorazÃ³n de JesÃºs' },
  ];
}

function getHolidaysForYear(year) {
  const out = [];

  FIXED.forEach(f => {
    out.push({ date: iso(new Date(year, f.m, f.d)), name: f.name });
  });

  EMILIANI.forEach(f => {
    const moved = moveToMonday(new Date(year, f.m, f.d));
    out.push({ date: iso(moved), name: f.name });
  });

  easterBased(year).forEach(e => {
    out.push({ date: iso(e.date), name: e.name });
  });

  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

function getHolidayOn(date) {
  const key = iso(date);
  const year = date.getFullYear();
  const found = getHolidaysForYear(year).find(h => h.date === key);
  return found ? found : null;
}

// PrÃ³ximos festivos a partir de la fecha dada (incluye el de hoy si existe)
function getUpcomingHolidays(fromDate, count = 10) {
  const today = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const all = [];
  for (let y = today.getFullYear(); y <= today.getFullYear() + 1; y++) {
    getHolidaysForYear(y).forEach(h => {
      const [yy, mm, dd] = h.date.split('-').map(Number);
      const d = new Date(yy, mm - 1, dd);
      if (d >= today) all.push({ date: h.date, name: h.name, day: d });
    });
  }
  all.sort((a, b) => a.date.localeCompare(b.date));
  return all.slice(0, count).map(h => ({ date: h.date, name: h.name }));
}

window.Holidays = {
  easterSunday,
  getHolidaysForYear,
  getHolidayOn,
  getUpcomingHolidays,
};

