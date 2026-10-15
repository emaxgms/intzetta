/**
 * Costruisce i dati descrittivi di ogni comune, per le pagine di contenuto.
 *
 * PERCHE' SERVE
 * -------------
 * Le norme di AdSense non ammettono pubblicita' su pagine senza contenuto, e 377 pagine generate
 * dallo stesso modello verrebbero lette come contenuto duplicato. La differenza la fanno i DATI:
 * abitanti, altitudine, distanze, comuni vicini. Sono numeri veri e diversi per ogni comune, e
 * rendono ogni pagina utile di per se'.
 *
 * FONTI (aperte, nessuna chiave)
 *  - popolazione, CAP, codice ISTAT: elenco dei comuni italiani derivato dai dati ISTAT (CC BY 3.0 IT)
 *  - altitudine: Open-Meteo Elevation API (dati Copernicus DEM)
 * Tutto viene salvato in src/data/comuni-dettagli.json, quindi la compilazione NON dipende dalla rete.
 *
 * Uso:  node scripts/fetch-comuni-dettagli.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CITIES = path.join(ROOT, 'src', 'data', 'sardinian-cities-corrected.json');
const OUTPUT = path.join(ROOT, 'src', 'data', 'comuni-dettagli.json');
const SOURCE_URL = 'https://raw.githubusercontent.com/matteocontrini/comuni-json/master/comuni.json';

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

const comuni = JSON.parse(fs.readFileSync(CITIES, 'utf8'));

console.log('Scarico l\'elenco ufficiale dei comuni...');
const risposta = await fetch(SOURCE_URL);
if (!risposta.ok) throw new Error(`Elenco non scaricabile: HTTP ${risposta.status}`);
const elenco = await risposta.json();

const perNome = new Map();
for (const c of elenco) {
  if (c.regione?.nome !== 'Sardegna') continue;
  perNome.set(normalize(c.nome), c);
}
console.log(`Comuni sardi nell'elenco: ${perNome.size}`);

const dettagli = {};
const mancanti = [];

for (const c of comuni) {
  const ufficiale = perNome.get(normalize(italianName(c.name)));
  if (!ufficiale) {
    mancanti.push(c.name);
    dettagli[c.name] = { popolazione: null, cap: null, codiceIstat: null };
    continue;
  }
  dettagli[c.name] = {
    popolazione: ufficiale.popolazione ?? null,
    cap: Array.isArray(ufficiale.cap) ? ufficiale.cap : [],
    codiceIstat: ufficiale.codice ?? null,
    sigla: ufficiale.sigla ?? null,
    provincia: ufficiale.provincia?.nome ?? null,
  };
}

console.log(`Abbinati: ${comuni.length - mancanti.length} su ${comuni.length}`);
if (mancanti.length) {
  console.log(`Non abbinati (${mancanti.length}): ${mancanti.join(', ')}`);
}

// ---------------------------------------------------------------------------
// Altitudine (Open-Meteo Elevation API, dati Copernicus DEM, nessuna chiave)
// ---------------------------------------------------------------------------
// Si interroga in gruppi da 100 coordinate per non fare 377 richieste separate.
console.log('\nScarico le altitudini (Open-Meteo)...');
const daChiedere = comuni.map((c) => ({ nome: c.name, lat: c.coordinates[0], lon: c.coordinates[1] }));
const DIM = 100;
let ottenute = 0;

for (let i = 0; i < daChiedere.length; i += DIM) {
  const gruppo = daChiedere.slice(i, i + DIM);
  const lat = gruppo.map((g) => g.lat).join(',');
  const lon = gruppo.map((g) => g.lon).join(',');
  const url = `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const dati = await r.json();
    const quote = Array.isArray(dati.elevation) ? dati.elevation : [];
    gruppo.forEach((g, j) => {
      if (typeof quote[j] === 'number') {
        dettagli[g.nome].altitudine = Math.round(quote[j]);
        ottenute += 1;
      } else {
        dettagli[g.nome].altitudine = null;
      }
    });
    console.log(`  gruppo ${i / DIM + 1}: ${quote.length} quote`);
  } catch (err) {
    console.error(`  gruppo ${i / DIM + 1} fallito: ${err.message}`);
    gruppo.forEach((g) => {
      dettagli[g.nome].altitudine = null;
    });
  }
  // Rispetto del servizio pubblico.
  await new Promise((r) => setTimeout(r, 400));
}
console.log(`Altitudini ottenute: ${ottenute} su ${comuni.length}`);

// ---------------------------------------------------------------------------
const payload = {
  _fonte:
    'Popolazione e CAP: elenco dei comuni italiani derivato dai dati ISTAT (CC BY 3.0 IT). ' +
    'Altitudine: Open-Meteo Elevation API, dati Copernicus DEM. ' +
    'Generato da scripts/fetch-comuni-dettagli.mjs',
  _aggiornato: new Date().toISOString().slice(0, 10),
  comuni: dettagli,
};

fs.writeFileSync(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`\nScritto ${path.relative(ROOT, OUTPUT)} (${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB)`);

const conPop = Object.values(dettagli).filter((d) => d.popolazione).length;
const conAlt = Object.values(dettagli).filter((d) => d.altitudine !== null && d.altitudine !== undefined).length;
console.log(`  con popolazione: ${conPop}`);
console.log(`  con altitudine:  ${conAlt}`);
