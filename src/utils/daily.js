/**
 * Logica della sfida giornaliera di Intzetta.
 *
 * Perche' esiste: Intzetta era un gioco "una tantum". La sfida giornaliera da' una ragione per
 * tornare (stessi comuni per tutti, una volta al giorno) e un risultato da condividere su WhatsApp,
 * che in Italia usa il 90% delle persone online. E' la leva di crescita principale del piano.
 *
 * Regole di progetto:
 *  - la sfida deve essere IDENTICA per tutti, quindi la selezione dei comuni e' deterministica
 *    a partire dalla data (nessun Math.random) e il "giorno" e' calcolato sul fuso di Roma;
 *  - tutto funziona senza account: la serie e il risultato del giorno vivono in localStorage;
 *  - nessuna dipendenza esterna: il generatore pseudo-casuale e' implementato qui.
 */

import cities from '../data/sardinian-cities-corrected.json';

export const ROUNDS_PER_GAME = 8;
export const MAX_ROUND_SCORE = 5000;
export const MAX_GAME_SCORE = ROUNDS_PER_GAME * MAX_ROUND_SCORE; // 40.000

/** Sito pubblico, usato nel testo di condivisione. */
export const SITE_URL = 'https://intzetta.top';

/**
 * Giorno 1 della numerazione delle sfide ("INZETTA #1").
 * DA CAMBIARE con il giorno in cui la sfida giornaliera va online.
 */
export const DAILY_EPOCH = '2026-10-14';

const ROME_TZ = 'Europe/Rome';

// ---------------------------------------------------------------------------
// Date
// ---------------------------------------------------------------------------

/**
 * Chiave del giorno corrente (YYYY-MM-DD) nel fuso di Roma.
 * Usiamo Roma e non il fuso locale del giocatore: la sfida deve cambiare alla stessa ora
 * per tutti, e il pubblico di riferimento e' in Italia.
 */
export function todayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ROME_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Scostamento (in ms) fra l'ora di Roma e UTC in un dato istante. */
function romeOffsetMs(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ROME_TZ,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const get = (t) => Number(parts.find((p) => p.type === t).value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  return asUtc - date.getTime();
}

/** Istante UTC della mezzanotte di Roma per una data di calendario. */
function romeMidnightUtc(year, month, day) {
  const wallClock = Date.UTC(year, month - 1, day, 0, 0, 0);
  let guess = wallClock;
  for (let i = 0; i < 3; i += 1) {
    const next = wallClock - romeOffsetMs(new Date(guess));
    if (next === guess) break;
    guess = next;
  }
  return guess;
}

/** Millisecondi che mancano alla prossima sfida (mezzanotte di Roma). */
export function msUntilNextDaily(date = new Date()) {
  const [y, m, d] = todayKey(date).split('-').map(Number);
  // +36 ore dalla mezzanotte di oggi: siamo sicuramente nel giorno successivo, a Roma.
  const probe = new Date(Date.UTC(y, m - 1, d) + 36 * 3600 * 1000);
  const [ty, tm, td] = todayKey(probe).split('-').map(Number);
  return romeMidnightUtc(ty, tm, td) - date.getTime();
}

/** Numero progressivo della sfida, per il testo condiviso. */
export function dailyNumber(dateKey = todayKey()) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const [ey, em, ed] = DAILY_EPOCH.split('-').map(Number);
  const dayMs = 24 * 3600 * 1000;
  const diff = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ey, em - 1, ed)) / dayMs);
  return Math.max(1, diff + 1);
}

/** Il giorno di calendario precedente a una chiave YYYY-MM-DD. */
function previousDayKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const prev = new Date(Date.UTC(y, m - 1, d) - 24 * 3600 * 1000);
  return prev.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Selezione dei comuni
// ---------------------------------------------------------------------------

function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickDistinct(rand, count) {
  return pickDistinctFrom(cities, rand, count);
}

