# Intzetta — Piano di crescita e ricavi

> Documento di lavoro, 14 ottobre 2026.
> Ogni numero è marcato: ✅ **verificato** (con fonte o misurato direttamente), 🟡 **deduzione**,
> 🔴 **stima** da validare. Le fonti sono in appendice.

---

## 0. In una pagina (per chi decide)

**Dove siamo.** Intzetta è un gioco che funziona e piace: chi lo prova capisce le regole in 5 secondi.
Ma in 529 giorni ha raccolto **24 account registrati**, l'ultima attività è di **5 mesi fa**, non è
indicizzato da nessun motore di ricerca e non ha nessuno strumento per misurare chi gioca.
Non è un problema di monetizzazione: è un problema di **distribuzione e ritorno**.

**La tesi.** Il pubblico della Sardegna è troppo piccolo perché la pubblicità da sola mantenga il
progetto: con un RPM realistico per l'Italia, **100 €/mese richiedono ~17.000 pageview al mese** ✅.
Il denaro vero, in un prodotto così locale, sta in tre posti:

1. **il gioco diventa un'abitudine** (sfida giornaliera + condivisione su WhatsApp): è il presupposto
   di tutto il resto, e oggi manca completamente;
2. **il B2B locale** (scuole, hotel, GAL, comuni, Pro Loco, eventi, media): 3-8 clienti il primo anno
   valgono **8.000-25.000 €** 🔴 — e qui la nicchia sarda è un *vantaggio*, non un difetto;
3. **il motore riutilizzabile**: la stessa meccanica applicata ai **7.904 comuni italiani**, poi alle
   regioni di altri paesi, venduta come licenza a chi vuole "il gioco del proprio territorio".
   Questa è la leva che moltiplica il mercato di 30 volte, ed è la direzione che hai scelto.

