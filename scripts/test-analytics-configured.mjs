// Verifica della misurazione QUANDO E' CONFIGURATA.
// Controlla che lo script inserito nella pagina abbia gli attributi giusti: un nome di attributo
// sbagliato non rompe nulla a occhio, semplicemente non misura (o misura anche le prove in locale).
import * as a from '../.test-build/analytics-configured.mjs';

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

const inseriti = [];
globalThis.document = {
  head: { appendChild: (el) => inseriti.push(el) },
  createElement: () => ({ dataset: {} }),
};
const inviati = [];
globalThis.window = {
  umami: { track: (event, props) => inviati.push({ event, props }) },
};

console.log('\n=== 1. Lo script viene inserito una volta sola ===');
const attivo = a.initAnalytics();
check('il fornitore attivo è umami', attivo === 'umami', String(attivo));
check('è stato inserito uno script', inseriti.length === 1, String(inseriti.length));

const s = inseriti[0];
check('indirizzo corretto', s.src === 'https://cloud.umami.is/script.js', String(s.src));
check('caricamento non bloccante', s.defer === true);
check(
  'identificativo del sito corretto',
  s.dataset.websiteId === '7c6bc700-28be-4ea7-83bb-686e6d19784f',
  String(s.dataset.websiteId)
);

console.log('\n=== 2. Attributi del dominio: il nome conta ===');
check('usa data-domains (Umami)', s.dataset.domains === 'intzetta.top', String(s.dataset.domains));
check('NON usa data-domain (sarebbe ignorato)', s.dataset.domain === undefined, String(s.dataset.domain));
check('rispetta il "non tracciare" del browser', s.dataset.doNotTrack === 'true');
check('raccoglie i tempi di caricamento', s.dataset.performance === 'true');

console.log('\n=== 3. Inizializzare due volte non raddoppia nulla ===');
a.initAnalytics();
check('resta un solo script', inseriti.length === 1, String(inseriti.length));

console.log('\n=== 4. Gli eventi arrivano al fornitore ===');
a.track(a.EVENTS.GAME_FINISHED, { modalita: 'daily', punteggio: 28450, durata_s: 240 });
check('un evento inviato', inviati.length === 1, String(inviati.length));
check('nome evento corretto', inviati[0]?.event === 'partita_finita', String(inviati[0]?.event));
check('proprietà conservate', inviati[0]?.props?.punteggio === 28450);
check('nessun dato personale nelle proprietà', !('email' in (inviati[0]?.props || {})) && !('uid' in (inviati[0]?.props || {})));

console.log('\n=== 5. Un fornitore che si rompe non rompe il gioco ===');
globalThis.window.umami.track = () => {
  throw new Error('il fornitore è caduto');
};
let esploso = false;
try {
  a.track(a.EVENTS.SHARE_CLICKED, { modalita: 'daily' });
} catch (err) {
  esploso = true;
}
check('track() ingoia l\'errore del fornitore', !esploso);

console.log(`\n=== RISULTATO: ${pass} superati, ${fail} falliti ===\n`);
process.exit(fail === 0 ? 0 : 1);