/** Estrae `count` comuni distinti da un elenco qualsiasi. */
function pickDistinctFrom(pool, rand, count) {
  const available = pool.slice();
  const out = [];
  const n = Math.min(count, available.length);
  for (let i = 0; i < n; i += 1) {
    const j = Math.floor(rand() * available.length);
    out.push(available[j]);
    available.splice(j, 1);
  }
  return out;
}

/**
 * Gli 8 comuni della sfida di un certo giorno: sempre gli stessi per tutti.
 * Deterministica: stessa data -> stessa partita.
 */
export function pickDailyCities(dateKey = todayKey(), count = ROUNDS_PER_GAME) {
  return pickDistinct(mulberry32(hashString(`intzetta:${dateKey}`)), count);
}

/** 8 comuni a caso per la modalita' allenamento. */
export function pickRandomCities(count = ROUNDS_PER_GAME) {
  return pickDistinct(mulberry32((Math.random() * 2 ** 32) >>> 0), count);
}

/**
 * Come sopra, ma pescando solo da un sottoinsieme di comuni (per esempio una sola provincia):
 * chi arriva dalla pagina di una provincia gioca con i comuni di quella provincia.
 */
export function pickRandomFrom(pool, count = ROUNDS_PER_GAME) {
  const list = Array.isArray(pool) && pool.length > 0 ? pool : cities;
  return pickDistinctFrom(list, mulberry32((Math.random() * 2 ** 32) >>> 0), count);
}

// ---------------------------------------------------------------------------
// Punteggio e griglia
// ---------------------------------------------------------------------------

/**
 * Punteggio di un round in base alla distanza in metri.
 * Curva invariata rispetto al gioco originale: 5.000 punti entro 1 km, 0 oltre 50 km.
 */
export function calcScore(distanceInMeters) {
  const maxDistance = 50000;
  const perfectDistance = 1000;
  const maxScore = MAX_ROUND_SCORE;

  if (distanceInMeters <= perfectDistance) return maxScore;
  if (distanceInMeters >= maxDistance) return 0;

  const ratio = (distanceInMeters - perfectDistance) / (maxDistance - perfectDistance);
  const score = Math.round(maxScore * Math.pow(0.9, ratio * 50));
  return Math.max(0, Math.min(score, maxScore));
}

/**
 * Soglie della griglia, calibrate sulla Sardegna.
 *
 * La Sardegna e' lunga circa 270 km: sbagliare di 30 km qui e' un errore grave, mentre su una
 * mappa mondiale sarebbe un ottimo risultato. Queste soglie sono quindi piu' strette di quelle
 * di un gioco globale, ed e' voluto: e' l'identita' del prodotto.
 * Riferimento misurato: il giocatore mediano di Intzetta sbaglia circa 5,9 km per round.
 */
export const DISTANCE_BANDS = [
  { max: 1000, emoji: '🟩', label: 'perfetto' },
  { max: 5000, emoji: '🟨', label: 'ottimo' },
  { max: 15000, emoji: '🟧', label: 'cosi' },
  { max: 35000, emoji: '🟥', label: 'lontano' },
  { max: Infinity, emoji: '⬛', label: 'fuori strada' },
];

export function distanceEmoji(distanceMeters) {
  const band = DISTANCE_BANDS.find((b) => distanceMeters <= b.max);
  return band ? band.emoji : '⬛';
}