**Le tre cose da fare adesso** (in quest'ordine, niente altro):
1. mettere la **misurazione** (oggi non sappiamo nemmeno quante persone aprono il gioco);
2. costruire la **sfida giornaliera + la condivisione**: è il ~70% del risultato di crescita;
3. creare **`/comuni-sardegna`**, la pagina sui 377 comuni: l'unico asset che accumula valore nel tempo.

**Cosa NON fare.** Non pubblicare su CrazyGames/Poki: richiedono l'inglese ✅ e il loro pubblico è
USA/UK — un quiz sui comuni sardi lì vale zero, pagando il 33-50% di commissioni. Non comprare
pubblicità prima di avere retention. Non mettere un paywall sul gioco: nel geo-quiz nessuno lo fa
(GeoGuessr tiene gratis la sfida giornaliera; JetPunk vende "togli la pubblicità", non i quiz).

**Il vincolo da risolvere subito.** La mappa usata oggi (`server.arcgisonline.com`, senza chiave) **non
è utilizzabile per un sito commerciale**: i termini di Esri lo vietano esplicitamente ✅. La buona
notizia è che la soluzione costa **zero** fino a ~10.000 partite al mese (ArcGIS Location Platform,
stesse immagini, 2 milioni di tessere gratuite) e richiede una modifica di poche righe. Dettagli al
§7.3 — è il primo intervento da fare, prima di qualunque campagna.

---

## 1. Fotografia di partenza

### 1.1 Cos'è Intzetta oggi

Un GeoGuessr **al contrario** e limitato alla Sardegna: il gioco mostra il **nome di un paese sardo**
(377 comuni in archivio) e il giocatore deve **cliccare il punto giusto sulla mappa satellitare**.
Il punteggio dipende dalla distanza: 5.000 punti entro 1 km, 0 oltre 50 km, curva esponenziale in mezzo.
8 round, massimo 40.000 punti. Classifica globale su Firestore, accesso opzionale con Google o email.
Interfaccia e messaggi finali in italiano con espressioni in sardo ("Ses un Intzettadori!").

**Perché la mappa satellitare è la scelta giusta** (e va difesa): una mappa con le etichette dei paesi
renderebbe il gioco banale — basterebbe cercare il nome scritto sulla mappa. La mappa satellitare senza
etichette è ciò che rende il gioco un gioco. Qualsiasi cambio di fornitore di tessere deve preservare
questa proprietà.

### 1.2 I numeri veri (misurati direttamente sul database di produzione)

| Metrica | Valore |
|---|---|
| Account registrati totali | **24** |
| Di cui hanno giocato almeno una partita | 21 |
| Account che non hanno mai giocato | 3 |
| Punteggio medio (di chi ha giocato) | 24.447 |
| Punteggio mediano | 23.483 |
| Punteggi perfetti (40.000 esatti) | **3** su 24 |
| Prime iscrizioni | 3 maggio 2025 |
| Iscrizioni nel primo mese | **16** dei 24 (il 67%) |
| Ultima attività registrata | 8 maggio 2026 |
| Mesi di vita | 17,4 |

**Come leggerli.** Il picco iniziale (16 account in un mese) dice che c'è stato un lancio — amici,
conoscenze, forse un post — e che **il prodotto ha funzionato**: quelle persone hanno giocato e hanno
salvato un punteggio. Poi la curva è crollata a **1-2 account al mese**, cioè passaparola residuo.
Non c'è stato nessun canale di acquisizione: nessuna SEO, nessuna condivisione, nessuna community.

**Due avvertenze importanti sulla misura.**
- Questi 24 sono solo **chi si è registrato**. Chi ha giocato senza fare l'accesso non è contato da
  nessuna parte: oggi è tecnicamente **impossibile sapere quante persone aprono il gioco**. È il primo
  problema da risolvere, prima di qualunque ragionamento sui ricavi.
- **3 utenti su 24 hanno un punteggio di 40.000 esatti**, cioè il massimo teorico. Può essere abilità
  (i sardi conoscono la propria isola), ma il punteggio è scritto dal browser e **la classifica è
  falsificabile da chiunque apra la console** (§1.3). Finché non c'è validazione lato server, un
  punteggio non è una prova: quindi **niente premi e niente classifiche a pagamento** prima di quello.

### 1.3 Audit tecnico: cosa blocca i ricavi

Ogni riga è verificata sul codice o sulla produzione, non ipotizzata.

| # | Problema | Prova | Perché blocca i soldi | Stato |
|---|---|---|---|---|
| 1 | Il sito non è indicizzato da nessun motore di ricerca | Cercando "intzetta" non compare nulla; `robots.txt` e `sitemap.xml` non esistevano (il server restituiva la pagina del gioco con codice 200 per *qualsiasi* URL, quindi anche per i file inesistenti) | È il canale di acquisizione gratuito più importante per un gioco del genere: senza, l'unico modo di arrivare è il passaparola | ✅ **risolto** |
| 2 | Nessuno strumento di misura | Nel bundle non c'è nessuna libreria di analytics; la proprietà GA4 esiste già nel progetto (`G-7EGR672M0V`) ma non è collegata | Non si può ottimizzare né dimostrare numeri a un cliente B2B. Serve prima di tutto il resto | ⬜ da fare |
| 3 | Nessuna condivisione | Non esiste alcun pulsante o funzione di condivisione; il link incollato su WhatsApp non mostra anteprima (nessun tag Open Graph) | WhatsApp è usato dal **90,1%** degli italiani online ✅: è *il* canale virale in Italia, e oggi è chiuso | ✅ **risolto** (anteprima) / ⬜ condivisione da costruire |
| 4 | Nessuna ragione per tornare | Non c'è sfida giornaliera, non ci sono serie (streak), non ci sono notifiche. Il gioco è identico a se stesso ogni volta | Un gioco "una tantum" non genera né abitudine né ricavi ricorrenti | ⬜ da fare |
| 5 | La classifica è falsificabile | `upsertBestScore()` scrive `bestScore` dal browser; chiunque può impostare 40.000 dalla console | Impedisce premi, tornei, classifiche a pagamento e vendita a enti | ⬜ da fare |
| 6 | **Dati personali leggibili da chiunque** | `https://firestore.googleapis.com/v1/projects/insetta-b078c/databases/(default)/documents/users` risponde **200 senza autenticazione** e restituisce nome, foto profilo Google e punteggio di tutti gli utenti | Riguarda il GDPR: nomi e foto profilo di terzi non devono essere liberamente scaricabili. Da sistemare **prima** di far crescere il gioco | ⬜ da fare (§7.1) |
| 7 | Le regole Firestore nel repository erano sbagliate | Il file indicava la collezione `BestScores`, che il codice non usa (usa `users`): un deploy da repository avrebbe rotto classifica e salvataggi | Rischio di rottura in produzione al primo deploy fatto "come si deve" | ✅ **risolto** |
| 8 | Tessere mappe senza licenza commerciale | Il piano gratuito di MapTiler è "personal, or non-commercial" ✅; Stadia Maps Free: "Commercial use not allowed" ✅; l'attuale servizio Esri è usato senza chiave | **Non si può fare pubblicità né vendere** finché la mappa non ha una licenza commerciale | ⬜ da fare (§7.3) |
| 9 | Pagina pesante 3,46 MB, di cui 2,7 MB mai usati | Screenshot del README (1,8 MB) e loghi raster da 200-245 KB serviti in produzione; un "logo" da 245 KB veniva mostrato alto 90 pixel | Su mobile, con dati mobili, un caricamento lento uccide la partita prima che inizi | ✅ **risolto** (da 3,46 a **1,15 MB**, incluse le nuove funzioni) |
| 10 | 29 `console.log` di debug in produzione, log di debug committato nel repository | `console.log` in 5 file; `firestore-debug.log` versionato | Rumorosità e piccoli dettagli che fanno sembrare il progetto abbandonato | ✅ **risolto** |
| 11 | Nessun titolo, descrizione o lingua corretta per i motori di ricerca | `<html lang="en">`, `<title>Intzetta</title>`, nessuna descrizione, nessun dato strutturato | Il sito è in italiano ma si dichiarava in inglese: zero pertinenza sulle ricerche italiane | ✅ **risolto** |
| 12 | Licenza contraddittoria | Il README dichiarava MIT, `package.json` diceva ISC, il file `LICENSE` **non è mai esistito** | Va deciso prima di pubblicizzare il motore riutilizzabile: con una licenza permissiva un concorrente può rivendere Intzetta ai comuni sardi | ✅ **allineato** (dichiarazione MIT rimossa) / ⬜ decisione da prendere (§10) |
| 13 | Un solo blocco JavaScript da 785 KB (215 KB compressi) | Vite genera un unico chunk con React+Leaflet+Firebase+turf tutti insieme | Firebase (~150 KB) serve solo al momento del login: caricarlo subito rallenta la prima partita | ⬜ da fare (Fase 1) |
| 14 | `public/index.html` era la pagina di benvenuto del wizard Firebase | "Welcome to Firebase Hosting — Setup Complete" | File morto in produzione | ✅ **risolto** |

---

## 2. Il mercato e la matematica del business

### 2.1 Quanto è grande il pubblico possibile

| Bacino | Dimensione | Accessibilità |
|---|---|---|
| Residenti in Sardegna | 1.562.381 ✅ | Alta: sono il pubblico naturale |
| Studenti 6-18 anni | ~158.300 ✅ | Alta: 232 istituzioni scolastiche autonome ✅ |
| Turisti (arrivi 2025) | 5.170.093 arrivi / 21.922.765 presenze ✅ | Media: giocano se il gioco è in inglese e se qualcuno glielo mette in mano (hotel, campeggi) |
| Diaspora sarda (Germania, Belgio, Argentina…) | non quantificata | Alta affettività: "indovina il tuo paese" è una miccia |
| Comuni della Sardegna | 377 ✅ | Alta: ognuno è un potenziale committente o sponsor |

**Il pubblico reale non è "tutti gli italiani": è chi ha un legame con la Sardegna.** È un bacino
piccolo, ma **identificabile e raggiungibile con precisione chirurgica** — gruppi Facebook sardi,
testate locali, scuole, Pro Loco, circoli della diaspora. Questa concentrazione è il vero vantaggio
competitivo: un sito globale non può copiarla.

### 2.2 Perché la pubblicità da sola non basta

Matematica verificata sui benchmark ✅ (RPM = ricavo per 1.000 pageview):

| Configurazione pubblicitaria | RPM realistico 🔴 | 100 €/mese | 500 €/mese | 1.000 €/mese |
|---|---|---|---|---|
| Solo banner AdSense, nessuna ottimizzazione | 1,5 € | 67.000 pageview | 333.000 | 667.000 |
| AdSense + interstitial + consenso fatto bene | 6 € | **17.000 pageview** | 83.000 | 167.000 |
| Stack completo (interstitial + rewarded + video) | 10 € | 10.000 | 50.000 | 100.000 |

Il CPM italiano è strutturalmente circa **un terzo** di quello statunitense ✅. E il formato che paga
davvero è il **fullscreen** (interstitial e rewarded rendono ~8 volte il banner ✅), mentre Intzetta è
"una pagina, 8 round": non ha pause naturali in cui inserire pubblicità fullscreen senza rovinare
l'esperienza. **Conclusione onesta: la pubblicità su Intzetta, da sola, è una mancia.** Va messa quando
c'è traffico, non prima, e non è la ragione per cui vale la pena fare il progetto.

### 2.3 I motori di ricavo, in ordine di realismo

| Motore | Ricavo realistico anno 1 🔴 | Dipende da | Verdetto |
|---|---|---|---|
| **B2B locale** (scuole, hotel, GAL, comuni, eventi) | **8.000-25.000 €** | Vendita attiva (3-8 clienti) | ⭐ Il motore principale. Qui la nicchia è un vantaggio |
| **Licenza del motore** (altre regioni, white-label) | 0-10.000 € | Prodotto riutilizzabile + 1 caso di successo | ⭐ La leva di scala, da costruire nel 2027 |
| **Pubblicità display** | 200-1.500 € | Traffico (17k-80k pageview/mese) | Utile, non decisivo. Da attivare dopo il traffico |
| **Premium "togli la pubblicità"** | 100-600 € | Utenti ricorrenti + conversione 0,5-2% ✅ | Da fare solo insieme alla sfida giornaliera |
| **Portali internazionali** (CrazyGames, Poki) | ~0 € | Inglese obbligatorio ✅ | ❌ Da non fare |
| **Merch / gioco da tavolo** | non quantificato | Marchio | ⏳ Solo dopo che il marchio esiste (esiste già un mercato di giochi sardi a pagamento: *Spuntino in Sardegna*, *Tancas*, *Sgrunt*, *Tzintzula*, e una fiera dedicata, *Sardegna Games*) |

### 2.4 Il moltiplicatore: dal gioco al motore

Questo è il punto strategico più importante del documento.

**Oggi Intzetta è un gioco sulla Sardegna.** Ma il codice è già quasi generico: 377 comuni con
coordinate in un file JSON, più due numeri che definiscono l'inquadratura della Sardegna. Diventare
"il motore dei giochi di geografia locale" significa poter generare in poche ore:

- *Intzetta Sicilia* (391 comuni), *Intzetta Puglia* (257), *Intzetta Toscana* (273)…
- il **gioco dei comuni d'Italia**: **7.904 comuni** ✅, un mercato **21 volte** la Sardegna
- versioni per singoli territori: un GAL, un'unione di comuni, una provincia, un'area protetta
- la stessa cosa all'estero: la Francia ha **34.945 comuni**, la Spagna 8.131 — e in Francia la
  geografia dei comuni è già un gioco di massa

**E il modello di business giusto non è "un gioco", è un hub.** La lezione più forte emersa dalla
ricerca: Worldle non è più gestito dal suo autore originale, ma da **Teuteuf Games**, uno studio con
quattro giochi quotidiani (Worldle, WhereTaken, Statle, Travle) che condividono **un solo account, un
solo abbonamento, una sola condivisione** ✅. Un singolo gioco non giustifica un abbonamento; un hub
di giochi quotidiani sì. Ed è coerente con GeoGuessr, che ha **comprato Seterra** nel 2022 ✅ per
aggregare contenuti sotto un'unica piattaforma.

**Tradotto in piano:** Intzetta è il primo gioco dell'hub, la Sardegna è il banco di prova, e il
prodotto che si vende è **"il gioco del tuo territorio"**. Ma l'ordine è obbligato: prima un caso di
successo dimostrabile in Sardegna, poi la vendita altrove.

---

## 3. Prodotto: cosa costruire

Le fasi sono in ordine di dipendenza. Le ore sono stime 🔴 per una persona che sa già lavorare su
questo codice.

### Fase 0 — Igiene, misura, indicizzazione (settimana 1) — 6-8 ore

| Cosa | Perché | Stato |
|---|---|---|
| Meta tag, lingua italiana, anteprima per la condivisione, dati strutturati | Il link condiviso su WhatsApp ora mostra titolo, descrizione e immagine: senza questo la condivisione non funziona | ✅ fatto |
| `robots.txt` + `sitemap.xml` | Permette ai motori di ricerca di trovare e indicizzare il sito | ✅ fatto |
| Rimozione del rewrite universale verso `index.html` | Prima *qualsiasi* URL rispondeva 200 con la pagina del gioco (anche `robots.txt`, che non esisteva): i motori di ricerca vedono decine di pagine identiche. Ora le URL inesistenti danno 404 | ✅ fatto |
| Alleggerimento: da 3,46 MB a 1,13 MB | Prima partita più veloce su mobile | ✅ fatto |
| Regole Firestore corrette nel repository | Un deploy dal repository non rompe più la produzione | ✅ fatto |
| Pulizia log di debug e licenza allineata | Igiene di progetto | ✅ fatto |
| **Misurazione degli eventi di gioco** | Non sappiamo quante persone giocano: senza questo non si decide nulla | ✅ **fatto** (Umami, senza cookie: nessun banner necessario) |
| **Applicazione delle regole Firestore in produzione** | Chiude l'esposizione dei dati personali. **Prima validare con l'emulatore**: le regole sono state scritte a mano e una di esse, nella prima stesura, avrebbe rifiutato il primo salvataggio di punteggio di chi si registra via email (il documento viene creato senza il campo `bestScore`) | ⬜ **da fare** |

**Sulla misurazione — decisione da prendere.** Due strade:

- **GA4** (la proprietà esiste già): gratis, dati ricchi, ma usa cookie → serve un **banner di
  consenso** conformato al Garante italiano. Più attrito per l'utente e più lavoro legale.
- **Analytics senza cookie** (es. Umami o Plausible): nessun banner necessario, si misura comunque
  cosa serve (visitatori, partite, completamento, provenienza). **Raccomandato per partire** 🟡: meno
  attrito, meno rischio, e i numeri che servono a un cliente B2B ci sono tutti.

Da misurare fin da subito, perché sono i numeri che serviranno per vendere: **partite iniziate,
partite completate, durata della sessione, provenienza, ritorno entro 7 giorni**.

### Fase 1 — La sfida giornaliera e la condivisione (settimane 2-4) — 25-35 ore

**È il ~70% del risultato.** Oggi Intzetta è un gioco che si prova una volta. Deve diventare una
**abitudine quotidiana**, ed è la meccanica che ha reso Wordle famoso: secondo Wikipedia, Wordle
"divenne largamente popolare alla fine del 2021 **dopo l'introduzione del formato condivisibile a
griglia di emoji**" ✅.

| Cosa | Dettaglio | Perché | Stato |
|---|---|---|---|
| **Sfida giornaliera** | Gli stessi 8 comuni per tutti, cambiano a mezzanotte (fuso di Roma), un solo tentativo al giorno | Esperienza **sincrona condivisa**: è la ragione per cui si commenta insieme. Crea il motivo per tornare | ✅ **fatto** |
| **Risultato condivisibile** | Testo pronto da incollare su WhatsApp: numero della sfida, punteggio, griglia di emoji, **e il link** | La griglia non anticipa nulla (nessuno spoiler) ma mostra quanto sei stato bravo. **Differenza chiave da Wordle: mettere il link** — su WhatsApp un link è cliccabile e trasforma la condivisione in nuovi giocatori | ✅ **fatto** |
| **Serie (streak)** | Giorni consecutivi giocati, salvati anche senza account | Il meccanismo di ritorno più potente ed economico | ✅ **fatto** |
| **Grida di emoji calibrata sull'isola** | 🟩 entro 1 km, 🟨 entro 5, 🟧 entro 15, 🟥 entro 35, ⬛ oltre | La Sardegna è lunga ~270 km: queste soglie sono più strette di quelle di un gioco globale, ed è voluto — è l'identità del prodotto | ✅ **fatto** |
| **Misurazione degli eventi** | Partita iniziata, round punteggiato, partita finita, condivisione cliccata, durata | È ciò che serve sia per ottimizzare sia per dimostrare numeri a un cliente B2B | ✅ **fatto** (codice pronto, manca la scelta del fornitore) |
| **Ripresa della partita interrotta** | Se si ricarica la pagina a metà sfida, si riprende dal round giusto | Su mobile succede di continuo: senza questo si perde la sfida del giorno | ✅ **fatto** |
| **Modalità "indovina il tuo paese"** | Il giocatore cerca il proprio comune di nascita o residenza | Idea a più alto potenziale virale 🔴: è personale, si condivide d'istinto, e parla direttamente alla diaspora | ⬜ da fare |
| **Divisione del codice** | Caricare Firebase solo quando serve | Primo caricamento più rapido (oggi 218 KB compressi in un blocco solo) | ⬜ da fare |

**Formato della condivisione proposto** 🟡:

```
🏝️ INZETTA #142
Ho fatto 28.450 su 40.000
Sai piazzare Bitti, Teulada e Arzachena sulla mappa?
👉 intzetta.top
🟩🟩🟨🟧🟩🟥🟩🟨
```

### Fase 2 — Contenuto e SEO (settimane 4-8) — 25-40 ore

Il gioco è una singola pagina senza contenuto testuale: per i motori di ricerca è quasi invisibile.
Serve contenuto che risponda a domande che la gente **già** fa.

| Pagina | Contenuto | Perché porta soldi | Stato |
|---|---|---|---|
| **`/comuni-sardegna.html`** | L'elenco completo dei **377 comuni** in ordine alfabetico, con i nomi ufficiali in sardo accanto a quelli italiani (255 comuni ne hanno uno ✅), indice per lettera e dati strutturati per i motori di ricerca | È l'unico asset che accumula valore nel tempo: intercetta chi cerca i comuni della Sardegna (intento informativo già esistente) e lo trasforma in giocatori | ✅ **fatto** |
| **Una pagina per provincia** | Città metropolitana di Cagliari (17 comuni), Nuoro (74), Oristano (87), Sassari (92), Sud Sardegna (107) ✅ — sono le province ufficiali in vigore | Cattura le ricerche locali ("comuni della provincia di Sassari", "comuni della Gallura"). Ogni pagina ha un pulsante che avvia una partita **con i soli comuni di quella provincia** | ✅ **fatto** |
| **`/scuola`** | Materiali per insegnanti: schede, obiettivi didattici, come usarlo in classe | È la porta d'ingresso al canale scuole, che è un cliente B2B | ⬜ da fare |
| **Curiosità e record** | "I paesi che tutti sbagliano", "il punteggio più alto", "i comuni più difficili" — dati che solo il gioco può produrre | Contenuto che le testate locali possono citare: è il modo per farsi scrivere senza pagare, e diventa materiale di vendita B2B | ⬜ da fare (serve prima la misurazione) |

**Nota onesta sulla SEO:** le stime di volume di ricerca **non sono verificabili** in questa ricerca
(Google Trends ha risposto 429, gli strumenti a pagamento non sono disponibili) 🔴. Un segnale
contrario va detto: la ricerca "trova il comune" non restituisce **nessun** gioco ✅, il che potrebbe
significare che quella keyword ha volume vicino a zero. **Va verificata prima di investire**: si
misura con la Fase 0, non si presume.

Il vuoto competitivo, invece, è confermato: **non esiste un gioco che faccia cliccare i comuni
italiani sulla mappa** ✅. Su Play Store ci sono quiz su regioni e province, mai sui comuni. La
meccanica è libera.

### Fase 3 — Integrità e primi ricavi (settimane 8-14) — 30-45 ore

| Cosa | Dettaglio | Perché |
|---|---|---|
| **Punteggi validati lato server** | Cloud Function: il client manda il comune e le coordinate cliccate, il server calcola il punteggio e lo scrive | Senza questo non si possono mettere in palio premi né vendere classifiche |
| **Account opzionale ma con vantaggi** | Si gioca senza registrarsi; l'accesso serve per salvare serie e storico | Ogni passaggio in più prima della prima partita è un giocatore perso |
| **Dati personali protetti** | Spostare foto profilo ed email fuori dalla collezione pubblica; nella parte pubblica restare solo nome, punteggio e avatar generato | Rispetto del GDPR e credibilità verso scuole ed enti pubblici |
| **"Togli la pubblicità"** | 2,99 € una tantum, oppure 9,99 €/anno | È **l'unico modello premium che funziona in questo genere**: JetPunk vende 20 $/anno per togliere la pubblicità **senza toccare i quiz** ✅; Worldle vende lo stesso ✅. Non mettere mai il gioco principale a pagamento |
| **Pubblicità** | Solo dopo che il traffico esiste: prima gli interstitial, poi il rewarded | Il formato fullscreen rende ~8 volte il banner ✅ |

### Fase 4 — Il motore multi-territorio (mesi 4-6) — 60-100 ore

Il passaggio da gioco a prodotto vendibile:

| Cosa | Dettaglio |
|---|---|
| **Configurazione per territorio** | Da `sardinian-cities-corrected.json` + due coordinate a un file di configurazione: `{ id, nome, confini, centro, zoom, comuni[], fornitore mappa, lingua }` |
| **Import automatico dei comuni** | Gli script `scripts/fetch-sardinia-cities.cjs` esistono già e vanno generalizzati: ISTAT e i dataset comunali europei permettono di generare qualsiasi territorio |
| **Personalizzazione (white-label)** | Logo, colori, nome, classifica dedicata, round sponsorizzati |
| **Pannello di amministrazione** | Per far giocare una scuola o un ente senza intervento tecnico |
| **La prima regione oltre la Sardegna** | Da scegliere in base al primo cliente interessato, non a priori |

### Fase 5 — Prodotto per la scuola (mesi 6-9) — 40-60 ore

Versione per la classe: partite tra studenti, lavagna per l'insegnante, esercizi sui comuni del
proprio territorio, **senza pubblicità** (obbligatorio per legge e per deontologia). Il canale scuole
è descritto al §5.

---

## 4. Distribuzione: i canali, in ordine di priorità

| # | Canale | Sforzo | Perché funziona | Come |
|---|---|---|---|---|
| 0 | **Prerequisito: sfida giornaliera + condivisione + sito indicizzabile** | alto | Senza questo ogni altro canale rende un decimo | Fase 1 e 2 |
| 1 | **r/Sardegna** — post dello sviluppatore in prima persona | basso | È esattamente così che è nato GeoGuessr nel 2013: un post su Reddit e Chrome Experiments ✅. Reddit premia l'autenticità e punisce la promozione | Raccontare il progetto, chiedere giudizi, non vendere |
| 2 | **Gruppi Facebook sardi** ("Sei sardo se…": pagina da 15.773 like + 4 gruppi omonimi ✅) | basso | Pubblico perfetto e concentrato | **Chiedere prima il permesso agli amministratori**: un ban è definitivo |
| 3 | **@ig_sardinia su Instagram (168.000 follower ✅)** | basso | Il singolo canale a più alto potenziale per la Sardegna | Un messaggio privato: proporre la sfida giornaliera come contenuto, gratis |
| 4 | **Creator TikTok sardi** — @lasarda81 ha **già** fatto il video "indovina la città sarda" ✅, @anemiska ha 77.000 like con GeoGuessr Italia ✅ | medio | Hanno già il format e il pubblico: nessuna educazione necessaria | Proporre la collaborazione con la sfida giornaliera |
| 5 | **Testate locali** — L'Unione Sarda (che ha la sezione "I Sardi Nel Mondo": doppio aggancio), La Nuova Sardegna, Sardinia Post, **Vistanet** (che ha già la rubrica "Quiz per sardi doc" ✅), Radiolina | medio | Un gioco del genere è una notizia da pubblicare, non una pubblicità da vendere | Comunicato + numeri veri + disponibilità a co-brandizzare gratis |
| 6 | **Direttori di raccolta di giochi quotidiani** (es. relaydle.com/it ✅) | basso | Porta giocatori abituati ai giochi giornalieri, gratis | Segnalare il gioco |
| 7 | **Scuole** — 232 istituzioni autonome ✅, docente referente per il digitale | alto | Cliente B2B, non solo utente | Vedi §5 |
| 8 | **Pro Loco / UNPLI** | alto | Rete sottovalutata: 6.200 Pro Loco in Italia, 600.000 soci ✅ | Offerta evento chiavi in mano |
| 9 | **Diaspora sarda** (circoli in Germania, Francia, Belgio, Argentina; SardegnaMondo) | medio | Affettività altissima; la modalità "indovina il tuo paese" è pensata per loro | Contattare i circoli con materiale pronto per le loro serate |

**Il canale che NON consiglio:** i portali internazionali di giochi HTML5 (CrazyGames richiede
l'inglese come requisito di qualità ✅ e in fase di lancio tiene la pubblicità **disattivata**, quindi
zero ricavi ✅; Poki e i network di syndication pagano il 33-50% per un traffico globale che non gioca
un quiz sui comuni sardi). Per un gioco iper-locale italiano il valore atteso è vicino a zero.

---

## 5. Offerta e listino B2B

### 5.1 I cinque segmenti

| Segmento | Clienti potenziali | Prezzo realistico per cliente 🔴 | Difficoltà di vendita | Tempi di incasso |
|---|---|---|---|---|
| **Scuole** | 220-232 istituzioni autonome ✅ | 250-600 €/anno per istituto; 800-1.500 € con progetto di lingua sarda | Media (dirigente + referente digitale; ciclo settembre-maggio) | 60-120 giorni |
| **Turismo** | 1.076 hotel + 5.047 strutture complementari ✅ (compratori reali: 400-600) | 250-600 €/anno per struttura; 1.500-4.000 € per consorzio | Alta (frammentato, stagionale) | 30-60 giorni |
| **Comuni ed enti** | 377 comuni + 39 unioni + 5 comunità montane + 17 GAL ✅ (≈600-700 enti) | 1.500-3.500 € per comune; 4.000-12.000 € per unione/GAL | Alta (politica, gare) | 60-120 giorni; 6-18 mesi se da bando |
| **Media e brand** | 6-10 gruppi editoriali + 15-25 brand regionali | co-branding gratuito + round sponsorizzato 1.500-5.000 € | Medio-alta | 30-60 giorni |
| **Eventi** | ~500 eventi finanziati all'anno in Sardegna ✅ | 1.200-3.000 € per attivazione; 4.000-8.000 € per un cartellone | Media | 30-90 giorni |

### 5.2 Come si vende (i quattro pacchetti)

1. **Edizione del territorio** — *1.500-3.500 € una volta + 300-800 €/anno*
   Il gioco con i comuni di quel territorio, logo e colori dell'ente, classifica dedicata, un report
   finale con i dati di gioco.
2. **Pacchetto scuola** — *250-600 €/anno per istituto*
   Classi con partite tra studenti, lavagna per l'insegnante, nessuna pubblicità, materiali didattici.
3. **Attivazione dal vivo** — *1.200-3.000 € a evento*
   Schermo grande, partite a turni, classifica finale, conduzione, grafica con il logo dell'evento.
   Lo sponsor locale può coprire 300-1.000 € con un round dedicato.
4. **White-label completo** — *4.000-12.000 €*
   Unione di comuni, GAL o consorzio: gioco su misura, più attivazioni, più report.

### 5.3 I primi tre clienti da attaccare, in quest'ordine

1. **Un GAL o un'unione di comuni.** Ticket alto (4.000-8.000 €), budget **già finanziato** (17 GAL
   con 50 milioni di € di fondi ✅), e un contratto copre 5-20 comuni in una volta sola. È il cliente
   con il miglior rapporto tra sforzo di vendita e incasso.
