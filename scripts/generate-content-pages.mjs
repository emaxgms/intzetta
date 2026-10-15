/**
 * Genera le pagine di contenuto indicizzabili dai motori di ricerca.
 *
 * Perche' esiste: Intzetta e' una singola pagina senza testo. Un motore di ricerca non ha nulla da
 * leggere e nulla da posizionare, quindi il gioco non viene trovato da chi cerca i comuni della
 * Sardegna. Queste pagine intercettano una domanda che esiste gia' ("quanti sono i comuni della
 * Sardegna? quali sono? quali sono quelli della provincia di Sassari?") e da li' portano al gioco.
 *
 * Le pagine sono HTML statici, senza JavaScript e senza richieste esterne: si aprono subito e
 * vengono lette dai motori di ricerca esattamente come sono scritte.
 *
 * I dati sulle province NON sono indovinati: vengono da src/data/comuni-provinces.json, generato
 * a sua volta da scripts/fetch-comuni-provinces.mjs sull'elenco ufficiale derivato dai dati ISTAT.
 *
 * Uso:  node scripts/generate-content-pages.mjs        (automatico prima di `npm run build`)
 * Scrive in public/: la cartella viene poi copiata in dist/ dalla compilazione.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sponsorHtml, SPONSOR_STILE } from './lib/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'src', 'data', 'sardinian-cities-corrected.json');
const PROVINCES = path.join(ROOT, 'src', 'data', 'comuni-provinces.json');
const ALPHA_DATA = path.join(ROOT, 'src', 'data', 'stagione-alpha.json');
const PUBLIC = path.join(ROOT, 'public');

const SITE = 'https://intzetta.top';
const TODAY = new Date().toISOString().slice(0, 10);

const comuni = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const provincesRaw = JSON.parse(fs.readFileSync(PROVINCES, 'utf8')).comuni;
const alpha = fs.existsSync(ALPHA_DATA) ? JSON.parse(fs.readFileSync(ALPHA_DATA, 'utf8')) : null;

const PROVINCE_NAMES = {
  CA: { nome: 'Città metropolitana di Cagliari', breve: 'Cagliari', slug: 'cagliari' },
  NU: { nome: 'Provincia di Nuoro', breve: 'Nuoro', slug: 'nuoro' },
  OR: { nome: 'Provincia di Oristano', breve: 'Oristano', slug: 'oristano' },
  SS: { nome: 'Provincia di Sassari', breve: 'Sassari', slug: 'sassari' },
  SU: { nome: 'Provincia del Sud Sardegna', breve: 'Sud Sardegna', slug: 'sud-sardegna' },
};

const LETTER_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** Nome sardo e nome italiano, quando il comune ne ha due. */
function splitName(fullName) {
  const parts = fullName.split('/').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 1) return { display: parts[0], alt: null };
  return { display: parts[0], alt: parts.slice(1).join(' / ') };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slug(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Configurazione di misurazione, letta da .env.local (o dalle variabili d'ambiente).
 *
 * Le pagine di contenuto sono HTML statici e non caricano l'applicazione: senza questo tag le
 * visite che arrivano dai motori di ricerca non verrebbero contate da nessuno, e non si saprebbe
 * mai se le pagine dei comuni funzionano. Il tag viene aggiunto solo se la misurazione e'
 * configurata: senza configurazione le pagine restano senza richieste esterne.
 */
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

function trackerTag(env, escape) {
  const provider = (env.VITE_ANALYTICS_PROVIDER || '').trim().toLowerCase();
  const src = (env.VITE_ANALYTICS_SCRIPT_URL || '').trim();
  const id = (env.VITE_ANALYTICS_SITE_ID || '').trim();
  const domain = (env.VITE_ANALYTICS_DOMAIN || '').trim();

  if (!['umami', 'plausible'].includes(provider) || !src || !id) return '';

  const parts = ['defer', `src="${escape(src)}"`, `data-website-id="${escape(id)}"`];
  if (domain) {
    // L'attributo ha un nome diverso nei due strumenti.
    parts.push(provider === 'umami' ? `data-domains="${escape(domain)}"` : `data-domain="${escape(domain)}"`);
  }
  if (provider === 'umami') {
    parts.push('data-do-not-track="true"', 'data-performance="true"');
  }
  return `<script ${parts.join(' ')}></script>`;
}

const ENV = loadEnv();
const TRACKER = trackerTag(ENV, escapeHtml);

// ---------------------------------------------------------------------------
// Dati di lavoro
// ---------------------------------------------------------------------------
const entries = comuni
  .map((c) => {
    const { display, alt } = splitName(c.name);
    const letter = display[0].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const sigla = provincesRaw[c.name]?.sigla || null;
    return { display, alt, letter, slug: slug(display), raw: c.name, sigla };
  })
  .sort((a, b) => a.display.localeCompare(b.display, 'it'));

const bilingual = entries.filter((e) => e.alt);
const senzaProvincia = entries.filter((e) => !e.sigla);

const byLetter = LETTER_ORDER.map((letter) => ({
  letter,
  items: entries.filter((e) => e.letter === letter),
})).filter((group) => group.items.length > 0);

/**
 * Rete di sicurezza. Un nome che inizia con un carattere inatteso (un apostrofo, un numero)
 * finirebbe fuori da ogni gruppo e sparirebbe dalla pagina in silenzio: e' successo davvero,
 * con un comune scritto "'Onne" invece di "Onne".
 */
const ungrouped = entries.filter((e) => !LETTER_ORDER.includes(e.letter));
if (ungrouped.length > 0) {
  byLetter.push({ letter: 'Altri', items: ungrouped });
  console.warn(
    `ATTENZIONE: ${ungrouped.length} comuni hanno un'iniziale inattesa e finiscono nel gruppo "Altri": ` +
      ungrouped.map((e) => `"${e.raw}"`).join(', ')
  );
}
const lettersUsed = byLetter.filter((g) => LETTER_ORDER.includes(g.letter)).length;

const grouped = byLetter.reduce((sum, g) => sum + g.items.length, 0);
if (grouped !== entries.length) {
  throw new Error(
    `Elenco incompleto: ${grouped} comuni raggruppati su ${entries.length}. Compilazione interrotta.`
  );
}
if (senzaProvincia.length > 0) {
  console.warn(
    `ATTENZIONE: ${senzaProvincia.length} comuni non hanno la provincia e non compariranno nelle pagine per provincia: ` +
      senzaProvincia.map((e) => `"${e.raw}"`).join(', ')
  );
}

const provinceGroups = Object.entries(PROVINCE_NAMES)
  .map(([sigla, meta]) => ({
    sigla,
    ...meta,
    items: entries.filter((e) => e.sigla === sigla),
  }))
  .filter((p) => p.items.length > 0)
  .sort((a, b) => b.items.length - a.items.length);

// ---------------------------------------------------------------------------
// Foglio di stile condiviso
// ---------------------------------------------------------------------------
const STYLE = `
:root{--primary:#8A7240;--primary-dark:#5C4B2A;--secondary:#4A6B3D;--surface:#FFFDF8;--ink:#2B2B2B;}
*{box-sizing:border-box}
body{margin:0;background:var(--primary);color:#fff;font-family:"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6}
.wrap{max-width:900px;margin:0 auto;padding:24px 18px 64px}
header.top{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:8px 0 20px}
header.top a.brand{color:#fff;font-weight:700;letter-spacing:2px;text-decoration:none;font-size:1.15rem}
a{color:#fff}
h1{font-size:clamp(1.6rem,4vw,2.4rem);line-height:1.2;margin:0 0 12px}
h2{font-size:clamp(1.2rem,3vw,1.6rem);margin:36px 0 12px;border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:6px}
h3{font-size:1.05rem;margin:22px 0 8px;letter-spacing:1px}
p{margin:0 0 14px}
.card{background:var(--surface);color:var(--ink);border-radius:14px;padding:18px 20px;box-shadow:0 4px 14px rgba(0,0,0,.18)}
.card a{color:var(--primary-dark)}
.cta{display:inline-block;background:var(--secondary);color:#fff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.25);margin:6px 0 4px}
.cta:hover{background:#2A4B1D}
.facts{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0 6px;padding:0;list-style:none}
.facts li{background:rgba(0,0,0,.22);border-radius:10px;padding:10px 14px;margin:0}
.facts b{display:block;font-size:1.5rem;line-height:1.1}
.index{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0;padding:0;list-style:none}
.index a{background:rgba(0,0,0,.22);border-radius:8px;padding:6px 12px;text-decoration:none;font-weight:700}
.index a:hover{background:rgba(0,0,0,.4)}
ul.comuni{list-style:none;padding:0;margin:0;columns:2;column-gap:26px}
ul.comuni li{break-inside:avoid;padding:3px 0;font-size:.98rem}
ul.comuni .alt{opacity:.6;font-size:.86rem}
.province{display:flex;flex-wrap:wrap;gap:12px;padding:0;margin:14px 0 0;list-style:none}
.province li{margin:0}
.province a{display:block;background:rgba(0,0,0,.22);border-radius:12px;padding:12px 16px;text-decoration:none;min-width:190px}
.province a:hover{background:rgba(0,0,0,.4)}
.province b{display:block;font-size:1.35rem;line-height:1.2}
.province span{font-size:.9rem;opacity:.85}
table.alpha{width:100%;border-collapse:collapse;color:var(--ink)}
table.alpha th{text-align:left;font-size:.8rem;text-transform:uppercase;letter-spacing:1px;opacity:.6;padding:6px 8px;border-bottom:1px solid rgba(0,0,0,.15)}
table.alpha td{padding:9px 8px;border-bottom:1px solid rgba(0,0,0,.07)}
table.alpha .pos{width:40px;font-weight:700;opacity:.7}
table.alpha .punti{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
table.alpha tbody tr:nth-child(1) .pos{color:#b8860b}
table.alpha tbody tr:nth-child(2) .pos{color:#8a8a8a}
table.alpha tbody tr:nth-child(3) .pos{color:#a9713b}
footer{margin-top:44px;padding-top:18px;border-top:1px solid rgba(255,255,255,.25);font-size:.9rem;opacity:.9}
@media (max-width:620px){ul.comuni{columns:1}}
${SPONSOR_STILE}
`;

/** Riquadro dello sponsor, uguale in tutte le pagine statiche. Vuoto se non c'e' nessuno sponsor. */
const SPONSOR_BOX = sponsorHtml();

function pageShell({ title, description, canonical, body }) {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#8A7240">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Intzetta">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<style>${STYLE}</style>
${TRACKER ? `${TRACKER}\n` : ''}</head>
<body>
<div class="wrap">
<header class="top">
  <a class="brand" href="/">INTZETTA</a>
  <a class="cta" href="/">Gioca alla sfida del giorno</a>
</header>
${body}
${SPONSOR_BOX}
<footer>
  <p><strong>Intzetta</strong> — il gioco dei paesi della Sardegna: esce il nome di un comune e devi
  trovarlo sulla mappa. <a href="/">Gioca gratis</a>.</p>
  <p><a href="/comuni-sardegna.html">Tutti i comuni della Sardegna</a> ·
  <a href="/stagione-alpha.html">Stagione Alpha</a> ·
  <a href="/sponsor.html">Pubblica la tua attività</a></p>
  <p><a href="/privacy-policy.html">Privacy Policy</a> ·
  <a href="/cookie-policy.html">Cookie Policy</a> ·
  <a href="/termini-acquisti.html">Termini di acquisto</a> ·
  <a href="/terms-of-service.html">Termini di Servizio</a></p>
</footer>
</div>
</body>
</html>
`;
}

function comuniList(items) {
  return `<ul class="comuni">
${items
  .map(
    (e) =>
      `    <li id="${e.slug}"><a href="/comuni/${e.slug}.html">${escapeHtml(e.display)}</a>${
        e.alt ? ` <span class="alt">(${escapeHtml(e.alt)})</span>` : ''
      }</li>`
  )
  .join('\n')}
  </ul>`;
}

const written = [];

// ---------------------------------------------------------------------------
// Pagina principale: i comuni della Sardegna
// ---------------------------------------------------------------------------
const listBody = byLetter
  .map(
    (group) => `  <h3 id="lettera-${group.letter}">${group.letter} <span class="alt">(${group.items.length})</span></h3>
  ${comuniList(group.items)}`
  )
  .join('\n');

const mainItemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Comuni della Sardegna',
  numberOfItems: entries.length,
  itemListOrder: 'https://schema.org/ItemListOrderAscending',
  itemListElement: entries.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.raw })),
};

const comuniPage = pageShell({
  title: `I ${entries.length} comuni della Sardegna: elenco completo in ordine alfabetico`,
  description: `Elenco completo dei ${entries.length} comuni della Sardegna in ordine alfabetico e per provincia, con i nomi ufficiali in sardo e in italiano. Quanti ne sai trovare sulla mappa? Gioca alla sfida del giorno.`,
  canonical: `${SITE}/comuni-sardegna.html`,
  body: `  <h1>I ${entries.length} comuni della Sardegna</h1>
  <p>La Sardegna conta <strong>${entries.length} comuni</strong>. Questo è l'elenco completo, in ordine
  alfabetico. Di questi, <strong>${bilingual.length}</strong> hanno anche un nome ufficiale in sardo,
  in catalano di Alghero o in tabarchino di Carloforte e Calasetta: dove esiste, lo trovi accanto al
  nome italiano.</p>

  <ul class="facts">
    <li><b>${entries.length}</b>comuni</li>
    <li><b>${provinceGroups.length}</b>province</li>
    <li><b>${bilingual.length}</b>con un secondo nome ufficiale</li>
    <li><b>${lettersUsed}</b>lettere rappresentate</li>
  </ul>

  <p><a class="cta" href="/">Quanti ne sai trovare sulla mappa?</a></p>

  <h2>I comuni per provincia</h2>
  <ul class="province">
${provinceGroups
  .map(
    (p) =>
      `    <li><a href="/comuni-${p.slug}.html"><b>${p.items.length}</b>${escapeHtml(p.nome)}<span>Vedi l'elenco e gioca</span></a></li>`
  )
  .join('\n')}
  </ul>

  <div class="card" style="margin-top:18px">
    <h2 style="color:var(--primary-dark);border-color:rgba(0,0,0,.15);margin-top:0">Vai alla lettera</h2>
    <ul class="index">
${byLetter.map((g) => `      <li><a href="#lettera-${g.letter}">${g.letter}</a></li>`).join('\n')}
    </ul>
  </div>

  <h2>Elenco dei comuni, dalla A alla Z</h2>
${listBody}

  <h2>Quanto conosci davvero la Sardegna?</h2>
  <p>Conoscere i nomi è una cosa, sapere dove sono è un'altra. <strong>Intzetta</strong> ti mostra il
  nome di un comune sardo e tu devi cliccarlo sulla mappa: più sei vicino, più punti prendi. Otto
  round, fino a 40.000 punti.</p>
  <p>Ogni giorno c'è una <strong>sfida del giorno</strong>: gli stessi otto comuni per tutti, un solo
  tentativo, e un risultato da condividere. Oppure allenati quanto vuoi in modalità libera, anche
  scegliendo una sola provincia.</p>
  <p><a class="cta" href="/">Inizia a giocare</a></p>

  <script type="application/ld+json">
${JSON.stringify(mainItemList)}
  </script>`,
});

fs.writeFileSync(path.join(PUBLIC, 'comuni-sardegna.html'), comuniPage, 'utf8');
written.push({ file: 'comuni-sardegna.html', size: comuniPage.length, count: entries.length });

// ---------------------------------------------------------------------------
// Una pagina per provincia
// ---------------------------------------------------------------------------
for (const p of provinceGroups) {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Comuni della ${p.nome}`,
    numberOfItems: p.items.length,
    itemListElement: p.items.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.raw })),
  };

  const page = pageShell({
    title: `I ${p.items.length} comuni della ${p.nome}: elenco e quiz sulla mappa`,
    description: `Elenco dei ${p.items.length} comuni della ${p.nome} (${p.sigla}), con i nomi ufficiali in sardo. Gioca a trovarli sulla mappa: sfida del giorno e allenamento libero su questi comuni.`,
    canonical: `${SITE}/comuni-${p.slug}.html`,
    body: `  <h1>I ${p.items.length} comuni della ${escapeHtml(p.nome)}</h1>
  <p>La ${escapeHtml(p.nome)} comprende <strong>${p.items.length}</strong> comuni. Qui trovi l'elenco
  completo in ordine alfabetico${
    p.items.some((e) => e.alt) ? ', con il nome ufficiale in sardo dove esiste' : ''
  }.</p>

  <ul class="facts">
    <li><b>${p.items.length}</b>comuni</li>
    <li><b>${p.items.filter((e) => e.alt).length}</b>con un secondo nome ufficiale</li>
    <li><b>${p.sigla}</b>sigla</li>
  </ul>

  <p><a class="cta" href="/?provincia=${p.sigla}">Gioca con i comuni di questa provincia</a></p>

  <h2>Elenco dei comuni</h2>
${comuniList(p.items)}

  <h2>Quanto li conosci?</h2>
  <p>Conoscere i nomi è una cosa, sapere dove sono è un'altra. In <strong>Intzetta</strong> esce il
  nome di un comune e devi cliccarlo sulla mappa: più sei vicino, più punti prendi. Puoi giocare con
  <a href="/?provincia=${p.sigla}">i soli comuni della ${escapeHtml(p.breve)}</a>, oppure con
  <a href="/comuni-sardegna.html">tutti i ${entries.length} comuni della Sardegna</a>.</p>
  <p><a class="cta" href="/?provincia=${p.sigla}">Inizia a giocare</a></p>

  <script type="application/ld+json">
${JSON.stringify(itemList)}
  </script>`,
  });

  const filename = `comuni-${p.slug}.html`;
  fs.writeFileSync(path.join(PUBLIC, filename), page, 'utf8');
  written.push({ file: filename, size: page.length, count: p.items.length });
}