export function formatDistance(distanceMeters) {
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m`;
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

// ---------------------------------------------------------------------------
// Testo da condividere
// ---------------------------------------------------------------------------

/**
 * Testo pronto da incollare in una chat: nessuno spoiler, ma si vede com'e' andata.
 * A differenza di Wordle include il LINK: su WhatsApp un link e' cliccabile e trasforma
 * la condivisione in nuovi giocatori.
 */
export function buildShareText({ mode, score, rounds, dateKey = todayKey() }) {
  const list = rounds || [];
  const grid = list.map((r) => distanceEmoji(r.distanceM)).join('');
  const titles = list.map((r) => r.name);

  if (mode === 'daily') {
    return [
      `🏝️ INZETTA #${dailyNumber(dateKey)}`,
      `Ho fatto ${score.toLocaleString('it-IT')} su ${MAX_GAME_SCORE.toLocaleString('it-IT')}`,
      `Sai piazzare ${titles.slice(0, 3).join(', ')} sulla mappa?`,
      grid,
      `👉 ${SITE_URL}`,
    ].join('\n');
  }

  return [
    '🏝️ INZETTA — allenamento',
    `Ho fatto ${score.toLocaleString('it-IT')} su ${MAX_GAME_SCORE.toLocaleString('it-IT')}`,
    `Sai piazzare ${titles.slice(0, 3).join(', ')} sulla mappa?`,
    grid,
    `👉 ${SITE_URL}`,
  ].join('\n');
}

/**
 * Condivide il testo: usa il menù nativo del telefono quando c'è, altrimenti copia negli appunti.
 * Restituisce 'shared' | 'copied' | 'manual'.
 */
export async function shareResult(text) {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ text });
      return 'shared';
    }
  } catch (err) {
    // L'utente ha annullato: non e' un errore da segnalare.
    if (err && err.name === 'AbortError') return 'shared';
  }
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return 'copied';
    }
  } catch (err) {
    /* cade nel ritorno 'manual' */
  }
  return 'manual';
}

// ---------------------------------------------------------------------------
// Memoria locale: risultato del giorno e serie
// ---------------------------------------------------------------------------

const RESULT_PREFIX = 'intzetta:daily:';
const STREAK_KEY = 'intzetta:streak';
const PROGRESS_PREFIX = 'intzetta:progress:';

function readJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // Safari in navigazione privata, o spazio esaurito: il gioco deve continuare a funzionare.
    return false;
  }
}

export function getDailyResult(dateKey = todayKey()) {
  return readJson(RESULT_PREFIX + dateKey);
}

export function saveDailyResult(dateKey, result) {
  return writeJson(RESULT_PREFIX + dateKey, result);
}

/** Partita del giorno in corso: permette di riprenderla se la pagina viene ricaricata. */
export function getDailyProgress(dateKey = todayKey()) {
  return readJson(PROGRESS_PREFIX + dateKey);
}

export function saveDailyProgress(dateKey, progress) {
  return writeJson(PROGRESS_PREFIX + dateKey, progress);
}

export function clearDailyProgress(dateKey = todayKey()) {
  try {
    window.localStorage.removeItem(PROGRESS_PREFIX + dateKey);
  } catch (err) {
    /* niente da fare */
  }
}

export function getStreak() {
  const s = readJson(STREAK_KEY);
  if (!s || typeof s.current !== 'number') return { current: 0, best: 0, lastDate: null };
  return s;
}

/**
 * Registra che la sfida di oggi e' stata giocata e aggiorna la serie.
 * La serie cresce solo se il giorno precedente e' stato giocato: e' quello che la rende
 * una cosa da non interrompere.
 */
export function registerDailyPlayed(dateKey = todayKey()) {
  const streak = getStreak();
  if (streak.lastDate === dateKey) return streak;

  const current = streak.lastDate === previousDayKey(dateKey) ? streak.current + 1 : 1;
  const updated = {
    current,
    best: Math.max(streak.best || 0, current),
    lastDate: dateKey,
  };
  writeJson(STREAK_KEY, updated);
  return updated;
}

/** La serie mostrata all'utente e' valida solo se comprende oggi o ieri. */
export function effectiveStreak(dateKey = todayKey()) {
  const streak = getStreak();
  if (!streak.lastDate) return 0;
  if (streak.lastDate === dateKey || streak.lastDate === previousDayKey(dateKey)) {
    return streak.current;
  }
  return 0;
}

/** "7h 12m" fino alla prossima sfida. */
export function formatCountdown(ms) {
  if (ms <= 0) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}