2. **Un consorzio turistico in Gallura** (il 38% delle strutture dell'isola ✅, il 35% delle notti).
   Decisione privata e rapida: codice QR in reception, torneo tra ospiti, round sponsorizzati che il
   consorzio può **rivendere** ai partner. 1.500-4.000 € per il consorzio.
3. **Una Pro Loco o un evento con uno sponsor locale.** Cassa immediata, caso dimostrativo, e la
   leva più forte: i contributi regionali per i grandi eventi **obbligano a spendere il 20% in
   promozione e comunicazione** ✅ (22,5 milioni di € di fondi per il 2026 ✅). Intzetta entra
   esattamente in quella voce di spesa.

**In parallelo, e gratis:** un co-branding con una testata locale. Non porta soldi direttamente, ma
porta **i numeri** che rendono credibile la proposta ai tre clienti sopra.

### 5.4 Cosa serve per essere credibili

Un cliente B2B compra prove, non promesse. Questi sono i numeri da avere in mano (e sono esattamente
quelli che la Fase 0 e la Fase 1 servono a produrre):

- "**X comuni giocati su 377**" (obiettivo minimo 250, ottimo 350+)
- **20.000-50.000 partite** totali, **3.000-5.000 giocatori unici al mese**, almeno 3 partite per sessione
- **prova locale per il cliente**: "N partite nel tuo comune", "i 5 paesi che i tuoi ospiti sbagliano di più" — un dato che nessun altro fornitore può dargli
- **prova evento**: almeno 150 partecipanti e 1.000 partite per serata

---

## 6. Numeri: scenari a 6 e 12 mesi

Ipotesi di lavoro 🟡: 10 ore a settimana, nessun budget pubblicitario, fasi 0-3 completate, vendita
B2B iniziata dal terzo mese.

| | Prudente | Base | Buono |
|---|---|---|---|
| Visitatori unici/mese al mese 6 | 2.000 | 8.000 | 25.000 |
| Visitatori unici/mese al mese 12 | 5.000 | 25.000 | 90.000 |
| Pubblicità (mese 12) | 30 €/mese | 150 €/mese | 540 €/mese |
| Premium "togli la pubblicità" (mese 12) | 15 €/mese | 75 €/mese | 300 €/mese |
| **Clienti B2B paganti anno 1** | **2** | **5** | **9** |
| **Ricavi B2B anno 1** | **4.000 €** | **12.000 €** | **24.000 €** |
| **Ricavi totali anno 1** | **~4.500 €** | **~14.000 €** | **~30.000 €** |
| Costi anno 1 | ~400 € | ~700 € | ~1.400 € |

**Costi da mettere in conto** (il primo è obbligatorio per monetizzare, vedi §7.3):

| Voce | Costo |
|---|---|
| Tessere mappe con licenza commerciale | **0 €** fino a ~10.000 partite al mese (ArcGIS Location Platform); oltre, ~0,02 $ per partita |
| Dominio `intzetta.top` | ~10-30 €/anno |
| Firebase (Hosting + Firestore + Functions) | 0 € fino a qualche migliaio di visite al giorno; poi ~5-20 €/mese |
| Analytics senza cookie | 0-10 €/mese |
| Incasso pagamenti (Stripe/Paddle) | ~3-5% + commissione fissa per transazione |

**Il punto di pareggio è basso**: bastano **1-2 clienti B2B** per coprire tutti i costi dell'anno.
È il motivo per cui questo piano insiste sul B2B e non sulla pubblicità.

**Anno 2** (se la Fase 4 funziona e si vendono licenze ad altri territori): 10-20 istanze
white-label a 1.500-3.500 € l'una valgono **15.000-70.000 €** 🔴, con lo stesso prodotto — è qui che
il progetto smette di essere un gioco e diventa un'attività.

---

## 7. Rischi e conformità

### 7.1 Dati personali (rischio attuale, da chiudere subito) — 🔴 ALTO

**Il database è leggibile da chiunque senza autenticazione**: una chiamata all'API Firestore
restituisce nome, foto profilo Google e punteggio di tutti gli utenti registrati. Con 24 utenti è un
problema piccolo, ma:

- è un trattamento di dati personali senza le tutele minime (il GDPR non ha una soglia di "pochi utenti");
- diventa grave appena il gioco cresce, e **inaccettabile** se tra gli utenti ci sono minorenni
  (scuole!);
- un ente pubblico o una scuola che fa domande di conformità prima di firmare, questo lo trova.

**Soluzione:** la parte pubblica della classifica deve contenere solo nome, punteggio e avatar
generato; foto profilo ed email vanno in una parte privata leggibile solo dal proprietario. Da fare in
Fase 3, **prima** di qualunque campagna di crescita.

### 7.2 Cookie e consenso

Finché si usano analytics senza cookie, **non serve il banner**. Il banner diventa obbligatorio con
GA4 e con la pubblicità personalizzata. Il Garante italiano è tra i più rigorosi d'Europa: la scelta
"analytics senza cookie" rimanda il problema e riduce l'attrito — un altro motivo per preferirla
all'inizio.

### 7.3 Licenza delle tessere mappe (blocco alla monetizzazione) — 🔴 ALTO

**La mappa usata oggi non è utilizzabile per un sito commerciale.** Il gioco carica le immagini da
`server.arcgisonline.com/.../World_Imagery/...` senza chiave: la URL risponde, ma i termini di Esri
sono espliciti ✅. Il contratto collegato a quel servizio vieta di "usare contenuti di ArcGIS Living
Atlas per uso commerciale" senza accordo con Esri, di "ridistribuire le tessere", di "scaricare,
ridistribuire o ospitare autonomamente qualsiasi contenuto ospitato da Esri", e di "raccogliere
sistematicamente le tessere con metodi diversi dai pacchetti di contenuti Esri". I metadati del
servizio dichiarano `"exportTilesAllowed": false`. Quindi: **pubblicità, contratti con enti e
self-hosting delle tessere attuali sono tutti fuori norma.** Va sostituito **prima** di monetizzare.

Anche i piani gratuiti dei concorrenti non bastano: MapTiler Free è descritto come adatto a uso
"personal, or non-commercial" ✅; Stadia Maps Free dice "Commercial use not allowed" ✅ e il piano
Starter da 20 $/mese **non include le immagini satellitari** (servono 80 $/mese, o 4 crediti per
tessera ✅).

**La soluzione consigliata: ArcGIS Location Platform** ✅ — nessun canone, pagamento a consumo,
**2.000.000 di tessere al mese gratis**, poi 0,15 $ per 1.000 tessere. È lo stesso identico servizio
di immagini che il gioco usa oggi, quindi la qualità visiva non cambia; si usa con un token e
l'obbligo di attribuzione. Due accortezze: **non** mettere un proxy o una cache condivisa lato server
(il contratto lo vieta: "una singola richiesta non può servire più utenti" — la cache del browser di
ciascun giocatore invece va bene), e **non** scaricare le tessere per ospitarle.

**L'alternativa a costo zero e senza account**: le immagini Sentinel-2 cloudless di EOX. Attenzione,
la licenza è cambiata rispetto al passato: i dati dal 2018 al 2025 sono **CC BY-NC-SA 4.0**, cioè uso
**non** commerciale, e per l'uso commerciale serve una licenza EOX a pagamento (6.000 € per il
prodotto globale). Fa eccezione **il layer del 2016, che è CC BY 4.0** e quindi utilizzabile anche
commercialmente con attribuzione ✅. Va però detto cosa comporta: risoluzione 10 m per pixel e
immagine del 2016, quindi un paese a zoom 13 diventa una macchia di circa 26 pixel. Usabile come
ripiego o come "modalità difficile", non come sostituto equivalente.

