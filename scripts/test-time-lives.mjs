// Verifica delle due meccaniche nuove: il tempo limite e le vite.
// Sono le regole che decidono chi entra in classifica, quindi vanno bloccate qui.
import * as d from '../.test-build/daily.mjs';
import * as v from '../.test-build/lives.mjs';

let pass = 0;
let fail = 0;
function check(label, cond, detail = '') {
  if (cond) {
    pass += 1;
    console.log(`  OK   ${label}`);
  } else {
    fail += 1;
    console.log(`  FAIL ${label} ${detail}`);
  }
}

console.log('\n=== 1. Tempo limite e quota del punteggio ===');
check('il limite è di 30 secondi', d.ROUND_TIME_LIMIT_S === 30, String(d.ROUND_TIME_LIMIT_S));
check('il punteggio pieno è entro 5 secondi', d.FULL_CREDIT_TIME_S === 5, String(d.FULL_CREDIT_TIME_S));
check('la quota minima è il 75%', d.MIN_TIME_MULTIPLIER === 0.75, String(d.MIN_TIME_MULTIPLIER));

check('a 0 secondi: 100%', d.timeMultiplier(0) === 1);
check('a 5 secondi esatti: ancora 100%', d.timeMultiplier(5) === 1);
check('a 4,9 secondi: 100%', d.timeMultiplier(4.9) === 1);
check('a 30 secondi: 75%', d.timeMultiplier(30) === 0.75);
check('a 60 secondi: resta 75%', d.timeMultiplier(60) === 0.75, String(d.timeMultiplier(60)));
check('a tempo negativo: 100%', d.timeMultiplier(-3) === 1);
check('a tempo non valido: 100%', d.timeMultiplier(NaN) === 1);
// A metà strada (17,5s) la quota deve stare esattamente a metà fra 100% e 75%.
check('a metà tempo: 87,5%', Math.abs(d.timeMultiplier(17.5) - 0.875) < 1e-9, String(d.timeMultiplier(17.5)));
// La quota non deve mai risalire col passare del tempo.
let monotona = true;
let precedente = 1.1;
for (let s = 0; s <= 40; s += 0.5) {
  const q = d.timeMultiplier(s);
  if (q > precedente + 1e-9) monotona = false;
  precedente = q;
}
check('la quota non risale mai col tempo', monotona);

console.log('\n=== 2. Punteggio finale: distanza e tempo insieme ===');
check('tiro perfetto in 3 secondi: 5000', d.roundPoints(1000, 3) === 5000, String(d.roundPoints(1000, 3)));
check('tiro perfetto allo scadere: 3750', d.roundPoints(1000, 30) === 3750, String(d.roundPoints(1000, 30)));
check('tiro perfetto a metà tempo: 4375', d.roundPoints(1000, 17.5) === 4375, String(d.roundPoints(1000, 17.5)));
check('mai oltre il massimo di un round', d.roundPoints(0, 2) === d.MAX_ROUND_SCORE);
check('mai sotto zero', d.roundPoints(999999, 30) === 0);
// Lo stesso tiro, fatto in fretta, deve valere di piu'.
check('lo stesso tiro vale di piu\' se fatto in fretta', d.roundPoints(6000, 4) > d.roundPoints(6000, 30));
// La distanza deve continuare a contare piu' del tempo: 5 km in 30s battono 20 km in 3s.
check(
  'la distanza conta piu\' del tempo',
  d.roundPoints(5000, 30) > d.roundPoints(20000, 1),
  `${d.roundPoints(5000, 30)} contro ${d.roundPoints(20000, 1)}`
);

console.log('\n=== 3. Vite giornaliere ===');
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, val) => store.set(k, String(val)),
    removeItem: (k) => store.delete(k),
  },
};
const OGGI = '2026-10-14';
const DOMANI = '2026-10-15';

