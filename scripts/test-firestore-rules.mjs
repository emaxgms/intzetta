/**
 * Verifica delle regole Firestore contro l'emulatore, PRIMA di applicarle in produzione.
 *
 * Perche' non basta rileggerle: le regole sono codice che gira solo su Google, e un errore li' si
 * manifesta come "impossibile salvare il punteggio" per gli utenti veri. In particolare va
 * verificato il percorso di chi si registra via EMAIL: il suo documento viene creato SENZA il
 * campo bestScore, e nella prima stesura delle regole il primo salvataggio di punteggio sarebbe
 * stato rifiutato.
 *
 * Uso: avviare l'emulatore, poi  node scripts/test-firestore-rules.mjs
 */

const PROJECT = 'insetta-b078c';
const HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const BASE = `http://${HOST}/v1/projects/${PROJECT}/databases/(default)/documents`;

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

/** Token finto nel formato accettato dall'emulatore: identifica un utente senza firma valida. */
function tokenFor(uid) {
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const header = b64({ alg: 'none', typ: 'JWT' });
  const payload = b64({
    sub: uid,
    user_id: uid,
    aud: PROJECT,
    iss: `https://securetoken.google.com/${PROJECT}`,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    firebase: { sign_in_provider: 'password' },
  });
  return `${header}.${payload}.`;
}

async function writeDoc(path, fields, { uid = null } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (uid) headers.Authorization = `Bearer ${tokenFor(uid)}`;
  const mask = Object.keys(fields).map((f) => `updateMask.fieldPaths=${f}`).join('&');
  const res = await fetch(`${BASE}/${path}?${mask}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ fields }),
  });
  return res.status;
}

async function readDoc(path, { uid = null } = {}) {
  const headers = {};
  if (uid) headers.Authorization = `Bearer ${tokenFor(uid)}`;
  const res = await fetch(`${BASE}/${path}`, { headers });
  return res.status;
}

async function deleteDoc(path, { uid = null } = {}) {
  const headers = {};
  if (uid) headers.Authorization = `Bearer ${tokenFor(uid)}`;
  const res = await fetch(`${BASE}/${path}`, { method: 'DELETE', headers });
  return res.status;
}

const str = (v) => ({ stringValue: v });
const int = (v) => ({ integerValue: String(v) });

/**
 * Svuota i dati dell'emulatore prima di iniziare.
 * Senza questo il test non sarebbe ripetibile: l'emulatore conserva i documenti fra
 * un'esecuzione e l'altra, e i punteggi lasciati dalla volta prima farebbero fallire
 * le verifiche sulla crescita del punteggio.
 */
async function clearEmulator() {
  const res = await fetch(`http://${HOST}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Impossibile svuotare l'emulatore: HTTP ${res.status}`);
}
await clearEmulator();

console.log('\n=== 1. La classifica pubblica resta leggibile senza accesso ===');
// Il documento va creato prima: leggerne uno inesistente darebbe 404 anche con il permesso.
await writeDoc('users/pubblico', { username: str('Giocatore'), bestScore: int(12345) }, { uid: 'pubblico' });
check('lettura anonima di un utente esistente', (await readDoc('users/pubblico')) === 200, 'la home mostra la classifica prima del login');
check('un documento inesistente dà 404, non 403', (await readDoc('users/inesistente')) === 404);

console.log('\n=== 2. Nessuno può scrivere senza accesso ===');
check('scrittura anonima rifiutata', (await writeDoc('users/anonimo', { bestScore: int(10) })) === 403);
check('lettura di una collezione inventata rifiutata', (await readDoc('BestScores/qualcosa')) === 403);

console.log('\n=== 3. Il percorso di chi si registra via EMAIL ===');
// Il documento viene creato al primo salvataggio del nome utente, SENZA bestScore.
check('creazione del profilo senza punteggio', (await writeDoc('users/emailuser', { username: str('Mario') }, { uid: 'emailuser' })) === 200);
// Qui sta il bug della prima stesura: senza valori di riserva il confronto andava in errore.
check('primo salvataggio di punteggio dopo la creazione senza bestScore', (await writeDoc('users/emailuser', { bestScore: int(12000) }, { uid: 'emailuser' })) === 200, 'era il caso che falliva');
check('secondo miglioramento del punteggio', (await writeDoc('users/emailuser', { bestScore: int(25000) }, { uid: 'emailuser' })) === 200);

console.log('\n=== 4. Non si può scrivere nel profilo di un altro ===');
check('scrittura nel profilo altrui rifiutata', (await writeDoc('users/vittima', { bestScore: int(40000) }, { uid: 'attaccante' })) === 403);

console.log('\n=== 5. Il punteggio non può uscire dai limiti ===');
check('punteggio oltre il massimo rifiutato', (await writeDoc('users/emailuser', { bestScore: int(99999) }, { uid: 'emailuser' })) === 403);
check('punteggio negativo rifiutato', (await writeDoc('users/emailuser', { bestScore: int(-5) }, { uid: 'emailuser' })) === 403);
check('punteggio non numerico rifiutato', (await writeDoc('users/emailuser', { bestScore: str('40000') }, { uid: 'emailuser' })) === 403);
check('il massimo esatto (40000) accettato', (await writeDoc('users/emailuser', { bestScore: int(40000) }, { uid: 'emailuser' })) === 200);
check('abbassare il punteggio rifiutato', (await writeDoc('users/emailuser', { bestScore: int(100) }, { uid: 'emailuser' })) === 403);

console.log('\n=== 6. Aggiornamenti normali del profilo ===');
check('cambio del solo nome utente', (await writeDoc('users/emailuser', { username: str('Mario Rossi') }, { uid: 'emailuser' })) === 200);
check('cambio del solo avatar', (await writeDoc('users/emailuser', { photoURL: str('https://esempio/avatar.svg') }, { uid: 'emailuser' })) === 200);

console.log('\n=== 7. Nessuno può cancellare dal client ===');
check('cancellazione rifiutata anche al proprietario', (await deleteDoc('users/emailuser', { uid: 'emailuser' })) === 403);

console.log(`\n=== RISULTATO: ${pass} superati, ${fail} falliti ===\n`);
process.exit(fail === 0 ? 0 : 1);