**Verificato di persona, non solo letto.** Ho scaricato le tessere dei due servizi sulle stesse
coordinate (Sardegna centrale, lago Omodeo, zoom 12) e le ho confrontate: il servizio attuale mostra
strade, edifici e confini dei campi; quello EOX mostra la sagoma del lago e i terreni, ma **non le
strade e non i centri abitati**. In un gioco in cui si deve cliccare *dove sta un paese* le strade
sono l'unico appiglio per essere precisi: senza, il gioco diventa molto più difficile e il punteggio
più casuale. EOX resta un ripiego legittimo, non un sostituto equivalente.

**Conclusione operativa:** si parte con **ArcGIS Location Platform** (gratis fino a ~10.000 partite al
mese, stessa qualità di oggi, serve solo un token gratuito). Se si preferisce restare senza account e
con soli dati aperti, si passa a EOX cambiando una variabile d'ambiente e accettando la perdita di
dettaglio. Il self-hosting invece **non conviene oggi**: costerebbe lavoro e darebbe comunque immagini
a 10 metri.

**Quanto costa, in pratica.** Il gioco carica 100-250 tessere per partita (8 round, con la cache del
browser; le stime ufficiali dei fornitori parlano di 10-20 tessere per vista) 🔴. A ~150 tessere per
partita:

