// Simulazione di una partita completa: verifica che la catena
// estrazione -> punteggio -> risultato -> serie -> testo condiviso resti coerente.
import * as d from '../.test-build/daily.mjs';

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

// localStorage simulato
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
};

const dateKey = '2026-11-02';
const cities = d.pickDailyCities(dateKey);

// Un giocatore che sbaglia sempre di poco: 1, 2, 3, ... 8 km.
const errors = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000];
const rounds = cities.map((c, i) => {
  const points = d.calcScore(errors[i]);
  return { name: c.name, distanceM: errors[i], points };
});
const result = {
  mode: 'daily',
  dateKey,
  score: rounds.reduce((s, r) => s + r.points, 0),
  rounds,
  durationMs: 240000,
};

console.log('\n=== Partita completa della sfida giornaliera ===');
check('la partita ha 8 round', rounds.length === 8, String(rounds.length));
check('il punteggio totale e\' la somma dei round', result.score === rounds.reduce((s, r) => s + r.points, 0));
check('il punteggio sta fra 0 e 40.000', result.score >= 0 && result.score <= d.MAX_GAME_SCORE, String(result.score));
check('ogni round ha un punteggio valido', rounds.every((r) => r.points >= 0 && r.points <= d.MAX_ROUND_SCORE));
check('gli errori crescenti danno punteggi decrescenti', rounds.every((r, i) => i === 0 || r.points <= rounds[i - 1].points));

console.log('\n=== Risultato salvato e riletto ===');
d.saveDailyResult(dateKey, result);
const reread = d.getDailyResult(dateKey);
check('il risultato si rilegge identico', reread && reread.score === result.score && reread.rounds.length === 8);
check('la partita in corso viene archiviata', d.getDailyProgress(dateKey) === null);

console.log('\n=== Serie aggiornata ===');
const s1 = d.registerDailyPlayed(dateKey);
check('prima sfida -> serie 1', s1.current === 1, String(s1.current));
const s2 = d.registerDailyPlayed('2026-11-03');
check('secondo giorno -> serie 2', s2.current === 2, String(s2.current));
check('la serie e\' visibile il giorno stesso', d.effectiveStreak('2026-11-03') === 2);

console.log('\n=== Testo condiviso finale ===');
const text = d.buildShareText(result);
const lines = text.split('\n');
check('8 emoji nella griglia', (lines[3].match(/[🟩🟨🟧🟥⬛]/gu) || []).length === 8, lines[3]);
check('contiene il numero della sfida', /INZETTA #\d+/.test(lines[0]), lines[0]);
check('contiene il punteggio con separatore italiano', lines[1].includes(result.score.toLocaleString('it-IT')), lines[1]);
check('contiene il link', text.includes('https://intzetta.top'));
check('non contiene le distanze (nessuno spoiler)', !text.includes('km'));
console.log('\n--- testo che l\'utente incollerebbe in chat ---');
console.log(text.split('\n').map((l) => '    ' + l).join('\n'));

console.log('\n=== Ripresa di una partita interrotta ===');
const partial = { rounds: rounds.slice(0, 3) };
d.saveDailyProgress(dateKey, partial);
const resumed = d.getDailyProgress(dateKey);
check('i round gia\' fatti si rileggono', resumed.rounds.length === 3, String(resumed.rounds.length));
check('la partita ripresa riparte dal round giusto', resumed.rounds.length === 3);
check('un risultato gia\' salvato blocca la sfida', d.getDailyResult(dateKey) !== null);

console.log(`\n=== RISULTATO: ${pass} superati, ${fail} falliti ===\n`);
process.exit(fail === 0 ? 0 : 1);
