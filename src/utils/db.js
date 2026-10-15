import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../firebase';

// ---------------------------------------------------------------------------
// Profilo utente
// ---------------------------------------------------------------------------

/** Crea o aggiorna il profilo. Usa merge: i campi non indicati restano com'e' erano. */
export const createOrUpdateUserProfile = async (userId, userData) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(
    userRef,
    {
      ...userData,
      lastModifiedDate: new Date(),
    },
    { merge: true }
  );
};

export const checkIfUserExists = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists();
};

export const getUserProfile = async (userId) => {
  const userSnap = await getDoc(doc(db, 'users', userId));
  return userSnap.exists() ? userSnap.data() : null;
};

/** Punteggio migliore storico dell'utente (usato per il riquadro "il tuo record"). */
export const getUserBestScore = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    return docSnap.exists() ? docSnap.data().bestScore ?? null : null;
  } catch (error) {
    console.error('Errore nella lettura del miglior punteggio:', error);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Classifiche
// ---------------------------------------------------------------------------
//
// Sono divise per "tabellone", e ogni tabellone e' una sottocollezione:
//
//   leaderboards/generale/entries/{uid}
//   leaderboards/giornaliera-2026-10-14/entries/{uid}
//   leaderboards/provincia-ss/entries/{uid}
//
// Perche' cosi':
//  - la classifica della sfida del giorno si azzera da sola: il giorno dopo cambia il nome del
//    tabellone, quindi i punteggi di ieri non compaiono piu' e restano comunque consultabili;
//  - la classifica di una provincia e' separata da quella generale, come deve essere: giocare
//    dentro una sola provincia e' piu' facile che su tutta l'isola, e i due punteggi non sono
//    confrontabili;
//  - non servono indici composti: ogni tabellone si interroga con un solo ordinamento.
//
// La scelta di QUALE tabellone riceve un punteggio sta in utils/boards.js, senza dipendenze da
// Firebase, cosi' e' verificabile dai test.

export { BOARD_GENERALE, dailyBoardId, provinceBoardId, boardForRun } from './boards';

/**
 * Classifica di un tabellone, dal punteggio piu' alto.
 * Se il tabellone non esiste ancora restituisce un elenco vuoto invece di un errore.
 */
export const getLeaderboard = async (boardId = BOARD_GENERALE, maxPlayers = 10) => {
  try {
    const entriesRef = collection(db, 'leaderboards', boardId, 'entries');
    const q = query(entriesRef, orderBy('bestScore', 'desc'), limit(maxPlayers));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Errore nel caricamento della classifica:', error);
    return [];
  }
};

/** Numero di partecipanti a un tabellone (per la riga "12 giocatori"). */
export const getLeaderboardSize = async (boardId) => {
  try {
    const entriesRef = collection(db, 'leaderboards', boardId, 'entries');
    const snapshot = await getCountFromServer(entriesRef);
    return snapshot.data().count;
  } catch (error) {
    return 0;
  }
};

/**
 * Salva il punteggio di una partita classificata, se migliore del precedente.
 * Viene scritta anche una copia in users/{uid}.bestScore, che resta il record personale.
 */
export const saveRankedScore = async ({ uid, username, boardId, score }) => {
  if (!uid || !boardId) throw new Error('Dati insufficienti per salvare il punteggio');

  const entryRef = doc(db, 'leaderboards', boardId, 'entries', uid);
  const existing = await getDoc(entryRef);
  const previous = existing.exists() ? existing.data().bestScore || 0 : 0;

  if (score > previous) {
    await setDoc(
      entryRef,
      {
        username: username || 'Giocatore',
        bestScore: score,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  }

  // Record personale: sempre il massimo, indipendentemente dal tabellone.
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const personalBest = userSnap.exists() ? userSnap.data().bestScore || 0 : 0;
  if (userSnap.exists() && score > personalBest) {
    await updateDoc(userRef, { bestScore: score, bestScoreDate: new Date() });
  }

  return Math.max(previous, score);
};
