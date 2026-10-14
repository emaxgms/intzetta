// Test della logica della sfida giornaliera. Eseguito con Node sul bundle generato da esbuild.
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

console.log('\n=== 1. Chiave del giorno (fuso di Roma) ===');
const key = d.todayKey();
check('formato YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(key), key);

// Un istante che a Roma e' il 15 ottobre ma a UTC e' ancora il 14 (estate: Roma = UTC+2).
const lateNightRome = new Date('2026-10-14T22:30:00Z'); // 00:30 del 15 a Roma
check('a Roma e\' gia\' il giorno dopo', d.todayKey(lateNightRome) === '2026-10-15', d.todayKey(lateNightRome));
const earlyRome = new Date('2026-10-14T09:00:00Z'); // 11:00 del 14 a Roma
check('stesso giorno a Roma', d.todayKey(earlyRome) === '2026-10-14', d.todayKey(earlyRome));

// Cambio dell'ora: a marzo Roma passa a UTC+2, a ottobre a UTC+1.
const winter = new Date('2026-01-15T12:00:00Z');
check('in inverno il giorno resta corretto', d.todayKey(winter) === '2026-01-15', d.todayKey(winter));

console.log('\n=== 2. Conto alla rovescia alla prossima sfida ===');
const ms1 = d.msUntilNextDaily(earlyRome);
check('compreso fra 0 e 24 ore', ms1 > 0 && ms1 < 24 * 3600 * 1000, `${Math.round(ms1 / 3600000)}h`);
check('formattazione leggibile', /^(\d+h )?\d+m$/.test(d.formatCountdown(ms1)), d.formatCountdown(ms1));
// Alle 11:00 ora di Roma mancano 13 ore alla mezzanotte
check('valore atteso a Roma 11:00 (~13h)', Math.abs(ms1 - 13 * 3600 * 1000) < 60000, d.formatCountdown(ms1));
// Cambio d'ora: il giorno puo' durare 23 o 25 ore. Il conto alla rovescia deve seguirlo,
// altrimenti la sfida cambierebbe un'ora prima o un'ora dopo rispetto a mezzanotte.
// 25 ottobre 2026: l'ora legale finisce, la giornata dura 25 ore.
const fallBack = new Date('2026-10-24T22:00:00Z'); // = 25/10/2026 00:00 a Roma (UTC+2)
const msFall = d.msUntilNextDaily(fallBack);
check('giorno di 25 ore (fine ora legale)', msFall === 25 * 3600 * 1000, d.formatCountdown(msFall));
// 29 marzo 2026: l'ora legale inizia, la giornata dura 23 ore.
const springForward = new Date('2026-03-28T23:00:00Z'); // = 29/03/2026 00:00 a Roma (UTC+1)
const msSpring = d.msUntilNextDaily(springForward);
check('giorno di 23 ore (inizio ora legale)', msSpring === 23 * 3600 * 1000, d.formatCountdown(msSpring));

console.log('\n=== 3. Numerazione delle sfide ===');
check('il giorno di partenza e\' #1', d.dailyNumber(d.DAILY_EPOCH) === 1, String(d.dailyNumber(d.DAILY_EPOCH)));
check('il giorno dopo e\' #2', d.dailyNumber('2026-10-15') === 2, String(d.dailyNumber('2026-10-15')));
check('una data precedente non scende sotto #1', d.dailyNumber('2020-01-01') === 1, String(d.dailyNumber('2020-01-01')));

console.log('\n=== 4. Selezione deterministica dei comuni ===');
const a1 = d.pickDailyCities('2026-10-14');
const a2 = d.pickDailyCities('2026-10-14');
const b1 = d.pickDailyCities('2026-10-15');
const names = (arr) => arr.map((c) => c.name);
check('8 comuni', a1.length === 8, String(a1.length));
check('stessa data -> stessa partita', JSON.stringify(names(a1)) === JSON.stringify(names(a2)));
check('date diverse -> partite diverse', JSON.stringify(names(a1)) !== JSON.stringify(names(b1)));
check('nessun comune ripetuto', new Set(names(a1)).size === 8);
check('tutti i comuni hanno coordinate valide', a1.every((c) => Array.isArray(c.coordinates) && c.coordinates.length === 2 && Math.abs(c.coordinates[0] - 40) < 2));

// Stabilita' nel tempo: 400 giorni consecutivi non devono mai produrre duplicati.
let dupes = 0;
let minLat = 90;
let maxLat = -90;
for (let i = 0; i < 400; i += 1) {
  const day = new Date(Date.UTC(2026, 9, 14) + i * 86400000).toISOString().slice(0, 10);
  const set = d.pickDailyCities(day);
  if (new Set(names(set)).size !== set.length) dupes += 1;
  set.forEach((c) => {
    minLat = Math.min(minLat, c.coordinates[0]);
    maxLat = Math.max(maxLat, c.coordinates[0]);
  });
}
check('400 giorni senza duplicati', dupes === 0, `${dupes} giorni con duplicati`);
check('i comuni estratti stanno in Sardegna', minLat > 38.5 && maxLat < 41.5, `lat ${minLat.toFixed(2)}..${maxLat.toFixed(2)}`);
check('l\'allenamento usa comuni diversi', JSON.stringify(names(d.pickRandomCities())) !== JSON.stringify(names(d.pickRandomCities())));

console.log('\n=== 5. Punteggio ===');
check('1 km -> 5000 punti', d.calcScore(1000) === 5000, String(d.calcScore(1000)));
check('0 km -> 5000 punti', d.calcScore(0) === 5000);
check('50 km -> 0 punti', d.calcScore(50000) === 0, String(d.calcScore(50000)));
check('100 km -> 0 punti', d.calcScore(100000) === 0);
check('il punteggio cala con la distanza', d.calcScore(2000) > d.calcScore(5000) && d.calcScore(5000) > d.calcScore(20000));
// Il giocatore mediano misurato sbaglia ~5,9 km per round: deve stare in un intervallo sensato.
const median = d.calcScore(5900);
check('a 5,9 km il punteggio e\' ~2900', median > 2600 && median < 3200, String(median));
check('mai fuori dall\'intervallo 0-5000', [0, 500, 1000, 5000, 25000, 49000, 60000].every((x) => { const s = d.calcScore(x); return s >= 0 && s <= 5000; }));

console.log('\n=== 6. Griglia di emoji ===');
check('entro 1 km -> verde', d.distanceEmoji(800) === '🟩', d.distanceEmoji(800));
check('5 km -> giallo', d.distanceEmoji(5000) === '🟨', d.distanceEmoji(5000));
check('12 km -> arancione', d.distanceEmoji(12000) === '🟧', d.distanceEmoji(12000));
check('30 km -> rosso', d.distanceEmoji(30000) === '🟥', d.distanceEmoji(30000));
check('60 km -> nero', d.distanceEmoji(60000) === '⬛', d.distanceEmoji(60000));
check('distanza breve in metri', d.formatDistance(750) === '750 m', d.formatDistance(750));
check('distanza lunga in km', d.formatDistance(5900) === '5.9 km', d.formatDistance(5900));

console.log('\n=== 7. Testo da condividere ===');
const rounds = [
  { name: 'Bitti', distanceM: 500 },
  { name: 'Teulada', distanceM: 4000 },
  { name: 'Arzachena', distanceM: 12000 },
  { name: 'Ottana', distanceM: 60000 },
];
const text = d.buildShareText({ mode: 'daily', score: 12000, rounds, dateKey: '2026-10-14' });
check('contiene il numero della sfida', text.includes('INZETTA #1'), text.split('\n')[0]);
check('contiene il punteggio formattato', text.includes('12.000'), text);
check('contiene 4 emoji', (text.match(/[🟩🟨🟧🟥⬛]/gu) || []).length === 4);
check('contiene il LINK (differenza chiave da Wordle)', text.includes('https://intzetta.top'));
check('non svela i punteggi per round', !text.includes('500') && !text.includes('4000'));
const practice = d.buildShareText({ mode: 'practice', score: 9000, rounds });
check('la modalita\' allenamento non ha numero di sfida', !practice.includes('INZETTA #'), practice.split('\n')[0]);

console.log('\n=== 8. Risultato del giorno e serie (localStorage simulato) ===');
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
};