// ---------------------------------------------------------------------------
// Pagina: la Stagione Alpha (crediti ai primi giocatori)
// ---------------------------------------------------------------------------
// La classifica della versione iniziale e' stata azzerata per fare posto alle classifiche
// nuove (generale, giornaliera, per provincia). Questa pagina tiene il ricordo di chi c'era
// prima: un grazie pubblico ai primi che hanno giocato quando il gioco era ancora grezzo.
if (alpha && Array.isArray(alpha.classifica) && alpha.classifica.length > 0) {
  const righe = alpha.classifica
    .map(
      (r) => `      <tr>
        <td class="pos">${r.posizione}</td>
        <td>${escapeHtml(r.nome)}</td>
        <td class="punti">${Number(r.punteggio).toLocaleString('it-IT')}</td>
      </tr>`
    )
    .join('\n');

  const alphaPage = pageShell({
    title: 'Stagione Alpha — i primi giocatori di Intzetta',
    description: `I primi ${alpha.classifica.length} classificati della Stagione Alpha di Intzetta, la versione iniziale del gioco dei paesi della Sardegna. Un grazie a chi ha giocato per primo.`,
    canonical: `${SITE}/stagione-alpha.html`,
    body: `  <h1>Stagione Alpha</h1>
  <p>Prima delle classifiche di oggi — generale, giornaliera e per provincia — Intzetta ha avuto
  una sola stagione, giocata quando il gioco era ancora grezzo e i comuni si caricavano a mano.
  Questa pagina è il grazie a chi c'era.</p>

  <ul class="facts">
    <li><b>${alpha.partecipanti}</b>partecipanti</li>
    <li><b>${escapeHtml(String(alpha.chiusura))}</b>data di chiusura</li>
    <li><b>40.000</b>punteggio massimo</li>
  </ul>

  <div class="card">
    <h2 style="color:var(--primary-dark);border-color:rgba(0,0,0,.15);margin-top:0">I primi ${alpha.classifica.length}</h2>
    <table class="alpha">
      <thead>
        <tr><th>#</th><th>Giocatore</th><th>Punteggio</th></tr>
      </thead>
      <tbody>
${righe}
      </tbody>
    </table>
  </div>

  <h2>La nuova stagione è aperta</h2>
  <p>Adesso ogni giorno c'è una <strong>sfida del giorno</strong> con gli stessi comuni per tutti,
  tre vite per giocare partite valide per la classifica, un tempo limite di 30 secondi a round e
  classifiche separate per ogni provincia. E si può giocare anche senza account, in allenamento.</p>
  <p><a class="cta" href="/">Gioca la sfida di oggi</a></p>

  <p style="opacity:.75;font-size:.85rem;margin-top:22px">
    Nota: i punteggi della Stagione Alpha venivano calcolati e salvati dal browser, senza controllo
    lato server. Sono conservati qui come memoria storica, non come classifica ufficiale.
  </p>`,
  });

  fs.writeFileSync(path.join(PUBLIC, 'stagione-alpha.html'), alphaPage, 'utf8');
  written.push({ file: 'stagione-alpha.html', size: alphaPage.length, count: alpha.classifica.length });
}