v.resetLives(OGGI);
let stato = v.livesState(OGGI);
check('all\'inizio ci sono 3 vite', stato.total === 3, String(stato.total));
check('sono tutte gratuite', stato.freeLeft === 3 && stato.bought === 0);
check('si puo\' giocare', stato.canPlay === true);

check('prima partita: vita presa', v.consumeLife(OGGI) === true);
check('seconda partita: vita presa', v.consumeLife(OGGI) === true);
check('terza partita: vita presa', v.consumeLife(OGGI) === true);
check('quarta partita: rifiutata', v.consumeLife(OGGI) === false);
stato = v.livesState(OGGI);
check('vite esaurite', stato.total === 0 && stato.canPlay === false, String(stato.total));

console.log('\n=== 4. Vite comprate ===');
check('se ne comprano 2', v.addBoughtLives(2) === 2);
stato = v.livesState(OGGI);
check('due vite disponibili', stato.total === 2, String(stato.total));
check('sono segnate come comprate', stato.freeLeft === 0 && stato.bought === 2);
check('si puo\' rigiocare', v.consumeLife(OGGI) === true);
check('e ancora', v.consumeLife(OGGI) === true);
check('finite di nuovo', v.consumeLife(OGGI) === false);

console.log('\n=== 5. Il giorno dopo ===');
check('vengono comprate 3 vite', v.addBoughtLives(3) === 3);
stato = v.livesState(DOMANI);
check('le gratuite tornano', stato.freeLeft === 3, String(stato.freeLeft));
check('le comprate restano', stato.bought === 3, String(stato.bought));
check('totale 6', stato.total === 6, String(stato.total));
// Il giorno dopo si consumano prima le gratuite.
v.consumeLife(DOMANI);
stato = v.livesState(DOMANI);
check('consumando si usano le gratuite', stato.freeLeft === 2 && stato.bought === 3);
v.consumeLife(DOMANI);
v.consumeLife(DOMANI);
v.consumeLife(DOMANI);
stato = v.livesState(DOMANI);
check('esaurite le gratuite si intaccano le comprate', stato.freeLeft === 0 && stato.bought === 2, `gratuite ${stato.freeLeft}, comprate ${stato.bought}`);

console.log('\n=== 6. Senza memoria locale il gioco non si rompe ===');
globalThis.window = {
  localStorage: {
    getItem: () => { throw new Error('accesso negato'); },
    setItem: () => { throw new Error('accesso negato'); },
    removeItem: () => { throw new Error('accesso negato'); },
  },
};
let sopravvissuto = true;
try {
  v.livesState(OGGI);
  v.consumeLife(OGGI);
  v.addBoughtLives(1);
  v.resetLives(OGGI);
} catch (err) {
  sopravvissuto = false;
}
check('nessuna eccezione', sopravvissuto);

console.log('\n=== 7. Round azzeccato e vite vinte nella sfida del giorno ===');
// La sezione 6 ha sostituito la memoria locale con una che lancia errori: qui si torna a una
// funzionante, altrimenti le verifiche seguenti passerebbero (o fallirebbero) per il motivo
// sbagliato.
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, val) => store.set(k, String(val)),
    removeItem: (k) => store.delete(k),
  },
};
check('il raggio è 1 km', d.PERFECT_DISTANCE_M === 1000, String(d.PERFECT_DISTANCE_M));
check('il massimo vinto è 8', d.MAX_EARNABLE_LIVES === 8, String(d.MAX_EARNABLE_LIVES));
check('a 800 metri è azzeccato', d.isPerfectRound({ distanceM: 800 }) === true);
check('a 1 km esatto è azzeccato', d.isPerfectRound({ distanceM: 1000 }) === true);
check('a 1.200 metri non è azzeccato', d.isPerfectRound({ distanceM: 1200 }) === false);
check('un round saltato non è azzeccato', d.isPerfectRound({ distanceM: Number.MAX_SAFE_INTEGER, skipped: true }) === false);
check('un round senza dati non è azzeccato', d.isPerfectRound(null) === false);
// Il punto delicato: conta la distanza, NON il punteggio finale. Chi trova il paese in 25 secondi
// ha azzeccato il paese esattamente come chi ci mette 3 secondi.
check(
  'conta la distanza e non la velocità',
  d.isPerfectRound({ distanceM: 700, points: 3800 }) === true &&
    d.roundPoints(700, 28) < d.MAX_ROUND_SCORE,
  'un tiro preciso ma lento deve valere una vita'
);