| Opzione | Uso commerciale | 1.000 partite/mese | 10.000 | 100.000 | Qualità |
|---|---|---|---|---|---|
| **Esri usato oggi (senza chiave)** | **NO — vietato** | non conforme | non conforme | non conforme | ottima |
| **ArcGIS Location Platform** | **SÌ** | **0 $** | **0 $** | ~1.950 $ | ottima (identica a oggi) |
| Stadia Maps Standard (80 $) | sì | 80 $ | 80 $ | ~1.130 $ | buona |
| MapTiler Flex con SDK (30 $) | sì | 30 $ | 30 $ | ~467 $ | buona |
| Mapbox con GL JS | sì | 0 $ | 0 $ | ~250 $ | molto buona |
| Google 2D Map Tiles | sì | ~30 $ | ~780 $ | ~5.160 $ | ottima |
| EOX 2016 self-hosted su Cloudflare R2 | sì | ~0 € | ~0 € | ~2 $ | media (10 m, 2016) |
| Bing / Azure Maps | — | — | — | — | il piano gratuito Bing è chiuso dal 30/06/2025 |
| Thunderforest, Jawg, NASA GIBS | — | — | — | — | nessuna mappa satellitare utilizzabile |

**La conseguenza sul piano economico è buona notizia**: fino a circa **10.000 partite al mese la mappa
costa zero**. Il "primo costo obbligatorio" che avevo stimato in 240-360 € l'anno **non serve**, a
condizione di registrarsi su ArcGIS Location Platform e sostituire la URL. Resta da chiedere a Esri
**conferma scritta** che il piano gratuito sia utilizzabile commercialmente: il contratto non contiene
una clausola che lo vieti, ma la prudenza costa una email.

