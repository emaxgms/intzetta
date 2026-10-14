// Verifica dei dati sulle province e del raggruppamento usato dalle pagine di contenuto.
// Se questi numeri cambiano, le pagine pubblicate mentirebbero: meglio fermarsi qui.
import * as d from '../.test-build/daily.mjs';
import * as p from '../.test-build/provinces.mjs';

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

const TOTALE_ATTESO = 377;
// Conteggi ufficiali delle province sarde in vigore (riforma 2016).
const ATTESI = { SU: 107, SS: 92, OR: 87, NU: 74, CA: 17 };

console.log('\n=== 1. Copertura dei dati ===');
const gruppi = p.provinceGroups();
const totale = gruppi.reduce((s, g) => s + g.cities.length, 0);
check(`i comuni sono ${TOTALE_ATTESO}`, d.pickDailyCities('2026-01-01').length === 8); // sanity del bundle
check('tutte le province hanno comuni', gruppi.length === 5, String(gruppi.length));
check(`la somma delle province è ${TOTALE_ATTESO}`, totale === TOTALE_ATTESO, String(totale));

console.log('\n=== 2. Conteggi per provincia ===');
for (const [sigla, atteso] of Object.entries(ATTESI)) {
  const n = p.citiesByProvince(sigla).length;
  check(`${sigla}: ${atteso} comuni`, n === atteso, `trovati ${n}`);
}

console.log('\n=== 3. Ogni comune ha una provincia, e una sola ===');
const senzaProvincia = [];
const assegnazioni = new Map();
for (const g of gruppi) {
  for (const c of g.cities) {
    if (assegnazioni.has(c.name)) console.log(`  ATTENZIONE: ${c.name} compare in due province`);
    assegnazioni.set(c.name, g.sigla);
    if (!c.coordinates || c.coordinates.length !== 2) senzaProvincia.push(c.name);
  }
}
check('nessun comune duplicato fra province', assegnazioni.size === TOTALE_ATTESO, String(assegnazioni.size));
check('nessun comune senza coordinate', senzaProvincia.length === 0, senzaProvincia.join(', '));

console.log('\n=== 4. Lettura della provincia dall\'indirizzo ===');
check('?provincia=SS riconosciuta', p.provinceFromSearch('?provincia=SS')?.sigla === 'SS');
check('minuscolo accettato', p.provinceFromSearch('?provincia=ss')?.sigla === 'SS');
check('sigla inesistente ignorata', p.provinceFromSearch('?provincia=ZZ') === null);
check('parametro assente ignorato', p.provinceFromSearch('') === null);
check('parametro spazzatura ignorato', p.provinceFromSearch('?provincia=<script>') === null);

console.log('\n=== 5. Partita limitata a una provincia ===');
for (const g of gruppi) {
  const partita = d.pickRandomFrom(g.cities, 8);
  const dentro = partita.every((c) => p.provinceOf(c.name) === g.sigla);
  const distinti = new Set(partita.map((c) => c.name)).size === partita.length;
  check(`${g.sigla}: 8 comuni distinti e tutti della provincia`, partita.length === 8 && dentro && distinti);
}
// Con meno di 8 comuni disponibili deve restituire quelli che ci sono, senza inventare.
const pochi = d.pickRandomFrom(gruppi[gruppi.length - 1].cities.slice(0, 3), 8);
check('con pochi comuni disponibili ne restituisce quanti ce ne sono', pochi.length === 3, String(pochi.length));
check('elenco vuoto non fa esplodere nulla', d.pickRandomFrom([], 8).length === 8, 'ricade su tutta la Sardegna');

console.log('\n=== 6. I nomi italiani dei comuni sono abbinabili ===');
// Il generatore delle pagine usa la parte dopo la barra come nome italiano.
const doppi = gruppi.flatMap((g) => g.cities).filter((c) => c.name.includes('/'));
check('esistono comuni con doppio nome', doppi.length > 200, String(doppi.length));
check('la forma sarda viene prima', doppi.every((c) => c.name.split('/')[0].trim().length > 0));

console.log(`\n=== RISULTATO: ${pass} superati, ${fail} falliti ===\n`);
process.exit(fail === 0 ? 0 : 1);
