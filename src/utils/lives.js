/**
 * Vite giornaliere.
 *
 * REGOLA DEL GIOCO
 * ----------------
 * Non tutte le partite valgono per la classifica. Si entra in classifica **solo** giocando una
 * partita "classificata", e ogni partita classificata consuma una vita:
 *   - la sfida del giorno (una volta al giorno, gli stessi comuni per tutti)
 *   - le partite classificate a comuni casuali, su tutta la Sardegna o su una provincia
 * L'allenamento invece e' libero, non consuma vite e **non entra in classifica**: serve a
 * esercitarsi, non a competere.
 *
 * Ogni giorno si ricevono LIVES_PER_DAY vite gratuite. Se finiscono si possono comprare: le vite
 * comprate restano finche' non vengono usate, anche nei giorni successivi.
 *
 * LIMITE NOTO (da risolvere quando ci sara' un backend)
 * ----------------------------------------------------
 * Le vite vivono nella memoria del browser. Chi vuole imbrogliare puo' svuotarla e riottenere le
 * vite gratuite. Non e' un problema grave finche' in palio non ci sono premi, ma va detto: per
 * renderlo inviolabile servirebbe il conteggio lato server (Cloud Functions).
 */

const FREE_PER_DAY = 3;
const WALLET_KEY = 'intzetta:lives:wallet';
const DAY_PREFIX = 'intzetta:lives:';

export const LIVES_PER_DAY = FREE_PER_DAY;

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // Safari in navigazione privata: il gioco deve continuare a funzionare, si giochera' senza
    // conteggio delle vite piuttosto che bloccare tutto.
    return false;
  }
}

/** Vite comprate e non ancora usate: valgono anche nei giorni successivi. */
export function walletLives() {
  const w = readJson(WALLET_KEY, { bought: 0 });
  return typeof w.bought === 'number' && w.bought > 0 ? Math.floor(w.bought) : 0;
}

/** Quante vite gratuite sono gia' state usate oggi. */
export function freeUsedToday(dateKey) {
  const d = readJson(DAY_PREFIX + dateKey, { freeUsed: 0 });
  return typeof d.freeUsed === 'number' && d.freeUsed > 0 ? Math.floor(d.freeUsed) : 0;
}

/** Situazione completa delle vite, per mostrarla all'utente. */
export function livesState(dateKey) {
  const freeUsed = Math.min(freeUsedToday(dateKey), FREE_PER_DAY);
  const freeLeft = Math.max(0, FREE_PER_DAY - freeUsed);
  const bought = walletLives();
  return {
    freePerDay: FREE_PER_DAY,
    freeLeft,
    bought,
    total: freeLeft + bought,
    canPlay: freeLeft + bought > 0,
  };
}

/**
 * Consuma una vita. Restituisce true se la partita puo' essere classificata.
 * Usa prima le vite gratuite del giorno, poi quelle comprate.
 */
export function consumeLife(dateKey) {
  const freeUsed = freeUsedToday(dateKey);
  if (freeUsed < FREE_PER_DAY) {
    writeJson(DAY_PREFIX + dateKey, { freeUsed: freeUsed + 1 });
    return true;
  }
  const bought = walletLives();
  if (bought > 0) {
    writeJson(WALLET_KEY, { bought: bought - 1 });
    return true;
  }
  return false;
}

/** Aggiunge vite comprate. Verra' chiamata dal sistema di acquisto. */
export function addBoughtLives(howMany) {
  const n = Math.max(0, Math.floor(howMany));
  if (n === 0) return walletLives();
  const total = walletLives() + n;
  writeJson(WALLET_KEY, { bought: total });
  return total;
}

/** Solo per le prove: riporta tutto a zero. */
export function resetLives(dateKey) {
  try {
    window.localStorage.removeItem(DAY_PREFIX + dateKey);
    window.localStorage.removeItem(WALLET_KEY);
  } catch (err) {
    /* niente da fare */
  }
}

/** Millisecondi al momento in cui le vite gratuite tornano disponibili. */
export function msUntilLivesReset(msUntilNextDaily) {
  return msUntilNextDaily;
}