check('senza storico la serie e\' 0', d.effectiveStreak('2026-10-14') === 0);
let s = d.registerDailyPlayed('2026-10-14');
check('primo giorno -> serie 1', s.current === 1, String(s.current));
s = d.registerDailyPlayed('2026-10-14');
check('rigiocare lo stesso giorno non aumenta la serie', s.current === 1, String(s.current));
s = d.registerDailyPlayed('2026-10-15');
check('giorno successivo -> serie 2', s.current === 2, String(s.current));
s = d.registerDailyPlayed('2026-10-17');
check('saltare un giorno azzera la serie a 1', s.current === 1, String(s.current));
check('il record resta il massimo', s.best === 2, String(s.best));
check('la serie e\' valida se giocata ieri', d.effectiveStreak('2026-10-18') === 1, String(d.effectiveStreak('2026-10-18')));
check('la serie scade dopo due giorni di assenza', d.effectiveStreak('2026-10-20') === 0, String(d.effectiveStreak('2026-10-20')));

d.saveDailyResult('2026-10-14', { score: 28000, rounds });
check('il risultato del giorno si rilegge', d.getDailyResult('2026-10-14').score === 28000);
check('un giorno senza partita non ha risultato', d.getDailyResult('2026-10-19') === null);
d.saveDailyProgress('2026-10-14', { round: 3 });
check('la partita in corso si riprende', d.getDailyProgress('2026-10-14').round === 3);
d.clearDailyProgress('2026-10-14');
check('la partita in corso si cancella', d.getDailyProgress('2026-10-14') === null);

// localStorage non disponibile (navigazione privata): non deve lanciare errori.
globalThis.window = {
  localStorage: {
    getItem: () => { throw new Error('accesso negato'); },
    setItem: () => { throw new Error('accesso negato'); },
    removeItem: () => { throw new Error('accesso negato'); },
  },
};
let survived = true;
try {
  d.getStreak();
  d.registerDailyPlayed('2026-10-14');
  d.saveDailyResult('2026-10-14', { score: 1 });
  d.getDailyResult('2026-10-14');
  d.clearDailyProgress('2026-10-14');
} catch (err) {
  survived = false;
}
check('senza localStorage il gioco non si rompe', survived);

console.log(`\n=== RISULTATO: ${pass} superati, ${fail} falliti ===\n`);
process.exit(fail === 0 ? 0 : 1);
