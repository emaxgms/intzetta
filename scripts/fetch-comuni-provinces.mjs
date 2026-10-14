/**
 * Costruisce la mappa "comune -> provincia" per i comuni della Sardegna.
 *
 * PERCHE' SERVE
 * -------------
 * Il file dei comuni usato dal gioco contiene solo nome e coordinate. Per creare le pagine per
 * provincia servono i dati amministrativi, e NON vanno indovinati: assegnare un comune alla
 * provincia sbagliata significherebbe pubblicare informazione errata.
 *
 * FONTE
 * -----
 * Elenco ufficiale dei comuni italiani con provincia e sigla, derivato dai dati ISTAT.
 * I dati ISTAT sono pubblicati con licenza CC BY 3.0 IT.
 * Va lanciato a mano quando serve aggiornare i dati: la compilazione NON dipende dalla rete,
 * perche' il risultato viene salvato in src/data/comuni-provinces.json.
 *
 * Uso:  node scripts/fetch-comuni-provinces.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CITIES = path.join(ROOT, 'src', 'data', 'sardinian-cities-corrected.json');
const OUTPUT = path.join(ROOT, 'src', 'data', 'comuni-provinces.json');
const SOURCE_URL =
  'https://raw.githubusercontent.com/matteocontrini/comuni-json/master/comuni.json';

/** Nome italiano di un comune: nel nostro file il formato e' "Sardo/Italiano" oppure solo "Italiano". */
function italianName(fullName) {
  const parts = fullName.split('/');
  return parts[parts.length - 1].trim();
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const response = await fetch(SOURCE_URL);
if (!response.ok) {
  throw new Error(`Impossibile scaricare l'elenco dei comuni: HTTP ${response.status}`);
}
const allComuni = await response.json();
console.log(`Elenco scaricato: ${allComuni.length} comuni italiani`);

// Solo la Sardegna, indicizzata per nome normalizzato.
const byName = new Map();
for (const c of allComuni) {
  if (c.regione?.nome !== 'Sardegna') continue;
  byName.set(normalize(c.nome), c);
}
console.log(`Comuni sardi nell'elenco ufficiale: ${byName.size}`);

const cities = JSON.parse(fs.readFileSync(CITIES, 'utf8'));
const result = {};
const unmatched = [];

for (const city of cities) {
  const it = italianName(city.name);
  const found = byName.get(normalize(it));
  if (!found) {
    unmatched.push(city.name);
    continue;
  }
  result[city.name] = {
    provincia: found.provincia.nome,
    sigla: found.sigla,
    codiceIstat: found.codice,
  };
}

console.log(`Comuni abbinati: ${Object.keys(result).length} su ${cities.length}`);
if (unmatched.length > 0) {
  console.log(`\nNON abbinati (${unmatched.length}) — da verificare a mano, non indovinati:`);
  unmatched.forEach((n) => console.log(`  ${n}`));
}

// Conteggio per provincia: serve a controllare che i numeri abbiano senso.
const perProvincia = {};
Object.values(result).forEach(({ provincia, sigla }) => {
  const key = `${provincia} (${sigla})`;
  perProvincia[key] = (perProvincia[key] || 0) + 1;
});
console.log('\nComuni per provincia:');
Object.entries(perProvincia)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k.padEnd(28)} ${v}`));
const somma = Object.values(perProvincia).reduce((a, b) => a + b, 0);
console.log(`  ${'TOTALE'.padEnd(28)} ${somma}`);

const payload = {
  _fonte:
    'Elenco dei comuni italiani con provincia e sigla, derivato dai dati ISTAT (CC BY 3.0 IT). ' +
    'Generato da scripts/fetch-comuni-provinces.mjs',
  _aggiornato: new Date().toISOString().slice(0, 10),
  comuni: result,
};

fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`\nScritto ${path.relative(ROOT, OUTPUT)} (${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB)`);
