/**
 * Costruisce i pacchetti di test.
 *
 * Sta in uno script Node invece che nella riga di comando di npm perche' i valori da sostituire
 * contengono caratteri che le shell di Windows interpretano male: qui si scrivono come oggetto
 * JavaScript, senza virgolette da scappare.
 *
 * Il pacchetto "analytics-configured" serve a verificare il comportamento REALE della misurazione
 * quando e' configurata. Senza di esso si testerebbe solo il caso "spento", e un errore come
 * "data-domain" al posto di "data-domains" passerebbe inosservato: e' successo davvero.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '.test-build');

const CONFIGURATO = {
  'import.meta.env': JSON.stringify({
    VITE_ANALYTICS_PROVIDER: 'umami',
    VITE_ANALYTICS_SCRIPT_URL: 'https://cloud.umami.is/script.js',
    VITE_ANALYTICS_SITE_ID: '7c6bc700-28be-4ea7-83bb-686e6d19784f',
    VITE_ANALYTICS_DOMAIN: 'intzetta.top',
  }),
};

const bundles = [
  { entry: 'src/utils/daily.js', out: 'daily.mjs' },
  { entry: 'src/utils/provinces.js', out: 'provinces.mjs' },
  { entry: 'src/utils/lives.js', out: 'lives.mjs' },
  { entry: 'src/utils/boards.js', out: 'boards.mjs' },
  { entry: 'src/utils/analytics.js', out: 'analytics.mjs' },
  { entry: 'src/utils/analytics.js', out: 'analytics-configured.mjs', define: CONFIGURATO },
];

for (const b of bundles) {
  await esbuild.build({
    entryPoints: [path.join(ROOT, b.entry)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: path.join(OUT, b.out),
    logLevel: 'warning',
    ...(b.define ? { define: b.define } : {}),
  });
  console.log(`  ${b.out}`);
}