**Va fatto come primo intervento tecnico**, prima di qualunque campagna: è una modifica di poche righe
(la URL del livello mappa più un token), ma finché non è fatta il progetto **non può incassare un euro
in regola**.

### 7.4 Integrità della classifica — 🟡 MEDIO

Il punteggio è calcolato e scritto dal browser. Con la pubblicità è un fastidio; con premi, tornei o
contratti con enti è un problema di credibilità. Va risolto con una Cloud Function (Fase 3). Le nuove
regole del database limitano già il danno (punteggio intero tra 0 e 40.000, che non può diminuire),
ma **non impediscono a un utente di dichiarare 40.000 dal primo giorno**.

### 7.5 Licenza e diritto d'autore — 🟡 MEDIO (decisione tua)

Stato attuale: il repository è pubblico, il README dichiarava MIT, `package.json` diceva ISC, il file
`LICENSE` non è mai esistito. La dichiarazione MIT è stata rimossa perché non corrispondeva ai fatti.
**La scelta va fatta adesso**, perché condiziona la direzione 4:

- **licenza permissiva** (MIT/Apache): chiunque può prendere il codice e rivendere "il gioco dei comuni
  sardi" a un comune, senza darti niente. Rende impossibile il modello di licenza;
- **licenza copyleft forte** (AGPL): chi lo usa come servizio deve pubblicare le modifiche. Difende il
  progetto, ma **spaventa i clienti pubblici e le aziende**, che spesso la vietano nei loro capitolati;
- **codice visibile, licenza riservata** (nessuna licenza concessa): è la situazione di fatto di oggi.
  Il gioco resta tuo, il repository resta pubblico come vetrina, e si può vendere la licenza
  commerciale. **È la scelta più coerente con la direzione 4** 🟡;
- **doppia licenza** (una versione libera per la comunità + una commerciale per gli enti): la più
  elegante, ma richiede di avere già un marchio riconoscibile.

### 7.6 Altri rischi

| Rischio | Mitigazione |
|---|---|
| **Il mercato è piccolo** (1,56 M di residenti) | È il motivo per cui il piano punta su B2B e sul motore multi-territorio, non sulla pubblicità |
| **La pubblicità non copre i costi** delle tessere | Verificare il costo per partita prima di attivare la pubblicità (§7.3) |
| **La SEO non porta traffico** (volumi non verificati) | Misurare le keyword nella Fase 0 prima di investire nella Fase 2 |
| **Dipendenza da Firebase** | Costi che crescono con il traffico; le regole sono già nel repository, il codice è portabile |
| **I dati dei comuni possono essere sbagliati** | 377 comuni con coordinate: va aggiunto un controllo automatico di corrispondenza con i confini comunali |
| **Un concorrente copia l'idea** | Il vuoto competitivo è confermato, ma l'idea è banale: il fossato è la **comunità sarda**, non il codice |
| **Il progetto si arena** (17 mesi di stallo lo dimostrano) | Il piano operativo (§8) è tarato su 10 ore/settimana con deliverable settimanali verificabili |

---

## 8. Piano operativo 90 giorni

**Settimane 1-2 — Rendere il progetto misurabile e sano**
- [x] Fase 0 tecnica (meta, SEO, regole, peso, pulizia) — *fatto in questa sessione*
- [ ] Scegliere e installare l'analytics (senza cookie)
- [ ] Validare le nuove regole Firestore con l'emulatore, poi applicarle in produzione
      (`npm install -g firebase-tools`, `firebase emulators:start --only firestore`, `firebase deploy --only firestore:rules`)
- [ ] Verificare i volumi di ricerca delle 3 keyword principali
- [ ] **Deliverable:** per la prima volta si sa quante persone giocano

**Settimane 3-5 — La sfida giornaliera**
- [x] Sfida giornaliera con gli stessi comuni per tutti (fuso di Roma, deterministica sulla data)
- [x] Risultato condivisibile con griglia di emoji e link
- [x] Serie dei giorni consecutivi
- [x] Griglia e soglie calibrate sull'isola
- [x] Ripresa della partita interrotta
- [x] Misurazione degli eventi di gioco (codice pronto, manca il fornitore)
- [ ] Scegliere il fornitore di analytics e attivarlo
- [ ] **Deliverable:** una persona può giocare, condividere su WhatsApp e tornare domani ✅ *raggiunto*

**Settimane 6-8 — Lancio sulla comunità sarda**
- [ ] Post su r/Sardegna (in prima persona, chiedendo giudizi)
- [ ] Contatto con gli amministratori dei gruppi Facebook sardi
- [ ] Messaggio privato a @ig_sardinia e ai creator TikTok sardi
- [ ] Comunicato alle testate locali con i primi numeri veri
- [ ] **Deliverable:** 2.000-8.000 visitatori e un dato onesto sulla domanda

**Settimane 9-10 — Contenuto e SEO**
- [x] `/comuni-sardegna.html`: i 377 comuni con indice per lettera, nomi sardo/italiano e dati strutturati
- [x] Dati sulle province presi dall'elenco ufficiale (ISTAT), **non indovinati**: 377 comuni abbinati su 377
- [x] 5 pagine per provincia (Cagliari 17, Nuoro 74, Oristano 87, Sassari 92, Sud Sardegna 107 = 377)
- [x] Partita giocabile **sui soli comuni di una provincia**, collegata da ogni pagina
- [x] Sitemap generata automaticamente dall'elenco reale delle pagine
- [x] Collegamenti interni fra home, pagina generale e pagine di provincia
- [ ] `/scuola`
- [ ] **Deliverable:** il sito ha qualcosa da indicizzare oltre al gioco ✅ *raggiunto: 6 pagine di contenuto*

