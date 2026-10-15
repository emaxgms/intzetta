/**
 * Vite giornaliere.
 *
 * REGOLA DEL GIOCO
 * ----------------
 * Non tutte le partite valgono per la classifica. Si entra in classifica **solo** giocando una
 * partita "classificata", e ogni partita classificata consuma una vita:
 *   - la sfida del giorno (una volta al giorno, gli stessi comuni per tutti)
 *   - le partite classificate a comuni casuali, su tutta la Sardegna o su una provincia
 * L'allenamento invece e' libero, non consuma vite e **non entra in classifica**.
 *
 * COME SI OTTENGONO LE VITE
 * -------------------------
 *  1. Ogni giorno se ne ricevono FREE_PER_DAY gratis.
 *  2. La sfida del giorno ne fa **vincere** una per ogni round azzeccato (paese trovato entro il
 *     raggio), fino a MAX_EARNABLE_LIVES. E' questo il senso della sfida giornaliera: giocarla bene
 *     significa potersi giocare altre partite classificate.
 *  3. Le vite comprate si aggiungono a quelle vinte e restano finche' non vengono usate.
 *
 * Il ciclo che ne esce: gioca la sfida del giorno -> vinci vite -> gioca altre partite classificate
 * -> entri in classifica. Chi non ha tempo o bravura puo' comprarle.
 *
 * LIMITE NOTO (da risolvere quando ci sara' un backend)
 * ----------------------------------------------------
 * Le vite vivono nella memoria del browser. Chi vuole imbrogliare puo' svuotarla e riottenere le
 * vite gratuite. Non e' grave finche' in palio non ci sono premi, ma va detto: per renderlo
 * inviolabile servirebbe il conteggio lato server (Cloud Functions).
 */

import { MAX_EARNABLE_LIVES } from './daily';

const FREE_PER_DAY = 3;
const WALLET_KEY = 'intzetta:lives:wallet';
const DAY_PREFIX = 'intzetta:lives:';

export const LIVES_PER_DAY = FREE_PER_DAY;
export { MAX_EARNABLE_LIVES };

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
    // Safari in navigazione privata: il gioco deve continuare a funzionare. Si giochera' senza
    // conteggio delle vite, piuttosto che bloccare tutto.
    return false;
  }
}

function numero(value) {
  return typeof value === 'number' && value > 0 ? Math.floor(value) : 0;
}

/** Vite comprate e vinte: valgono anche nei giorni successivi. */
export function walletLives() {
  const w = readJson(WALLET_KEY, { bought: 0, earned: 0 });
  return { bought: numero(w.bought), earned: numero(w.earned) };
}

function setWallet({ bought, earned }) {
  writeJson(WALLET_KEY, { bought: numero(bought), earned: numero(earned) });
}

function dayRecord(dateKey) {
  const d = readJson(DAY_PREFIX + dateKey, { freeUsed: 0, earnedToday: 0 });
  return { freeUsed: numero(d.freeUsed), earnedToday: numero(d.earnedToday) };
}

/** Situazione completa delle vite, per mostrarla all'utente. */
export function livesState(dateKey) {
  const { freeUsed, earnedToday } = dayRecord(dateKey);
  const freeLeft = Math.max(0, FREE_PER_DAY - Math.min(freeUsed, FREE_PER_DAY));
  const { bought, earned } = walletLives();
  const total = freeLeft + bought + earned;
  return {
    freePerDay: FREE_PER_DAY,
    freeLeft,
    bought,
    earned,
    total,
    canPlay: total > 0,
    earnedToday,
    earnableToday: Math.max(0, MAX_EARNABLE_LIVES - earnedToday),
  };
}

/**
 * Consuma una vita. Restituisce true se la partita puo' essere classificata.
 * Ordine: prima le gratuite del giorno, poi quelle vinte, infine quelle comprate.
 */
export function consumeLife(dateKey) {
  const { freeUsed, earnedToday } = dayRecord(dateKey);
  if (freeUsed < FREE_PER_DAY) {
    writeJson(DAY_PREFIX + dateKey, { freeUsed: freeUsed + 1, earnedToday });
    return true;
  }
  const wallet = walletLives();
  if (wallet.earned > 0) {
    setWallet({ ...wallet, earned: wallet.earned - 1 });
    return true;
  }
  if (wallet.bought > 0) {
    setWallet({ ...wallet, bought: wallet.bought - 1 });
    return true;
  }
  return false;
}

/**
 * Vite vinte giocando la sfida del giorno.
 * Il tetto giornaliero e' MAX_EARNABLE_LIVES: non si possono accumulare all'infinito.
 * Restituisce quante ne sono state effettivamente assegnate.
 */
export function addEarnedLives(dateKey, quante) {
  const richieste = Math.max(0, Math.floor(quante));
  if (richieste === 0) return 0;

  const { freeUsed, earnedToday } = dayRecord(dateKey);
  const margine = Math.max(0, MAX_EARNABLE_LIVES - earnedToday);
  const assegnate = Math.min(richieste, margine);
  if (assegnate === 0) return 0;

  const wallet = walletLives();
  setWallet({ ...wallet, earned: wallet.earned + assegnate });
  writeJson(DAY_PREFIX + dateKey, { freeUsed, earnedToday: earnedToday + assegnate });
  return assegnate;
}

/** Aggiunge vite comprate. Verra' chiamata dal sistema di acquisto. */
export function addBoughtLives(howMany) {
  const n = Math.max(0, Math.floor(howMany));
  if (n === 0) return walletLives().bought;
  const wallet = walletLives();
  const totale = wallet.bought + n;
  setWallet({ ...wallet, bought: totale });
  return totale;
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