// ---------------------------------------------------------------------------
// Controllo finale: se un comune non finisce nell'HTML, la compilazione si ferma
// ---------------------------------------------------------------------------
const mainRendered = (comuniPage.match(/<li id="/g) || []).length;
if (mainRendered !== entries.length) {
  throw new Error(
    `La pagina principale elenca ${mainRendered} comuni su ${entries.length}: compilazione interrotta.`
  );
}
for (const p of provinceGroups) {
  const html = fs.readFileSync(path.join(PUBLIC, `comuni-${p.slug}.html`), 'utf8');
  const rendered = (html.match(/<li id="/g) || []).length;
  if (rendered !== p.items.length) {
    throw new Error(
      `La pagina della ${p.nome} elenca ${rendered} comuni su ${p.items.length}: compilazione interrotta.`
    );
  }
}

// ---------------------------------------------------------------------------
// Sitemap generata dall'elenco reale delle pagine
// ---------------------------------------------------------------------------
const urls = [
  { loc: `${SITE}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${SITE}/comuni-sardegna.html`, priority: '0.9', changefreq: 'monthly' },
  ...provinceGroups.map((p) => ({
    loc: `${SITE}/comuni-${p.slug}.html`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
  ...(alpha ? [{ loc: `${SITE}/stagione-alpha.html`, priority: '0.3', changefreq: 'yearly' }] : []),
  ...entries.map((e) => ({
    loc: `${SITE}/comuni/${e.slug}.html`,
    priority: '0.6',
    changefreq: 'yearly',
  })),
  { loc: `${SITE}/privacy-policy.html`, priority: '0.2', changefreq: 'yearly' },
  { loc: `${SITE}/cookie-policy.html`, priority: '0.2', changefreq: 'yearly' },
  { loc: `${SITE}/termini-acquisti.html`, priority: '0.2', changefreq: 'yearly' },
  { loc: `${SITE}/sponsor.html`, priority: '0.5', changefreq: 'monthly' },
  { loc: `${SITE}/terms-of-service.html`, priority: '0.2', changefreq: 'yearly' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sitemap, 'utf8');

// ---------------------------------------------------------------------------
console.log('Pagine di contenuto generate:');
written.forEach((w) =>
  console.log(`  public/${w.file.padEnd(28)} ${(w.size / 1024).toFixed(1)} KB, ${w.count} voci`)
);
console.log(`  public/sitemap.xml              ${urls.length} indirizzi`);
console.log(`  comuni con secondo nome ufficiale: ${bilingual.length}`);
console.log(`  fonte province: elenco ufficiale derivato da dati ISTAT (CC BY 3.0 IT)`);
console.log(
  TRACKER
    ? `  misurazione inclusa nelle pagine: ${(ENV.VITE_ANALYTICS_PROVIDER || '').toLowerCase()}`
    : '  misurazione non configurata: le pagine restano senza richieste esterne'
);