**Settimane 11-13 — I primi soldi**
- [ ] Sostituire la sorgente delle mappe con una autorizzata per uso commerciale (vedi §7.3: la
      correzione è una variabile d'ambiente, il codice è già predisposto)
- [ ] Chiedere a Esri conferma scritta che il piano gratuito di ArcGIS Location Platform è
      utilizzabile commercialmente
- [ ] Punteggi validati lato server
- [ ] "Togli la pubblicità" a 2,99 €
- [ ] Preparare la scheda prodotto B2B di una pagina, con i numeri veri
- [ ] **Deliverable:** il prodotto è vendibile

**Settimana 14 — Vendita**
- [ ] Contattare **1 GAL o unione di comuni** (email pronta nel report B2B)
- [ ] Contattare **1 consorzio turistico in Gallura**
- [ ] Contattare **1 Pro Loco / evento** con sponsor locale
- [ ] **Deliverable:** 3 conversazioni commerciali aperte

---

## 9. Cruscotto: cosa misurare e quando fermarsi

**Ogni settimana** (5 numeri, niente di più):

| Indicatore | Obiettivo mese 3 | Obiettivo mese 6 | Soglia di allarme |
|---|---|---|---|
| Visitatori unici | 2.000 | 8.000 | < 500 |
| Partite completate / partite iniziate | > 60% | > 70% | < 40% |
| Partite per giocatore | > 1,5 | > 2,5 | < 1,2 |
| Ritorno entro 7 giorni | > 15% | > 25% | < 8% |
| Condivisioni per 100 partite | > 5 | > 12 | < 2 |

**Criteri di decisione** (decisi ora, per non deciderli quando si è emotivamente coinvolti):

- **Se dopo il lancio sulla comunità (settimana 8) i visitatori sono < 500/mese** → il problema è il
  prodotto o il messaggio, non i canali: rivedere la sfida giornaliera e il formato di condivisione
  prima di spendere altro tempo sui contenuti SEO.
- **Se il ritorno entro 7 giorni resta < 8% dopo la sfida giornaliera** → Intzetta è un gioco "una
  tantum" e va trattato come tale: si punta tutto su B2B ed eventi, e si abbandona l'idea di
  abbonamento e di pubblicità.
- **Se entro il mese 6 non c'è nessun cliente B2B interessato** → il prodotto piace ma non vale soldi:
  fermarsi e rivalutare, oppure dedicarsi al motore multi-territorio per un cliente già identificato.
- **Se un cliente B2B arriva prima del traffico** → è un buon segnale, non un problema: seguirlo e
  rimandare la crescita B2C.

---

## 10. Decisioni che servono da te

| # | Decisione | Opzioni | Consiglio |
|---|---|---|---|
| 1 | **Licenza del codice** | Permissiva / AGPL / riservata / doppia | **Riservata**, coerente con la vendita di licenze (§7.5) |
| 2 | **Analytics** | GA4 + banner di consenso / senza cookie | **Senza cookie**: niente banner, meno attrito (§3, Fase 0) |
| 3 | **Tessere mappe** | Piano commerciale 20-30 $/mese / self-hosting | Da decidere dopo l'analisi in corso; **obbligatorio prima di monetizzare** |
| 4 | **Dominio** | Tenere `intzetta.top` / prendere anche `intzetta.it` | Tenere `.top` per ora; `.it` è più credibile per i clienti pubblici italiani — costa ~10 €/anno 🔴 |
| 5 | **Primo terreno di espansione** | Sicilia / Puglia / comuni d'Italia / estero | **Non decidere adesso**: seguire il primo cliente interessato |
| 6 | **Prezzo del premium** | 2,99 € una tantum / 9,99 €/anno | 2,99 € una tantum per partire (modello JetPunk/Worldle) |

---

## Appendice A — Cosa è già stato fatto

Modifiche applicate al progetto, tutte verificate con una compilazione riuscita e con test automatici.

**La sfida giornaliera (Fase 1)** — nuovi file `src/utils/daily.js`, `src/daily.css`, `src/utils/analytics.js`
- **Selezione deterministica**: gli 8 comuni di una data sono sempre gli stessi per tutti, calcolati con
  un generatore pseudo-casuale seminato dalla data. Nessuna dipendenza esterna aggiunta.
- **Il giorno è quello di Roma**, non quello del dispositivo: la sfida cambia alla stessa ora per tutti,
  anche per chi gioca dall'estero.
- **Griglia di emoji calibrata sull'isola**: 🟩 entro 1 km, 🟨 entro 5, 🟧 entro 15, 🟥 entro 35, ⬛ oltre.
- **Testo di condivisione** con numero della sfida, punteggio, griglia, i primi tre comuni e **il link**.
  Su telefono si apre il menù di condivisione del sistema, su computer il testo viene copiato.
- **Serie dei giorni consecutivi**, salvata in memoria locale: funziona anche senza fare l'accesso.
- **Un solo tentativo al giorno** per la sfida; l'allenamento libero resta sempre disponibile.
- **Ripresa della partita interrotta**: ricaricando la pagina a metà sfida si riprende dal round giusto.
- **Misurazione**: livello di eventi neutro rispetto al fornitore. Finché non si sceglie lo strumento,
  **non parte nessun dato** e non serve nessun banner di consenso. Configurazione documentata in
  `.env.example`.
- **Rete di sicurezza**: se qualcosa va storto nel disegno della pagina, l'utente vede un messaggio e un
  pulsante di ricarica invece di una pagina bianca.
- **71 verifiche automatiche** (`scripts/test-daily.mjs`, `scripts/test-game-flow.mjs`): determinismo su
  400 giorni consecutivi, assenza di duplicati, punteggi ai limiti, correttezza delle date compresi i
  giorni di 23 e 25 ore per il cambio d'ora, serie che cresce e scade, condivisione senza spoiler,
  comportamento senza memoria locale disponibile.
- **Corretto un difetto introdotto durante il lavoro**: uno script di manutenzione aveva rovinato le
  lettere accentate in 5 file (`è` diventato `Ã¨`). Individuato e riparato, con verifica finale.

**La pagina dei comuni (Fase 2)** — nuovi file `scripts/generate-content-pages.mjs`
- **`/comuni-sardegna.html`**: HTML statico con tutti i **377 comuni** in ordine alfabetico, indice per
  lettera, i nomi ufficiali in sardo accanto a quelli italiani (255 comuni), dati strutturati
  schema.org e nessuna richiesta esterna. Si apre subito e i motori di ricerca lo leggono per intero:
  sono 54 KB di contenuto vero, dove prima c'era una pagina vuota.
- **La sitemap si genera da sola** dall'elenco reale delle pagine: non può restare indietro.
- **La pagina si rigenera a ogni compilazione** (`npm run build`), quindi non può divergere dai dati.
- **Collegamenti interni** dalla home e dalla sfida: senza di quelli una pagina nuova non viene trovata.
- **Due reti di sicurezza nel generatore**, che interrompono la compilazione invece di pubblicare in
  silenzio un elenco incompleto. Servivano davvero: un comune era scritto `'Onne/Fonni` con un
  apostrofo di troppo, finiva fuori da ogni gruppo alfabetico **e spariva dalla pagina** senza che
  nessuno se ne accorgesse. Corretto il dato (è `Onne/Fonni`, cioè Fonni) e reso impossibile il ripetersi
  del problema: ora un'iniziale inattesa finisce in un gruppo "Altri" con un avviso, e un controllo
  finale confronta i comuni scritti nell'HTML con quelli nei dati.
- **Controllo di qualità sui dati** dei 377 comuni: nessun nome duplicato, nessuna coordinata fuori
  dalla Sardegna, nessun carattere anomalo. L'unico difetto trovato era quello sopra.

**La sorgente delle mappe** — nuovo file `src/utils/maptiles.js`
- La URL e l'attribuzione delle immagini sono ora **configurabili** (`VITE_MAP_TILES_URL`), con ripiego
  sul servizio attuale. Sostituire la mappa non conforme diventa una variabile d'ambiente, non una
  modifica al codice, e il file documenta perché va fatto, come attivare ArcGIS Location Platform e i
  due vincoli contrattuali da rispettare (niente cache condivisa lato server, niente self-hosting).
- Un avviso in console ricorda, solo in sviluppo, che la sorgente attuale non è utilizzabile per un
  sito commerciale.

**Le pagine per provincia e i dati ufficiali (Fase 2, completata)**
- **5 pagine per provincia**, generate da `scripts/generate-content-pages.mjs` insieme alla pagina
  generale: Città metropolitana di Cagliari (17 comuni), Nuoro (74), Oristano (87), Sassari (92),
  Sud Sardegna (107). La somma è **377**, verificata a ogni compilazione.
- **I dati sulle province non sono stati indovinati.** `scripts/fetch-comuni-provinces.mjs` scarica
  l'elenco ufficiale dei comuni italiani derivato dai dati ISTAT (CC BY 3.0 IT) e lo abbina ai nostri:
  **377 abbinati su 377**, senza un solo caso incerto. Come effetto collaterale, una fonte indipendente
  conferma che i comuni della Sardegna sono 377.
- **Sono state usate le province ufficiali in vigore** (riforma del 2016), non le otto "storiche"
  (Gallura, Ogliastra, Medio Campidano, Sulcis Iglesiente): quelle non esistono più come enti e
  pubblicarle come dati amministrativi sarebbe stato scorretto.
- **Ogni pagina di provincia fa giocare davvero** su quei comuni (`/?provincia=SS`): non è contenuto
  sottile messo lì solo per i motori di ricerca, è una modalità di gioco che prima non esisteva. Chi
  cerca "comuni della provincia di Sassari" arriva, legge l'elenco e gioca con quei 92 comuni.
- **104 verifiche automatiche** in quattro suite (`npm test`): 53 sulla sfida giornaliera, 24 sui dati
  e sul raggruppamento per provincia, 9 sulla misurazione, 18 sul flusso di una partita completa.
  Le nuove controllano che i conteggi per provincia siano quelli ufficiali, che nessun comune compaia
  in due province, che una sigla inventata nell'indirizzo venga ignorata e che una partita limitata a
  una provincia peschi solo da quella provincia.

**La misurazione, accesa (Fase 0, completata)**
- **Strumento scelto: Umami**, software **libero** (MIT) e **senza cookie**. La conseguenza pratica
  più importante: **non serve il banner di consenso**, che è la principale causa di abbandono su un
  sito italiano e un obbligo in più da gestire.
- Configurato con limitazione al dominio (`data-domains`), rispetto dell'impostazione "non tracciare"
  del browser e raccolta dei tempi di caricamento. **Nessun dato personale**: niente indirizzi IP,
  niente identificativi, niente coordinate cliccate sulla mappa.
- **Le pagine dei comuni ora si misurano**: il tag viene inserito dal generatore, quindi si vedrà se
  il lavoro sulla SEO porta traffico. Senza configurazione restano senza richieste esterne.
- **Un errore trovato e corretto grazie a un test**: per Umami l'attributo che limita la misurazione
  al dominio è `data-domains`, non `data-domain`. Con il nome sbagliato non si rompe niente a occhio:
  semplicemente non misura, o misura anche le prove in locale. Ora c'è una suite dedicata (15 verifiche)
  che controlla gli attributi reali dello script inserito.
- **Informativa privacy aggiornata**: descrive le statistiche anonime, l'assenza di cookie e i servizi
  di terze parti che ricevono richieste tecniche (Firebase, Esri, Google Fonts, Umami) — prima non ne
  parlava affatto.

**Indicizzazione e condivisione**
- `index.html`: lingua italiana, titolo e descrizione reali, URL canonico, tag Open Graph e Twitter
  Card per l'anteprima su WhatsApp, dati strutturati schema.org (`WebApplication`), contenuto di
  riserva per chi non ha JavaScript, `preconnect` verso il servizio delle mappe
- rimossa la richiesta duplicata del CSS di Leaflet da CDN esterna (era già dentro il bundle)
- rimossi `maximum-scale=1, user-scalable=no` (bloccavano lo zoom: problema di accessibilità)
- creati `public/robots.txt` e `public/sitemap.xml`
- generata `public/og-image.png` (1200×630) per le anteprime di condivisione

**Peso e prestazioni** — da **3,46 MB a 1,15 MB** (-67%)
- i 4 loghi erano in realtà **PNG dentro finti SVG** (198-245 KB l'uno) mostrati a 90 pixel:
  sostituiti con `logo-t.png` (52 KB) e favicon PNG da 3,3 KB (erano 198 KB)
- spostati gli screenshot del README fuori da `public/` (1,8 MB che finivano in produzione)
- eliminati `public/index.html` (pagina del wizard Firebase), `logo.svg`, `logo-t-w.svg` e il
  `firestore-debug.log` committato per errore

**Configurazione e sicurezza**
- `firestore.rules`: riscritte. Indicavano la collezione sbagliata (`BestScores` invece di `users`):
  un deploy da repository avrebbe rotto classifica e salvataggi. Ora: lettura pubblica, scrittura solo
  sul proprio documento, punteggio intero 0-40.000 che non può diminuire, nessuna cancellazione
- `firebase.json`: rimossi i rewrite universali (qualsiasi URL rispondeva 200 con la pagina del gioco),
  aggiunti header di cache e header di sicurezza
- `.gitignore`: i file di log non finiscono più nel repository

**Codice e progetto**
- rimossi 29 `console.log` di debug da 5 file
- `package.json`: nome, descrizione, parole chiave, repository, script di deploy
- `README.md`: riscritto con lo stato reale del progetto e la dichiarazione di licenza corretta
- creato `.env.local` per lo sviluppo in locale (escluso dal repository)

**Non ancora fatto** (richiede il tuo accesso alla console Firebase): applicare `firestore.rules` in
produzione spostando i dati personali fuori dalla collezione pubblica; installare l'analytics.

## Appendice B — Fonti principali

**Mercato e ricavi**
- Revenue share AdSense (80%/68%) — Google AdSense Help: https://support.google.com/adsense/answer/180195
- Mercato digitale italiano 6,2 mld € (2025) — Osservatori Politecnico di Milano, 11/06/2026: https://www.osservatori.net/comunicato/internet-media/internet-advertising-italia-in-crescita/
- Italia 5° mercato digitale europeo — IAB Italia su IAB Europe AdEx Benchmark 2025: https://iab.it/adex-benchmark-2025-i-dati-delladvertising-europeo/
- Interstitial ~8x eCPM del banner — Playgama: https://playgama.com/blog/business-faqs/how-much-can-i-earn-from-ads/ (materiale del fornitore)
- Prezzi GeoGuessr (Pro 3,99 €/mese annuale; free = sola sfida giornaliera) — https://www.geoguessr.com/pricing e https://www.geoguessr.com/free
- JetPunk Premium (12 $/6 mesi, 20 $/anno) — https://www.jetpunk.com/premium
- Conversione freemium 2,1% (dato su app store, **non** web) — RevenueCat 2026: https://www.revenuecat.com/blog/growth/subscription-app-trends-benchmarks-2026
- Il 58% gioca sul web perché è gratis — Poki, State of Web Gaming 2026 (via Impulse Media Hub)
- Requisito di lingua inglese e pubblicità disattivata al lancio base — https://docs.crazygames.com/requirements/gameplay/ e https://docs.crazygames.com/faq/

**Prodotto, concorrenti, distribuzione**
- Formato condivisibile di Wordle come causa della popolarità — https://en.wikipedia.org/wiki/Wordle
- GeoGuessr nato da un post su Reddit nel 2013, 40 M di account — https://en.wikipedia.org/wiki/GeoGuessr
- Teuteuf Games (Worldle + WhereTaken + Statle + Travle, un solo abbonamento) — https://worldle.teuteuf.fr/
- WhatsApp usato dal 90,1% degli italiani online — DataReportal, Digital 2025 Italy
- @ig_sardinia 168.000 follower; "Sei sardo se" 15.773 like; @anemiska 77.000 like su GeoGuessr Italia — rilevati sui social
- Vistanet ha la rubrica "Quiz per sardi doc" — https://www.vistanet.it/
- Divisione dei 377 comuni per provincia — https://it.wikipedia.org/wiki/Comuni_della_Sardegna

**Mercato B2B sardo**
- 377 comuni, 39 unioni, 5 comunità montane — https://www.tuttitalia.it/sardegna/97-comuni/ e https://www.sardegnaautonomie.it/
- 17 GAL con 50 mln € — https://terraevita.edagricole.it/pac-psr-csr/sardegna-50-milioni-gal/
- Turismo 2025: 5,17 M arrivi, 21,92 M presenze; 52.147 strutture — Regione Sardegna / ISTAT
- 232 istituzioni scolastiche autonome; ~158.300 studenti 6-18 — https://www.tuttitalia.it/sardegna/86-scuole/
- Lingua sarda a scuola (L.R. 26/1997) e contributi regionali — https://www.sardegnacultura.it/ e https://sus.regione.sardegna.it/
- Grandi eventi 2026: 22,5 mln € e obbligo del 20% in promozione — https://www.regione.sardegna.it/notizie/turismo-grandi-eventi-per-il-2026-una-dotazione-finanziaria
- Autunno in Barbagia: 450.000+ visitatori — https://www.unionesarda.it/
- Prezzi guest-tech pubblici (Hoteligy 149 € + 1 €/camera/mese; YourGuestApp 49 €/mese) — https://hoteligy.com/it/prezzi/ e https://yourguestapp.com/it/pricing

**Licenze delle mappe**
- MapTiler Free: uso non commerciale — https://www.maptiler.com/cloud/pricing/
- Stadia Maps: Free senza uso commerciale; satellite 4 crediti/tessera — https://stadiamaps.com/pricing/

I due report di ricerca completi, con tutti i ~150 URL e la distinzione tra dati verificati,
deduzioni e stime, sono in questa cartella: [intzetta-analisi-b2b-sardegna.md](intzetta-analisi-b2b-sardegna.md)
e [intzetta-analisi-prodotto-distribuzione.md](intzetta-analisi-prodotto-distribuzione.md).
