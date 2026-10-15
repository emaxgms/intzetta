/**
 * Genera una pagina di contenuto per OGNI comune della Sardegna (377).
 *
 * PERCHE' CONTENUTO VERO E NON UN MODELLO RIPETUTO
 * ------------------------------------------------
 * Le norme di AdSense non ammettono pubblicita' su pagine senza contenuto, e 377 pagine identiche
 * verrebbero lette come contenuto duplicato. Qui ogni pagina contiene dati REALI e diversi:
 * abitanti, altitudine, CAP, distanza dal capoluogo e da Cagliari, posizione in classifica fra i
 * 377 comuni, e i cinque comuni piu' vicini con i relativi collegamenti.
 *
 * I dati vengono da fonti aperte (ISTAT per popolazione e CAP, Copernicus DEM per l'altitudine),
 * non inventati. Dove un dato manca, la frase che lo userebbe semplicemente non viene scritta:
 * meglio una pagina piu' corta che una pagina falsa.
 *
 * Uso: node scripts/generate-comune-pages.mjs     (automatico prima di `npm run build`)
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT,
  escapeHtml,
  loadComuni,
  comunePageUrl,
  distanzaKm,
  sponsorHtml,
  SPONSOR_STILE,
} from './lib/pages.mjs';

const PUBLIC = path.join(ROOT, 'public');
const USCITA = path.join(PUBLIC, 'comuni');

const SITE = 'https://intzetta.top';

const PROVINCE = {
  CA: { nome: 'Città metropolitana di Cagliari', breve: 'Cagliari', slug: 'cagliari', capoluogo: 'Cagliari' },
  NU: { nome: 'Provincia di Nuoro', breve: 'Nuoro', slug: 'nuoro', capoluogo: 'Nuoro' },
  OR: { nome: 'Provincia di Oristano', breve: 'Oristano', slug: 'oristano', capoluogo: 'Oristano' },
  SS: { nome: 'Provincia di Sassari', breve: 'Sassari', slug: 'sassari', capoluogo: 'Sassari' },
  SU: { nome: 'Provincia del Sud Sardegna', breve: 'Sud Sardegna', slug: 'sud-sardegna', capoluogo: 'Carbonia' },
};

const comuni = loadComuni();

// Indice per nome, per calcolare le distanze dal capoluogo.
const perNome = new Map(comuni.map((c) => [c.display, c]));
const perSigla = new Map(comuni.map((c) => [c.raw, c]));

/** Classifiche: servono a dire "e' il 45esimo comune piu' popoloso", che e' un fatto vero. */
function classifica(valore, lista, decrescente = true) {
  const ordinati = [...lista]
    .filter((c) => c.valore !== null && c.valore !== undefined)
    .sort((a, b) => (decrescente ? b.valore - a.valore : a.valore - b.valore));
  const posizione = ordinati.findIndex((c) => c.nome === valore.nome);
  return posizione === -1 ? null : { posizione: posizione + 1, totale: ordinati.length };
}

const perPopolazione = comuni.map((c) => ({ nome: c.display, valore: c.popolazione }));
const perAltitudine = comuni.map((c) => ({ nome: c.display, valore: c.altitudine }));

/** Zona dell'isola e posizione, dedotte dalle coordinate reali. */
function fraseZona(c) {
  const lat = c.coordinates[0];
  const zona = lat >= 40.4 ? 'nel nord' : lat >= 39.7 ? 'nel centro' : 'nel sud';
  const lon = c.coordinates[1];
  const lato = lon >= 9.1 ? 'sul versante orientale' : lon <= 8.5 ? 'sul versante occidentale' : 'al centro';
  return `Si trova ${zona} dell'isola, ${lato}.`;
}