console.log('\n=== 8. Le vite vinte si accumulano e hanno un tetto giornaliero ===');
v.resetLives(OGGI);
check('si vincono 3 vite', v.addEarnedLives(OGGI, 3) === 3);
check('si vincono le altre 5', v.addEarnedLives(OGGI, 5) === 5);
check('oltre 8 non si vince piu\'', v.addEarnedLives(OGGI, 2) === 0);
let s = v.livesState(OGGI);
check('vite vinte registrate a parte', s.earned === 8, String(s.earned));
check('totale: 3 gratuite + 8 vinte', s.total === 11, String(s.total));
check('restante vincibile oggi: 0', s.earnableToday === 0);
check('le vinte non si sono mescolate con le comprate', s.bought === 0);

console.log('\n=== 9. Ordine di consumo: prima le gratuite, poi le vinte ===');
v.consumeLife(OGGI);
v.consumeLife(OGGI);
v.consumeLife(OGGI);
s = v.livesState(OGGI);
check('le gratuite sono finite', s.freeLeft === 0, String(s.freeLeft));
check('le vinte sono intatte', s.earned === 8, String(s.earned));
v.consumeLife(OGGI);
s = v.livesState(OGGI);
check('ora si intaccano le vinte', s.earned === 7, String(s.earned));

console.log('\n=== 10. Le vite vinte restano il giorno dopo ===');
// Data mai usata prima in questo file: le sezioni precedenti hanno gia' consumato le vite di
// DOMANI, e riusarla farebbe fallire il controllo per il motivo sbagliato.
const DOPODOMANI = '2026-10-16';
s = v.livesState(DOPODOMANI);
check('le vinte si portano avanti', s.earned === 7, String(s.earned));
check('le gratuite tornano', s.freeLeft === 3, String(s.freeLeft));
check('si puo\' vincere di nuovo', s.earnableToday === 8, String(s.earnableToday));

console.log('\n=== 11. A quale classifica va ogni partita ===');
const boards = await import('../.test-build/boards.mjs');
check('allenamento: nessuna classifica', boards.boardForRun({ mode: 'practice', dateKey: '2026-10-14' }) === null);
check(
  'sfida del giorno: classifica del giorno',
  boards.boardForRun({ mode: 'daily', dateKey: '2026-10-14' }) === 'giornaliera-2026-10-14'
);
check(
  'partita a caso: classifica generale',
  boards.boardForRun({ mode: 'ranked', dateKey: '2026-10-14' }) === 'generale'
);
check(
  'partita di provincia: classifica di quella provincia',
  boards.boardForRun({ mode: 'ranked', provinceSigla: 'SS', dateKey: '2026-10-14' }) === 'provincia-ss'
);
// Il caso che era sbagliato: la sfida del giorno finiva nella classifica della provincia
// se sulla home era selezionata una provincia.
check(
  'la sfida del giorno NON finisce nella classifica di provincia',
  boards.boardForRun({ mode: 'daily', provinceSigla: 'SS', dateKey: '2026-10-14' }) ===
    'giornaliera-2026-10-14',
  'era il bug: la sfida del giorno e\' su tutta la Sardegna'
);
check('province diverse hanno classifiche diverse', boards.provinceBoardId('CA') !== boards.provinceBoardId('SS'));
check('giorni diversi hanno classifiche diverse', boards.dailyBoardId('2026-10-14') !== boards.dailyBoardId('2026-10-15'));

console.log(`\n=== RISULTATO: ${pass} superati, ${fail} falliti ===\n`);
process.exit(fail === 0 ? 0 : 1);
