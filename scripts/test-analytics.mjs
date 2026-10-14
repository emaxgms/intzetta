// Verifica del livello di misurazione: non deve MAI rompere il gioco e non deve inviare nulla
// se non e' configurato un fornitore. Sono le due proprieta' che contano davvero.
import * as a from '../.test-build/analytics.mjs';

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

// Ambiente browser minimo
const creati = [];
globalThis.document = {
  head: { appendChild: (el) => creati.push(el) },
  createElement: () => ({ setAttribute() {}, dataset: {} }),
};
globalThis.window = {};
globalThis.import = undefined;

console.log('\n=== 1. Senza configurazione non succede nulla ===');
const attivo = a.initAnalytics();
check('initAnalytics non attiva nessun fornitore', attivo === null, String(attivo));
check('nessuno script viene inserito nella pagina', creati.length === 0, String(creati.length));

let esploso = false;
try {
  a.track('partita_iniziata', { modalita: 'daily' });
  a.track('partita_finita', { punteggio: 12345 });
  a.track('evento_inesistente');
  a.track('senza_proprieta');
} catch (err) {
  esploso = true;
}
check('track() non lancia errori', !esploso);
check('nessuno script inserito dopo le chiamate', creati.length === 0, String(creati.length));

console.log('\n=== 2. I nomi degli eventi sono quelli previsti ===');
const attesi = [
  'GAME_STARTED',
  'ROUND_SCORED',
  'GAME_FINISHED',
  'SHARE_CLICKED',
  'DAILY_BLOCKED',
  'DAILY_RESUMED',
  'PRACTICE_STARTED',
];
check('tutti gli eventi sono definiti', attesi.every((k) => typeof a.EVENTS[k] === 'string'), Object.keys(a.EVENTS).join(', '));
check('i nomi non contengono spazi', Object.values(a.EVENTS).every((v) => /^[a-z_]+$/.test(v)), Object.values(a.EVENTS).join(', '));
check('nessun evento duplicato', new Set(Object.values(a.EVENTS)).size === attesi.length);

console.log('\n=== 3. Non vengono mai inviati dati personali ===');
// Il controllo e' sui singoli pezzi del nome separati da underscore: cercare "ip" come sottostringa
// darebbe falsi allarmi (per esempio dentro "ri-pr-esa").
const sospetti = ['email', 'uid', 'user', 'ip', 'nome', 'name', 'telefono', 'coordinate', 'lat', 'lon', 'lng'];
const token = Object.values(a.EVENTS).flatMap((v) => v.split('_'));
const trovati = token.filter((t) => sospetti.includes(t));
check('i nomi degli eventi non contengono dati personali', trovati.length === 0, trovati.join(', '));
check('i nomi sono leggibili a pezzi', token.every((t) => t.length > 1));

console.log(`\n=== RISULTATO: ${pass} superati, ${fail} falliti ===\n`);
process.exit(fail === 0 ? 0 : 1);
