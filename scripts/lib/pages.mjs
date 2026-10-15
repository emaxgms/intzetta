/**
 * Funzioni condivise fra i generatori di pagine.
 *
 * Serve a una cosa precisa: la pagina dei comuni, le pagine di provincia e la sitemap devono usare
 * ESATTAMENTE lo stesso indirizzo per ogni comune. Se divergessero, i collegamenti interni
 * punterebbero a pagine inesistenti e i motori di ricerca troverebbero 404.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const CITIES = path.join(ROOT, 'src', 'data', 'sardinian-cities-corrected.json');
const PROVINCES = path.join(ROOT, 'src', 'data', 'comuni-provinces.json');
const DETTAGLI = path.join(ROOT, 'src', 'data', 'comuni-dettagli.json');

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Nome sardo (o catalano/tabarchino) e nome italiano. */
export function splitName(fullName) {
  const parts = String(fullName).split('/').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 1) return { display: parts[0], alt: null };
  return { display: parts[0], alt: parts.slice(1).join(' / ') };
}

/** Distanza in chilometri fra due coppie di coordinate (formula dell'emisenoverso). */
export function distanzaKm(a, b) {
  const R = 6371;
  const toRad = (g) => (g * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Tutti i comuni con i dati necessari alle pagine. */
export function loadComuni() {
  const cities = JSON.parse(fs.readFileSync(CITIES, 'utf8'));
  const province = JSON.parse(fs.readFileSync(PROVINCES, 'utf8')).comuni;
  const dettagli = JSON.parse(fs.readFileSync(DETTAGLI, 'utf8')).comuni;

  return cities.map((c) => {
    const { display, alt } = splitName(c.name);
    const d = dettagli[c.name] || {};
    return {
      raw: c.name,
      display,
      alt,
      slug: slugify(display),
      coordinates: c.coordinates,
      sigla: province[c.name]?.sigla || d.sigla || null,
      provincia: province[c.name]?.provincia || d.provincia || null,
      popolazione: d.popolazione ?? null,
      altitudine: d.altitudine ?? null,
      cap: Array.isArray(d.cap) ? d.cap : [],
      codiceIstat: d.codiceIstat || null,
    };
  });
}

/** Indirizzo pubblico della pagina di un comune. */
export function comunePageUrl(slug) {
  return `/comuni/${slug}.html`;
}

// ---------------------------------------------------------------------------
// Sponsor locali
// ---------------------------------------------------------------------------
// Lo stesso sponsor che appare nel gioco deve apparire anche nelle pagine statiche: sono la
// maggior parte delle visite che arrivano dai motori di ricerca, quindi sono anche il posto dove
// lo sponsor viene visto di piu'. La scelta del giorno e' la stessa funzione usata dal gioco,
// riscritta qui perche' i generatori girano in Node, senza browser.

const SPONSOR = path.join(ROOT, 'src', 'data', 'sponsor.json');

function oggiKey() {
  return new Date().toISOString().slice(0, 10);
}

export function sponsorDelGiorno(dataKey = oggiKey()) {
  if (!fs.existsSync(SPONSOR)) return null;
  let dati;
  try {
    dati = JSON.parse(fs.readFileSync(SPONSOR, 'utf8'));
  } catch (err) {
    return null;
  }
  const attivi = (Array.isArray(dati.sponsor) ? dati.sponsor : []).filter((s) => {
    if (!s.attivo) return false;
    if (s.dal && dataKey < s.dal) return false;
    if (s.al && dataKey > s.al) return false;
    return true;
  });
  if (attivi.length === 0) return null;
  const giorni = Math.floor(Date.parse(`${dataKey}T00:00:00Z`) / 86400000);
  return attivi[giorni % attivi.length];
}

/** Riquadro dello sponsor in HTML, per le pagine statiche. Stringa vuota se non c'e' nessuno. */
export function sponsorHtml() {
  const s = sponsorDelGiorno();
  if (!s) return '';
  const interno = `      <span class="sponsor-etichetta">Sponsor locale</span>
      <strong class="sponsor-nome">${escapeHtml(s.nome)}</strong>
      <span class="sponsor-testo">${escapeHtml(s.testo)}</span>
      ${s.localita ? `<span class="sponsor-luogo">${escapeHtml(s.localita)}</span>` : ''}`;
  const corpo = s.url
    ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer nofollow">
${interno}
    </a>`
    : `<div>
${interno}
    </div>`;
  return `<div class="sponsor-box">
    ${corpo}
  </div>`;
}

export const SPONSOR_STILE = `
.sponsor-box{width:100%;max-width:520px;margin:22px auto 0;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:14px;padding:14px 16px;text-align:center}
.sponsor-box a,.sponsor-box div{display:flex;flex-direction:column;gap:4px;text-decoration:none;color:inherit}
.sponsor-etichetta{font-size:.68rem;text-transform:uppercase;letter-spacing:2px;opacity:.7}
.sponsor-nome{font-size:1.1rem;letter-spacing:.5px}
.sponsor-testo{font-size:.92rem;opacity:.92;line-height:1.4}
.sponsor-luogo{font-size:.78rem;opacity:.7}
`;