/** I cinque comuni piu' vicini: e' informazione utile e diversa per ognuno. */
function vicini(comune, quanti = 8) {
  return comuni
    .filter((c) => c.display !== comune.display)
    .map((c) => ({ c, km: distanzaKm(comune.coordinates, c.coordinates) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, quanti);
}

function formatNumero(n) {
  return Number(n).toLocaleString('it-IT');
}

/** Frase sull'ubicazione, costruita dai dati veri. */
function fraseUbicazione(c) {
  const info = c.sigla ? PROVINCE[c.sigla] : null;
  const pezzi = [];
  if (info) pezzi.push(`nella ${info.nome}`);
  else if (c.provincia) pezzi.push(`in provincia di ${c.provincia}`);
  if (c.altitudine !== null) pezzi.push(`a ${formatNumero(c.altitudine)} metri sul livello del mare`);
  return pezzi.length ? `Si trova ${pezzi.join(', ')}.` : '';
}

/**
 * Distanze. Sono in linea d'aria e va detto: la strada per arrivarci e' spesso molto piu' lunga,
 * e presentarle come distanze stradali sarebbe un'informazione sbagliata.
 */
function fraseDistanze(c) {
  const info = c.sigla ? PROVINCE[c.sigla] : null;
  const parti = [];
  if (info) {
    const cap = comuni.find((x) => x.display === info.capoluogo || x.alt === info.capoluogo);
    if (cap && cap.display !== c.display) {
      const km = distanzaKm(c.coordinates, cap.coordinates);
      parti.push(`${km < 10 ? km.toFixed(1) : Math.round(km)} km da ${info.capoluogo}`);
    }
  }
  const cagliari = comuni.find((x) => x.alt === 'Cagliari' || x.display === 'Casteddu');
  if (cagliari && cagliari.display !== c.display) {
    const km = distanzaKm(c.coordinates, cagliari.coordinates);
    parti.push(`${Math.round(km)} km da Cagliari`);
  }
  if (parti.length === 0) return '';
  return `In linea d'aria dista ${parti.join(' e ')}.`;
}

/** Posizione del comune dentro la propria provincia: un dato diverso da quello regionale. */
function fraseProvincia(c) {
  const info = c.sigla ? PROVINCE[c.sigla] : null;
  if (!info) return '';
  const dellaProvincia = comuni.filter((x) => x.sigla === c.sigla);
  const perPop = dellaProvincia
    .filter((x) => x.popolazione)
    .sort((a, b) => b.popolazione - a.popolazione);
  const pos = perPop.findIndex((x) => x.display === c.display);
  if (pos === -1) return '';
  const totale = perPop.length;
  if (pos === 0) return `È il comune più popoloso della ${info.nome}.`;
  if (pos < 5) return `È il ${pos + 1}° comune della ${info.nome} per abitanti, su ${totale}.`;
  if (pos >= totale - 4) return `È fra i comuni più piccoli della ${info.nome} (${pos + 1}° su ${totale}).`;
  return '';
}

/**
 * Il nome, e in che lingua e' scritto il secondo nome.
 * La distinzione non e' un dettaglio: ad Alghero si parla catalano algherese e a Carloforte e
 * Calasetta il tabarchino, che sono lingue diverse dal sardo.
 */
function sezioneNome(c) {
  if (!c.alt) return null;
  const algherese = ['l\'Alguer', 'Alguer'].includes(c.display);
  const tabarchino = ['U Pàize', 'Câdesédda'].includes(c.display);
  const lingua = algherese
    ? 'il catalano algherese'
    : tabarchino
      ? 'il tabarchino, la lingua dei pescatori liguri che popolarono queste isole nel Settecento'
      : 'il sardo';
  return {
    titolo: 'Il nome',
    testo: `<p>Il nome ufficiale è doppio: <strong>${escapeHtml(c.display)}</strong> in ${lingua} e
    <strong>${escapeHtml(c.alt)}</strong> in italiano. In Sardegna ${comuni.filter((x) => x.alt).length} comuni
    su ${comuni.length} hanno un nome ufficiale in una lingua diversa dall'italiano, e questo è uno di quelli.</p>`,
  };
}

function frasePopolazione(c) {
  if (!c.popolazione) return '';
  const r = classifica({ nome: c.display }, perPopolazione);
  const posizione =
    r && r.posizione <= 20
      ? ` È il ${r.posizione}° comune della Sardegna per abitanti.`
      : r && r.posizione >= r.totale - 20
        ? ` Con ${formatNumero(c.popolazione)} abitanti è fra i più piccoli dell'isola (${r.posizione}° su ${r.totale}).`
        : ` È il ${r.posizione}° comune sardo per popolazione su ${r.totale}.`;
  return `Conta ${formatNumero(c.popolazione)} abitanti.${posizione}`;
}

function fraseAltitudine(c) {
  if (c.altitudine === null) return '';
  const r = classifica({ nome: c.display }, perAltitudine);
  if (r && r.posizione === 1) return ` È il comune più alto della Sardegna.`;
  if (r && r.posizione <= 10) return ` È fra i dieci comuni più alti dell'isola (${r.posizione}°).`;
  if (r && r.posizione >= r.totale - 5) return ` È uno dei comuni più bassi dell'isola.`;
  return '';
}

function fraseNome(c) {
  if (!c.alt) return '';
  const nomeSardo = c.display;
  const italiano = c.alt;
  return ` Il suo nome ufficiale in sardo è <strong>${escapeHtml(nomeSardo)}</strong>, mentre in italiano è ${escapeHtml(italiano)}.`;
}

const STILE = `
:root{--primary:#8A7240;--primary-dark:#5C4B2A;--secondary:#4A6B3D;--surface:#FFFDF8;--ink:#2B2B2B;}
*{box-sizing:border-box}
body{margin:0;background:var(--primary);color:#fff;font-family:"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.65}
.wrap{max-width:820px;margin:0 auto;padding:20px 16px 56px}
header.top{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:8px 0 18px}
header.top a.brand{color:#fff;font-weight:700;letter-spacing:2px;text-decoration:none;font-size:1.1rem}
a{color:#fff}
h1{font-size:clamp(1.5rem,4.5vw,2.2rem);line-height:1.15;margin:0 0 6px}
h2{font-size:clamp(1.1rem,3vw,1.4rem);margin:30px 0 10px;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:5px}
p{margin:0 0 13px}
.sottotitolo{opacity:.9;margin-bottom:16px}
.facts{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:16px 0;padding:0;list-style:none}
.facts li{background:rgba(0,0,0,.22);border-radius:10px;padding:10px 12px;margin:0}
.facts b{display:block;font-size:1.25rem;line-height:1.15}
.facts span{font-size:.78rem;text-transform:uppercase;letter-spacing:1px;opacity:.8}
.card{background:var(--surface);color:var(--ink);border-radius:14px;padding:16px 18px;box-shadow:0 4px 14px rgba(0,0,0,.18);margin:18px 0}
.card a{color:var(--primary-dark)}
.cta{display:inline-block;background:var(--secondary);color:#fff;text-decoration:none;font-weight:700;padding:13px 24px;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.25);margin:4px 0}
ul.vicini{list-style:none;padding:0;margin:0}
ul.vicini li{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid rgba(0,0,0,.08)}
ul.vicini li:last-child{border-bottom:none}
ul.vicini .km{opacity:.65;font-variant-numeric:tabular-nums;white-space:nowrap}
.briciole{font-size:.85rem;opacity:.85;margin-bottom:10px}
.briciole a{text-decoration:none}
footer{margin-top:38px;padding-top:16px;border-top:1px solid rgba(255,255,255,.25);font-size:.88rem;opacity:.9}
@media(min-width:620px){.facts{grid-template-columns:repeat(4,1fr)}}
${SPONSOR_STILE}
`;

const SPONSOR_BOX = sponsorHtml();

function trackerTag(env) {
  const provider = (env.VITE_ANALYTICS_PROVIDER || '').trim().toLowerCase();
  const src = (env.VITE_ANALYTICS_SCRIPT_URL || '').trim();
  const id = (env.VITE_ANALYTICS_SITE_ID || '').trim();
  const domain = (env.VITE_ANALYTICS_DOMAIN || '').trim();
  if (!['umami', 'plausible'].includes(provider) || !src || !id) return '';
  const parti = ['defer', `src="${escapeHtml(src)}"`, `data-website-id="${escapeHtml(id)}"`];
  if (domain) {
    parti.push(provider === 'umami' ? `data-domains="${escapeHtml(domain)}"` : `data-domain="${escapeHtml(domain)}"`);
  }
  if (provider === 'umami') parti.push('data-do-not-track="true"', 'data-performance="true"');
  return `<script ${parti.join(' ')}></script>`;
}

function loadEnv() {
  const env = { ...process.env };
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const TRACKER = trackerTag(loadEnv());

// ---------------------------------------------------------------------------
fs.rmSync(USCITA, { recursive: true, force: true });
fs.mkdirSync(USCITA, { recursive: true });

let scritti = 0;
const senzaDati = [];

for (const c of comuni) {
  const info = c.sigla ? PROVINCE[c.sigla] : null;
  const viciniVicini = vicini(c);

  const paragrafi = [
    `${escapeHtml(c.display)} è un comune della Sardegna. ${fraseUbicazione(c)} ${fraseZona(c)} ${fraseDistanze(c)}`.trim(),
    `${frasePopolazione(c)} ${fraseProvincia(c)}${fraseAltitudine(c)}`.trim(),
  ].filter((p) => p.length > 0);

  const bloccoNome = sezioneNome(c);

  if (paragrafi.length < 2) senzaDati.push(c.display);

  const fatti = [];
  if (c.popolazione) fatti.push(`<li><b>${formatNumero(c.popolazione)}</b><span>abitanti</span></li>`);
  if (c.altitudine !== null) fatti.push(`<li><b>${formatNumero(c.altitudine)} m</b><span>altitudine</span></li>`);
  if (c.cap.length) fatti.push(`<li><b>${escapeHtml(c.cap[0])}</b><span>CAP</span></li>`);
  if (c.codiceIstat) fatti.push(`<li><b>${escapeHtml(c.codiceIstat)}</b><span>codice ISTAT</span></li>`);

  const titolo = c.alt
    ? `${c.display} (${c.alt}) — comune in ${info ? info.nome : 'Sardegna'}`
    : `${c.display} — comune in ${info ? info.nome : 'Sardegna'}`;

  const descrizione = `${c.display}${c.alt ? ` (${c.alt})` : ''}: ${
    c.popolazione ? `${formatNumero(c.popolazione)} abitanti, ` : ''
  }${c.altitudine !== null ? `${c.altitudine} metri di altitudine, ` : ''}${
    info ? info.nome : 'Sardegna'
  }. Dove si trova, i comuni vicini e il gioco per trovarlo sulla mappa.`;

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(titolo)} | Intzetta</title>
<meta name="description" content="${escapeHtml(descrizione)}">
<link rel="canonical" href="${SITE}${comunePageUrl(c.slug)}">
<meta name="theme-color" content="#8A7240">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Intzetta">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${escapeHtml(titolo)}">
<meta property="og:description" content="${escapeHtml(descrizione)}">
<meta property="og:url" content="${SITE}${comunePageUrl(c.slug)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<style>${STILE}</style>
${TRACKER ? `${TRACKER}\n` : ''}</head>
<body>
<div class="wrap">
<header class="top">
  <a class="brand" href="/">INTZETTA</a>
  <a class="cta" href="/">Gioca alla sfida del giorno</a>
</header>

<p class="briciole">
  <a href="/comuni-sardegna.html">Comuni della Sardegna</a> ›
  ${info ? `<a href="/comuni-${info.slug}.html">${escapeHtml(info.breve)}</a> ›` : ''}
  ${escapeHtml(c.display)}
</p>

<h1>${escapeHtml(c.display)}</h1>
<p class="sottotitolo">${c.alt ? `Nome ufficiale in italiano: ${escapeHtml(c.alt)}. ` : ''}${
    info ? `Comune della ${escapeHtml(info.nome)}.` : 'Comune della Sardegna.'
  }</p>

<ul class="facts">
${fatti.map((f) => `  ${f}`).join('\n')}
</ul>

${paragrafi.map((p) => `<p>${p}</p>`).join('\n')}

${
  bloccoNome
    ? `<h2>${bloccoNome.titolo}</h2>
${bloccoNome.testo}`
    : ''
}

${
  viciniVicini.length
    ? `<h2>I comuni più vicini</h2>
<div class="card">
  <ul class="vicini">
${viciniVicini
  .map(
    (v) =>
      `    <li><a href="${comunePageUrl(v.c.slug)}">${escapeHtml(v.c.display)}</a><span class="km">${v.km.toFixed(1)} km</span></li>`
  )
  .join('\n')}
  </ul>
  <p style="margin:12px 0 0;font-size:.9rem;opacity:.75">Le distanze sono in linea d'aria.</p>
</div>`
    : ''
}

<h2>Lo sai trovare sulla mappa?</h2>
<p>Conoscere il nome non basta: in <strong>Intzetta</strong> esce il nome di un comune e devi
cliccarlo sulla mappa, e il punteggio dipende da quanto sei vicino. Se ti capita
<strong>${escapeHtml(c.display)}</strong>, sapresti dove mettere il segno?</p>
<p><a class="cta" href="/">Gioca la sfida di oggi</a></p>

${SPONSOR_BOX}

<footer>
  <p><strong>Intzetta</strong> — il gioco dei paesi della Sardegna.
  <a href="/comuni-sardegna.html">Tutti i ${comuni.length} comuni</a> ·
  <a href="/stagione-alpha.html">Stagione Alpha</a> ·
  <a href="/sponsor.html">Pubblica la tua attività</a></p>
  <p><a href="/privacy-policy.html">Privacy Policy</a> ·
  <a href="/cookie-policy.html">Cookie Policy</a> ·
  <a href="/termini-acquisti.html">Termini di acquisto</a> ·
  <a href="/terms-of-service.html">Termini di Servizio</a></p>
  <p style="opacity:.7;font-size:.82rem">Dati: popolazione e CAP da elenco ISTAT (CC BY 3.0 IT);
  altitudine da Copernicus DEM tramite Open-Meteo.</p>
</footer>
</div>
</body>
</html>
`;

  fs.writeFileSync(path.join(USCITA, `${c.slug}.html`), html, 'utf8');
  scritti += 1;
}

console.log(`Pagine dei comuni generate: ${scritti} in public/comuni/`);
if (senzaDati.length) {
  console.log(`  ATTENZIONE: ${senzaDati.length} comuni hanno pochi dati: ${senzaDati.join(', ')}`);
}
const conPop = comuni.filter((c) => c.popolazione).length;
const conAlt = comuni.filter((c) => c.altitudine !== null).length;
console.log(`  con abitanti: ${conPop}   con altitudine: ${conAlt}`);
