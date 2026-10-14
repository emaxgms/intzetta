# Intzetta — Analisi di prodotto, competitor e canali di crescita

**Oggetto:** `Intzetta` (https://github.com/emaxgms/intzetta) — GeoGuessr "al contrario" limitato ai comuni della Sardegna.
**Data dell'analisi:** ricerca effettuata con `web_fetch` su fonti primarie e secondarie (URL citati in linea).
**Autore:** analisi di prodotto e distribuzione.

---

## 0. Nota metodologica e sull'affidabilità dei dati (leggere prima)

**Limite tecnico incontrato:** il tool di ricerca web di questa sessione (`web_search`) non era disponibile (nessuna API key configurata). Ho quindi condotto la ricerca con **fetch diretto di URL** (siti ufficiali, Wikipedia, pagine prodotto) e con **motori di ricerca fetch-ati** (DuckDuckGo HTML/Lite, Bing). Conseguenze pratiche:

- **Non ho potuto accedere a Google Trends** (l'endpoint restituisce HTTP 429 a richieste automatizzate, verificato direttamente su `https://trends.google.com/trends/explore?geo=IT&q=quiz%20sardegna,geoguessr,quiz%20geografia` → `429 Too Many Requests`). **Nessun dato di volume di ricerca reale è quindi presente in questo report.**
- **Non ho potuto accedere a Reddit** via API/old.reddit (HTTP 403 / redirect a login): i numeri di iscritti ai subreddit sardi **non sono verificati**.
- **Non ho potuto accedere ad AppBrain** (HTTP 403, protezione anti-bot): i numeri di download delle app concorrenti **non sono verificati**.
- **Non ho potuto leggere il testo completo dell'articolo CNET su Worldle** (paywall/JS): il riferimento resta la citazione bibliografica Wikipedia.

**Convenzione usata in tutto il documento:**

| Marca | Significato |
|---|---|
| ✅ **FATTO** | Verificato su fonte primaria o secondaria citata con URL, letto direttamente in questa sessione |
| 🟡 **INFERENZA** | Deduzione mia, plausibile ma non verificata |
| 🔴 **IPOTESI / STIMA** | Mio giudizio quantitativo: **da validare con tool a pagamento** (Semrush, Ahrefs, Ubersuggest) prima di prendere decisioni di budget |

**Attenzione:** tutte le stime di volume keyword nella Sez. 3 sono 🔴 **STIME MIE**, costruite su segnali indiretti (esistenza e posizionamento di pagine concorrenti, presenza di quiz analoghi su piattaforme ad alto traffico). **Non sono dati di tool.** Vanno trattate come ordine di grandezza per prioritizzare, non come numeri di pianificazione.

---

## 1. Analisi competitor e prodotti affini

### 1.1 GeoGuessr — il benchmark di categoria

**Cosa fa.** Gioco di geografia in cui il giocatore viene "droppato" in una Street View panoramica casuale e deve localizzarsi sulla mappa. Modalità: Classic (5 round, max 5.000 punti/round → 25.000 a partita), Battle Royale, Duels, Team Duels, Streaks, Explorer Mode, Campaign, Tournaments. Difficoltà: *Moving*, *No Move*, *NMPZ* (No Move Pan Zoom). ✅ Fonte: [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr).

**Origine.** Ideato dall'IT consultant svedese **Anton Wallén**, rilasciato l'**8 maggio 2013**, sviluppato in circa **due settimane** con Backbone.js + Google Maps API. Prima distribuzione: **post su Reddit** nell'aprile 2013 ("was fiddling around with Backbone and Google Maps API v3 and decided to make a small application") e poi pubblicazione su **Google Chrome Experiments** il 10 maggio 2013. ✅ Fonte: [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr).

> **Lezione n.1 per Intzetta:** GeoGuessr non è nato da un piano di marketing: è nato da un post su Reddit in cui lo sviluppatore chiedeva feedback. Il primo canale è la community tecnica, non la pubblicità.

**Business model e prezzi (verificati in questa sessione).**

| Tier | Prezzo mensile | Prezzo annuale | Note |
|---|---|---|---|
| Free | €0 | — | Solo **Daily Challenge** (5 location, refresh giornaliero) + mappe community limitate; richiede sign-up per giocare la daily |
| **Pro** | €6,99 → **€3,99/mese** (sconto ~43%) | **€47,88/anno** | Sconto annuale "fino al 45%" |
| **Pro Elite** ("Best value") | €10,99 → **€5,99/mese** | **€71,88/anno** | Avatar, flair, emote, coin loot mensili, companion |

✅ Fonti: [geoguessr.com/pricing](https://www.geoguessr.com/pricing), [geoguessr.com/free](https://www.geoguessr.com/free).

Caratteristiche chiave del paywall, lette direttamente sulle pagine ufficiali:
- Il **Daily Challenge è l'unica modalità gratuita** ("5 locations, refreshed daily. Can you keep your streak?"), ma il pulsante è "**Sign-up and play**" → ✅ [geoguessr.com/free](https://www.geoguessr.com/free)
- Tutto il resto è esplicitamente etichettato "**Included in subscription**": Explore the globe (1000+ mappe), multiplayer/duels, party, custom maps, avatar shop. ✅ ibid.
- Il piano Pro sblocca: **ad-free**, **unlimited play**, private parties, creator mode, community play, Steam, map collaboration. ✅ [geoguessr.com/pricing](https://www.geoguessr.com/pricing)
- Il tier gratuito è deliberatamente **stretto**: "Users may play GeoGuessr without a subscription with limited functionality, which means they can only play a certain amount freely, and do not have access to custom maps or the competitive game modes." ✅ [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr)

**Monetizzazione aggiuntiva:** merchandising ([shop.geoguessr.com](https://shop.geoguessr.com)), gift card ([geoguessr.com/gift-card](https://www.geoguessr.com/gift-card)), offerta B2B/**Organizations** per aziende ("With a GeoGuessr Pro subscription, you can invite people without subscriptions to play with you in a party or challenge"), programma **Partnerships** (cultura, lifestyle, travel, entertainment, sport, musica, education, tech), un **libro** pubblicato nel 2026, e il **GeoGuessr World Championship**. ✅ Fonti: [geoguessr.com](https://www.geoguessr.com/), [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr).

**Scala dichiarata.** Il sito ufficiale afferma "**Join 100 million players today!**", disponibilità su **Web, Steam, iOS e Android**, rating "4.5/5 in App Store", e **11 lingue** (incluso l'italiano, con sito localizzato su [geoguessr.com/it](https://www.geoguessr.com/it)). ✅ [geoguessr.com](https://www.geoguessr.com/). Wikipedia documenta **40 milioni di account giocatore a luglio 2022**. ✅ [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr).

> Nota di cautela 🟡: "100 million players" è un claim di marketing cumulativo (probabilmente visite/account storici, non utenti attivi mensili). Non usarlo come dato di mercato.

**Strategia di crescita — questa è la parte più importante per Intzetta.** ✅ [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr) documenta che:
- Il lancio del maggio 2013 fu descritto come **istantaneamente virale**, "insanely addictive".
- L'inizio della **pandemia COVID-19** innescò un **rinnovato interesse**, con un **secondo picco a marzo 2021**.
- L'interesse è stato **propagato su Reddit, YouTube, TikTok e Twitch** da creator come **Ludwig, i Sidemen, GeoWizard, LazarBeam e Rainbolt**.
- Esiste una **scena competitiva** strutturata, culminata nel **GeoGuessr World Championship**, tenuto annualmente dal 2023 con **prize pool crescenti**.
- La community ha creato risorse educative proprie (es. **plonkit.net**) per documentare le "mete" (indizi ricorrenti: pali, chevron, targhe, vegetazione, posizione del sole).

**Seterra.** Acquisita da GeoGuessr **nel 2022**; è la piattaforma di quiz geografici con "**oltre 400 quiz personalizzabili**" su paesi, capitali, bandiere, oceani, laghi. Oggi è integrata come modalità dentro GeoGuessr (`/quiz/seterra`, `/vgp/<id>`). ✅ Fonti: [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr), [geoguessr.com](https://www.geoguessr.com/).

> **Lezione n.2:** GeoGuessr ha comprato la propria porta d'ingresso educational (Seterra) invece di costruirla. Lo spazio "quiz di geografia per la scuola" è **dimostrato monetizzabile**.

**Community italiana GeoGuessr (esiste già, ed è piccola).**
- Canale YouTube **@geoguessritalia** — "Il canale YouTube della community italiana di GeoGuessr". ✅ [youtube.com/@geoguessritalia](https://www.youtube.com/@geoguessritalia)
- **@geoguessritalia** su Instagram — **815 follower**, 6 post. ✅ [instagram.com/geoguessritalia](https://www.instagram.com/geoguessritalia/)
- Linktree ufficiale della community: ✅ [linktr.ee/geoguessritalia](https://linktr.ee/geoguessritalia)
- Presence TikTok: creator **@anemiska** (Nemiski) con video su GeoGuessr in Italia — un video "Un viaggio attraverso l'Italia in Geoguessr" con **77K like** e **278 commenti**; un altro con **4.060 like**. ✅ [tiktok.com/@anemiska/video/7403403705300700448](https://www.tiktok.com/@anemiska/video/7403403705300700448), [tiktok.com/@anemiska/video/7401933809664544033](https://www.tiktok.com/@anemiska/video/7401933809664544033)
- Hashtag **#geoguessr** su TikTok: **92K post**. ✅ [tiktok.com/tag/geoguessr](https://www.tiktok.com/tag/geoguessr)

> **Lezione n.3 (molto concreta):** la community GeoGuessr italiana esiste ma è minuscola (815 follower su IG) mentre i contenuti GeoGuessr "Italia" su TikTok fanno **decine di migliaia di like**. C'è **domanda di contenuto geografico italiano**, ma **nessuno la sta servendo con un prodotto dedicato**. Questo è esattamente lo spazio di Intzetta, e `@anemiska` + `@geoguessritalia` sono i primi due account da contattare.

---

### 1.2 Worldle e i cloni Wordle della geografia

**Worldle** (worldle.teuteuf.fr) — il clone geografico di Wordle, e il caso più istruttivo.

| Dimensione | Dato verificato | Fonte |
|---|---|---|
| Creatore | **Antoine Teuf**, sviluppatore web francese (handle "teuteuf") | ✅ [Wikipedia EN — Worldle](https://en.wikipedia.org/wiki/Worldle), [worldle.teuteuf.fr](https://worldle.teuteuf.fr/) |
| Lancio | **Gennaio 2022** | ✅ [Wikipedia EN — Worldle](https://en.wikipedia.org/wiki/Worldle) |
| Meccanica | Indovina il paese dalla **sagoma**; 6 tentativi; feedback con **distanza (km), freccia direzionale (8 direzioni), percentuale di prossimità** | ✅ [worldle.teuteuf.fr](https://worldle.teuteuf.fr/) |
| Rinnovo | Nuovo puzzle ogni giorno a **mezzanotte ora locale** | ✅ ibid. |
| Selezione | Paesi <5.000 km² non si ripetono entro 7 giorni; nessun paese si ripete entro 100 giorni; no continenti uguali in giorni consecutivi | ✅ ibid. |
| Bonus | Round extra: vicini, capitale, bandiera, trivia | ✅ ibid. |
| **Condivisione** | **Griglia di quadrati colorati senza spoiler**: 🟩=20%, 🟨=10%, ⬛=riempimento (5 quadrati totali, percentuale arrotondata per difetto alla decina). Es. 72% → 🟩🟩🟩🟨⬛ | ✅ ibid. |
| **Monetizzazione** | **Pubblicità** sul gioco gratuito ("Ads help cover development costs...") + **Premium Membership** per **archivio** e statistiche cross-device | ✅ ibid. |
| Piattaforme | Web + app iOS ([App Store id6505002321](https://apps.apple.com/app/apple-store/id6505002321)) + Android ([Play Store fr.teuteuf.worldle.twa](https://play.google.com/store/apps/details?id=fr.teuteuf.worldle.twa)) | ✅ ibid. |
| Social | Facebook, **TikTok (@teuteufgames)**, Instagram — tutti linkati dal sito | ✅ ibid. |
| Copertura stampa | Washington Post (16/02/2022), Forbes (17/02/2022), PC Gamer (15/02/2022), NewsNation (15/02/2022), CNET | ✅ [Wikipedia EN — Worldle](https://en.wikipedia.org/wiki/Worldle) (sezione References) |

**⚠️ Correzione importante rispetto al briefing.** Il brief dice che Worldle è "il Wordle dei paesi" — vero — ma **non è più gestito dal suo creatore**: il sito dichiara esplicitamente "*While Antoine no longer runs the game, the Teuteuf company has continued to grow*". ✅ [worldle.teuteuf.fr](https://worldle.teuteuf.fr/). È diventato un **studio di giochi geografici** ("Teuteuf Games") con un portfolio.

**Il portfolio Teuteuf (la vera lezione strategica).** Teuteuf non ha fatto un gioco: ha fatto **una piattaforma di giochi quotidiani geografici**:
- **Worldle** — indovina il paese dalla sagoma ✅ [worldle.teuteuf.fr](https://worldle.teuteuf.fr/)
- **WhereTaken** — "GUESS WHERE A PHOTO WAS TAKEN": foto reale, piazzi il pin sulla mappa, daily + archive + community, **"Remove ads" con un Passport** (subscription). ✅ [wheretaken.com](https://wheretaken.com/)
- **Statle** — "Guess the State!" (stati USA). ✅ [statele.teuteuf.fr](https://statele.teuteuf.fr/)
- **Travle** (travle.earth), linkato da Worldle come gioco gemello. ✅ [worldle.teuteuf.fr](https://worldle.teuteuf.fr/)

Tutti con: **stessa meccanica di condivisione spoiler-free**, **stesso account**, **stessa subscription**, **stesso hub** (`/teuteuf-games`). I profili social sono **condivisi** tra i giochi.

> **Lezione n.4 — la più actionable per Intzetta:** il modello vincente non è "un gioco", è **"un hub di giochi quotidiani sullo stesso dominio, con un unico account e un'unica share string"**. Intzetta dovrebbe nascere già pensando a `Sardegna → Italia → regioni`, con Intzetta come primo gioco e non come prodotto isolato.

**Wordle — la meccanica di condivisione, spiegata dalla fonte.**

| Dato | Valore | Fonte |
|---|---|---|
| Creatore | **Josh Wardle** (software engineer gallese) | ✅ [Wikipedia EN — Wordle](https://en.wikipedia.org/wiki/Wordle) |
| Rilascio pubblico | **Ottobre 2021** | ✅ ibid. |
| Partite giocate | **4,8 miliardi durante il 2023** | ✅ ibid. |
| Lista parole | Curata a **2.309 parole** (da ~13.000 iniziali) da **Palak Shah**, partner di Wardle | ✅ ibid. |
| **Origine della viralità** | "*It gained widespread popularity in late 2021 after the introduction of a shareable emoji-based results format, which led to viral discussion on social media*" | ✅ ibid. |
| Formato share | `Wordle 196 4/6` + righe di ⬜️🟨🟩 — **nessuna lettera, nessuno spoiler** | ✅ ibid. (immagine `Wordle_Emoji_Screenshot.png`) |
| Acquisizione NYT | **Gennaio 2022**, "low seven-figure sum" (>1 M$) | ✅ ibid. |
| Editor | **Tracy Bennett**, prima editor del gioco, da novembre 2022 | ✅ ibid. |
| Altri media | Gioco da tavolo **Hasbro** (2022); game show **NBC** prime time annunciato a maggio 2026, in onda dal 2027, condotto da **Savannah Guthrie** | ✅ ibid. |

**Perché il formato share ha funzionato — analisi delle fonti.** Analisi secondarie convergono su tre ragioni, tutte replicabili:
1. **Non spoilera nulla** → chi lo vede non è "bruciato" e può giocare. "*a viral mechanic that worked because it leaked nothing*" ✅ [dinogame.gg/blog/why-wordle-blew-up](https://dinogame.gg/blog/why-wordle-blew-up/)
2. **Esperienza condivisa e sincrona** → un puzzle per tutti, stesso giorno: "*Shared experience through universal content (one puzzle for everyone) creates communal context that makes sharing meaningful rather than arbitrary*" ✅ [nichemetric.com](https://www.nichemetric.com/blog/wordle-free-game-nyt-acquisition-case-study)
3. **Scarsità e ritualità** → "*one quick puzzle each day, so it felt easy to join and hard to overdo. That daily limit built anticipation and gave users a reason to come back*" ✅ [getnoise.com/q/why-did-wordle-go-viral](https://getnoise.com/q/why-did-wordle-go-viral)

Sulla crescita: "*from a few thousand players in November to 300,000+ by early January 2022 to 3M+ by late January. The growth was driven entirely by the daily-share mechanic*" — 🔴 **attenzione: questa è una fonte SEO/blog di terze parti, non una fonte primaria. Il dato numerico (300K → 3M+) è plausibile e coerente con la copertura stampa del periodo, ma non l'ho verificato su fonte primaria.** ✅ URL: [realgrowthmatters.com/learn/case-studies/wordle-nyt-acquisition](https://realgrowthmatters.com/learn/case-studies/wordle-nyt-acquisition/)

**Altri giochi quotidiani geografici rilevanti:**
- **Globle** (globle.org) — "hot/cold" sui paesi, ispirato a Wordle, **63,5K recensioni** secondo il risultato di ricerca. ✅ [globle.org](https://globle.org/)
- **GeoDle** (geodle.org/it) — indovina il paese da **indizi progressivi** (regione, popolazione, superficie, distanza); ha anche una modalità "Sagome". ✅ [geodle.org/it](https://geodle.org/it), [geodle.org/it/outline](https://geodle.org/it/outline)
- **GeoRankle** (georankle.io/it) — giochi di **classifica** geografica quotidiana (ordina per PIL, popolazione) + 6 altri giochi. ✅ [georankle.io/it](https://georankle.io/it)
- **Geo Games / GeoFun Games** (geogames.io/it, geofungames.com/it) — **hub multi-gioco** con localizzazione italiana completa, incluse **"Geo Sfida Quotidiana"** ("*Ogni giorno (UTC), tutti nel mondo ricevono lo stesso paese nascosto*") e collezioni **"Indovina la Città"** "su mappe di diversi paesi **e regioni**". ✅ [geofungames.com/it](https://www.geofungames.com/it), [geofungames.com/it/games/daily-challenge](https://www.geofungames.com/it/games/daily-challenge), [geofungames.com/it/games/guess-the-city](https://www.geofungames.com/it/games/guess-the-city)
- **MapGuesser** (mapguesser.fr/it) — multiplayer fino a 8 giocatori, senza account, localizzato in italiano. ✅ [mapguesser.fr/it/game](https://mapguesser.fr/it/game)
- **GeoGuessr cloni gratuiti:** WorldGuessr (worldguessr.com, con daily gratuita "three Street View locations, 60 seconds each, one attempt a day, no account needed" e mappe per paese tra cui [Italia](https://www.worldguessr.com/map/italia)), OpenGuessr (openguessr.com), GeoGuesser.net, Geogame.net. ✅ URL citati.
- **Wordle in italiano** — molteplici cloni localizzati già attivi e posizionati: wordly.org/it, wordle.global/it, wordle.me/it, oltre alla **directory Relaydle** (`relaydle.com/it/`) che organizza i giochi quotidiani **in italiano** per categoria ("geografia, calcio, musica...**ordinati in base a cosa si gioca davvero**"). ✅ URL citati.

> **Lezione n.5:** esiste un **ecosistema consolidato di giochi quotidiani localizzati in italiano**, con directory che li indicizzano (Relaydle). Entrare in queste directory è un canale di lancio a costo zero e immediato.

---

### 1.3 Seterra, JetPunk e i quiz geografici "classici"

**Seterra** — quiz geografici a mappa, 400+ quiz personalizzabili, **acquisita da GeoGuessr nel 2022** e integrata come modalità quiz. Oggi è il braccio "educational/quiz" di GeoGuessr. ✅ [Wikipedia EN — GeoGuessr](https://en.wikipedia.org/wiki/GeoGuessr), [geoguessr.com](https://www.geoguessr.com/)

**JetPunk** — enorme piattaforma di quiz generati dagli utenti, con forte presenza di quiz italiani.
- Dato di traffico verificato: "*The top traffic source to jetpunk.com is **Direct traffic, driving 53.34% of desktop visits** last month. Organic Search is the 2nd and Organic Social is the 3rd.*" ✅ [similarweb.com/website/jetpunk.com](https://www.similarweb.com/website/jetpunk.com/)
- 🟡 **Inferenza importante:** JetPunk cresce soprattutto su **traffico diretto** — cioè su un **pubblico che torna per abitudine**, non su SEO. Questo suggerisce che la fedeltà in questo genere si costruisce con l'abitudine (daily, streak), non solo con le keyword.
- Contenuti sardi già presenti, **generati da utenti**:
  - "**Comuni della Sardegna (con mappa)**" di utente *ThomasAndersonn* ✅ [jetpunk.com/user-quizzes/183621/comuni-della-sardegna-con-mappa](https://www.jetpunk.com/user-quizzes/183621/comuni-della-sardegna-con-mappa)
  - "**Quiz sulla Sardegna**" (cultura generale) ✅ [jetpunk.com/user-quizzes/73781/quiz-sulla-sardegna](https://www.jetpunk.com/user-quizzes/73781/quiz-sulla-sardegna)
  - "**Indovina la regione italiana dall'immagine**" ✅ [jetpunk.com/user-quizzes/1968512](https://www.jetpunk.com/user-quizzes/1968512/indovina-la-regione-italiana-dall-immagine)
- ⚠️ **Ma**: i quiz JetPunk sulla Sardegna chiedono di **digitare nomi** o rispondere a domande, **non di cliccare un punto su una mappa**. La meccanica di Intzetta (**localizzazione spaziale**) **non è coperta** da JetPunk. ✅ verificato leggendo le descrizioni dei quiz.

**PurposeGames** — quiz a mappa con worksheet stampabili; ha quiz **"Comuni della Sardegna"** e **"Sardegna – Province e Comuni"** (6 domande). ✅ [purposegames.com/game/comuni-della-sardegna](https://www.purposegames.com/game/comuni-della-sardegna), [purposegames.com/game/a3b12315de](https://www.purposegames.com/game/a3b12315de)

---

### 1.4 Giochi geografici italiani e prodotti sulla Sardegna

**Domanda centrale del brief: "esiste già qualcosa di identico o molto simile per la Sardegna o per altre regioni italiane?"**

**Risposta: NO per la meccanica specifica (click sulla mappa di un comune sardo). SÌ per il tema "quiz sulla Sardegna".**

**Verifica condotta.** Ho cercato con query mirate ("indovina il comune", "comuni guessr", "trova il comune" + gioco/quiz/mappa, "geoguessr Sardegna", "quiz Sardegna comuni"). Risultati:

| Prodotto | Cosa fa | È un concorrente di Intzetta? | Fonte |
|---|---|---|---|
| **Divario Italia — "Indovina la Regione"** | ✅ *"Indovina la regione italiana misteriosa a partire da sei indicatori Istat. **Una sfida al giorno**, indizi progressivi e un profilo completo a fine partita."* | ⚠️ **SÌ, parzialmente**: è un **gioco quotidiano italiano** su geografia italiana, ma su **dati statistici**, non su mappa | ✅ [divarioitalia.it/quiz/indovina-la-regione](https://divarioitalia.it/quiz/indovina-la-regione) |
| **GeoGuessr — mappe Italia / Sardegna** | Mappe community sull'Italia (street view), wiki ufficiale sulle regioni italiane | ⚠️ SÌ ma indiretto: street view, non nomi di comuni; e la Sardegna è una delle 20 regioni | ✅ [geoguessr.com/it/maps/italy](https://www.geoguessr.com/it/maps/italy), [reddit.com/r/geoguessr/wiki/italy](https://www.reddit.com/r/geoguessr/wiki/italy/) |
| **Seterra (GeoGuessr) — Italia: Regioni** | Quiz a mappa sulle 20 regioni italiane | ❌ No: livello regioni, non comuni | ✅ [geoguessr.com/it/vgp/3092](https://www.geoguessr.com/it/vgp/3092) |
| **Wordwall — "QUIZ SARDEGNA"** (2+ risorse) | Quiz a risposta multipla su geografia della Sardegna, **creati da insegnanti**, per Primaria | ❌ No: quiz a domande, non localizzazione su mappa | ✅ [wordwall.net/it/resource/70295957](https://wordwall.net/it/resource/70295957/quiz-sardegna), [wordwall.net/it/resource/3156609](https://wordwall.net/it/resource/3156609/geografia/quiz-sardegna) |
| **Wordwall — community "Geografia Sardegna"** | Hub di risorse didattiche sulla Sardegna | ❌ No, ma **canale di distribuzione** | ✅ [wordwall.net/it-it/community/geografia/sardegna](https://wordwall.net/it-it/community/geografia/sardegna) |
| **"Comuni della Sardegna" (JetPunk / PurposeGames)** | Digitare/abbinare i nomi dei comuni | ❌ No: nessuna mappa cliccabile, nessun punteggio per distanza | ✅ (Sez. 1.3) |
| **Play Store — "Le regioni d'Italia – Quiz"** (`com.asmolgam.italy`) | Quiz su regioni, capoluoghi, bandiere, posizione sulla mappa. Impara le 20 regioni **inclusa la Sardegna** | ❌ No: 20 regioni, multipla | ✅ [play.google.com/store/apps/details?id=com.asmolgam.italy](https://play.google.com/store/apps/details?id=com.asmolgam.italy&hl=it) |
| **Play Store — "Quiz Geografia Italia" / "Mappa dell'Italia"** (`com.mappadellitalia.geografiadellitalia`) | "*gioco di geografia italiana, un quiz divertente con domande e test su tutto ciò che riguarda la divisione politica e geografica del Paese... regioni, province, capitali, città*" | ❌ No: quiz a domande | ✅ [play.google.com/store/apps/details?id=com.mappadellitalia.geografiadellitalia](https://play.google.com/store/apps/details?id=com.mappadellitalia.geografiadellitalia&hl=it) |
| **Play Store — "Quiz delle Regioni e Province"** (`air.com.gamesaien.italyregionsandprovincesmapquiz`) | Quiz a mappa su regioni e province, separate per regione | ⚠️ Vicino per UI (mappa + quiz) ma livello provincia, non comune | ✅ [play.google.com/store/apps/details?id=air.com.gamesaien.italyregionsandprovincesmapquiz](https://play.google.com/store/apps/details?id=air.com.gamesaien.italyregionsandprovincesmapquiz&hl=it) |
| **Play Store — "Quiz Italia – Province e città"** (`fr.ivaska.province_italia`) | Trova province e città sulla mappa d'Italia | ⚠️ Vicino, ma province/città principali, non i 377 comuni sardi | ✅ [play.google.com/store/apps/details?id=fr.ivaska.province_italia](https://play.google.com/store/apps/details?id=fr.ivaska.province_italia&hl=it) |
| **TikTok @lasarda81 — "Sardegna: indovina la città sarda!"** | Contenuto social di trivia su città sarde | ⚠️ **Concorrenza di attenzione**, non di prodotto. Rilevante come **influencer da contattare** | ✅ [tiktok.com/@lasarda81/video/7617442383671594262](https://www.tiktok.com/@lasarda81/video/7617442383671594262) |
| **Vistanet — "Quiz per sardi doc: riuscite a indovinare in quale spiaggia... ci troviamo?"** | Format editoriale ricorrente di testate sarde | ⚠️ **Concorrenza di attenzione + canale media** | ✅ [vistanet.it/cagliari/2026/04/30/...](https://www.vistanet.it/cagliari/2026/04/30/quiz-per-sardi-doc-riuscite-a-indovinare-in-quale-spiaggia-ancora-selvaggia-ci-troviamo/) |
| **SardegnaTurismo (Regione Sardegna)** | Sito ufficiale del turismo regionale | ❌ Non un gioco, ma **partner istituzionale potenziale** | ✅ [sardegnaturismo.it](https://www.sardegnaturismo.it/it) |

**Verifica negativa importante (segnala un vuoto di mercato).** La ricerca Bing per `"trova il comune" gioco quiz comune italiano mappa` restituisce **291.000 risultati di cui i primi 10 sono Trovaprezzi, TrovaCasa, idealista, Subito, trivago, Google Maps, Treccani** — cioè **nessun gioco**. ✅ [risultato Bing](https://www.bing.com/search?q=%22trova+il+comune%22+gioco+quiz+comune+italiano+mappa&setlang=it&cc=IT).
Analogo per `"Indovina il Comune" OR "Comuni Guessr"`: "Circa **50 risultati**", di cui i primi sono thread Stack Overflow su Bing Visual Search. ✅ [risultato Bing](https://www.bing.com/search?q=%22Indovina+il+Comune%22+OR+%22Comuni+Guessr%22&setlang=it&cc=IT).

> 🟡 **INFERENZA (fondata ma da validare):** **non esiste un "GeoGuessr dei comuni italiani"**. Chi cerca "trova il comune" oggi non trova **niente** di pertinente. Il termine "Comuni Guessr" non esiste come prodotto. Significa due cose contemporaneamente: **(a) spazio libero**, **(b) nessuna domanda già espressa** — quindi va *creata* l'abitudine, non intercettata. È un dato che taglia in due direzioni e va letto con onestà.

**Quanto sono usati questi prodotti?** Questa è la domanda a cui **non posso rispondere con dati verificati**: AppBrain (403) e Google Trends (429) erano inaccessibili. 🟡 **Stima qualitativa dalla lettura dei risultati di ricerca:** il quiz sardo più visibile è su JetPunk (piattaforma grande, singolo quiz utente), seguito da Wordwall (risorse di insegnanti singoli, centinaia di visualizzazioni ciascuna, non milioni). 🔴 **Non ci sono segnali di un prodotto sardo dedicato con trazione significativa.** Le app Play Store italiane di quiz geografici hanno volumi di installazione che non ho potuto verificare.

**Dato di contesto sulla domanda di contenuti sardi (verificato).**
- **@ig_sardinia** su Instagram: **168K follower**, 3.108 post, "COMUNITÀ UFFICIALE SARDA — Dal 2012 celebriamo la nostra terra" ✅ [instagram.com/ig_sardinia](https://www.instagram.com/ig_sardinia/)
- **"Sei sardo se"** — pagina Facebook con **15.773 like** ✅ [facebook.com/seisardosepage](https://www.facebook.com/seisardosepage/)
- Esistono **almeno 4 gruppi Facebook** con nome "Sei sardo se..." ✅ [groups/seisardose](https://www.facebook.com/groups/seisardose/), [groups/640614692652748](https://www.facebook.com/groups/640614692652748/), [groups/891587478163559](https://www.facebook.com/groups/891587478163559/), [groups/1135908483090170](https://www.facebook.com/groups/1135908483090170/)
- **TikTok**: @instasardegna, @sardegnatiktok, @lasarda81 — account attivi su contenuti sardi ✅ URL citati
- **Stampa di settore**: "La Sardegna si conferma sempre più al centro dei social network, trasformandosi in una delle destinazioni più raccontate e condivise da travel creator" ✅ [cagliaripad.it/674250](https://www.cagliaripad.it/674250/sardegna-regina-dei-social-boom-di-travel-creator-e-video-virali-dalle-spiagge/)
- Esistono persino **classifiche di influencer sardi** (Kolsquare, Narame Agency, Influenxer) ✅ [kolsquare.com](https://www.kolsquare.com/it/top-influencers/i-top-instagrammer-sardi-secondo-kolsquare), [narameagency.com](https://www.narameagency.com/influencer-sardegna-2025-content-creator/)

> **Lezione n.6:** la **domanda di contenuto identitario sardo è dimostrata e grande** (168K follower su un solo account IG, decine di migliaia di like su TikTok). Ma è **domanda di contenuto passivo** (guardare foto di spiagge), non di **gioco attivo**. Intzetta deve convertire "orgoglio sardo" in "voglia di mettersi alla prova" — che è esattamente ciò che fa un quiz identitario ben fatto.

---

## 2. Sintesi competitiva

### (a) TABELLA CONCORRENTI

| # | Prodotto | Cosa fa | Come cresce | Come monetizza | Minaccia per Intzetta |
|---|---|---|---|---|---|
| 1 | **GeoGuessr** [↗](https://www.geoguessr.com/) | Street View → localizzati; Classic/Duels/Battle Royale/Streaks | 🔥 **Streamer & YouTube** (Ludwig, Sidemen, GeoWizard, LazarBeam, Rainbolt), Reddit, TikTok, Twitch; COVID 2020 come secondo motore; World Championship dal 2023; acquisizione Seterra 2022 | **Subscription**: Pro €3,99–6,99/mese, €47,88/anno; Elite €5,99–10,99/mese, €71,88/anno; merch, gift card, B2B Organizations, partnerships, libro | 🟡 **Bassa** (street view globale, paywall, nessun focus sardo) — ma **occupa la keyword "GeoGuessr"** e ha la community IT |
| 2 | **Worldle** [↗](https://worldle.teuteuf.fr/) | Indovina paese dalla sagoma, 6 tentativi, daily | Stampa globale (WaPo, Forbes, PC Gamer, CNET), share spoiler-free, mobile app | **Ads + Premium** (archivio) | 🟢 **Bassa** (scala mondiale, silhouette) — **alto valore come modello** |
| 3 | **Teuteuf Games** (Worldle+WhereTaken+Statle+Travle) [↗](https://wheretaken.com/) | **Hub di giochi quotidiani geografici** | Portfolio condiviso, account unico, social condivisi, share identica | Ads + **Passport/subscription** unica per tutti i giochi | 🟡 **Media come modello organizzativo**: è la strategia che Intzetta dovrebbe copiare |
| 4 | **Wordle** [↗](https://www.nytimes.com/games/wordle) | 5 lettere, 6 tentativi, 1/giorno | 🔥 **Emoji grid condivisibile, senza link e senza spoiler** → crescita virale organica | Gratis (NYT lo usa come **acquisizione abbonati**); acquisito per >1 M$; 4,8 mld partite nel 2023 | 🟢 **Bassa** (parole) — **massimo valore come modello di condivisione** |
| 5 | **Seterra** [↗](https://www.geoguessr.com/quiz/seterra) | 400+ quiz geografici a mappa | Educational, scuole, SEO sui quiz per paese/regione | Assorbito in GeoGuessr subscription | 🟡 **Media su SEO educativo**: occupa le SERP dei quiz geografici per scuola |
| 6 | **JetPunk** [↗](https://www.jetpunk.com/) | Quiz utente, incl. "Comuni della Sardegna (con mappa)" | **53,3% traffico diretto** → abitudine e brand, non SEO; UGC | Ads/pubblicità | 🟡 **Media**: ha già un quiz sui comuni sardi indicizzato e con storia di dominio |
| 7 | **Globle** [↗](https://globle.org/) | Hot/cold sui paesi, daily | Clone Wordle, 63,5K recensioni | Ads | 🟢 Bassa |
| 8 | **GeoDle** [↗](https://geodle.org/it) | Indovina paese da indizi progressivi + sagome, daily | SEO internazionale (IT localizzato), hub | Ads | 🟢 Bassa |
| 9 | **GeoRankle** [↗](https://georankle.io/it) | Classifiche geografiche quotidiane, 7 giochi | Hub multi-gioco + SEO localizzata | n.d. | 🟢 Bassa |
| 10 | **GeoFun Games** [↗](https://www.geofungames.com/it) | Hub: Geo Sfida Quotidiana, Indovina la Città ("anche per regioni"), lezioni per regione | SEO massiccia: "Lezioni di geografia gratuite **per regione**", mini-quiz per ogni lezione | n.d. (probabile ads) | 🟠 **ALTA sul SEO**: stanno già costruendo pagine "per regione" con quiz. È **esattamente** la strategia SEO suggerita nella Sez. 3 |
| 11 | **MapGuesser** [↗](https://mapguesser.fr/it/game) | Multiplayer fino a 8, no account | Multiplayer virale, localizzato IT | n.d. | 🟢 Bassa |
| 12 | **WorldGuessr** [↗](https://www.worldguessr.com/) | GeoGuessr gratis, illimitato, **daily senza account**, mappe per paese incl. [Italia](https://www.worldguessr.com/map/italia) | "Free alternative a GeoGuessr" = intercetta il **paywall backlash** | Ads/premium | 🟠 **Media-alta**: la sua pagina `/map/italia` compete sul SEO "geoguessr italia" |
| 13 | **Divario Italia — Indovina la Regione** [↗](https://divarioitalia.it/quiz/indovina-la-regione) | **Gioco quotidiano italiano** su regioni da indicatori Istat | SEO + novelty (dati Istat) | n.d. | 🟠 **ALTA**: è il concorrente italiano più vicino per **formato** (daily + Italia). Tema diverso (dati, non mappa) |
| 14 | **Wordwall (QUIZ SARDEGNA e community "Geografia Sardegna")** [↗](https://wordwall.net/it-it/community/geografia/sardegna) | Quiz didattici **creati da insegnanti** sulla Sardegna | Adozione scolastica, passaparola tra docenti | Freemium (piani scuola) | 🟡 **Media sui contenuti**, ma è anche **il canale più facile** (Sez. 4) |
| 15 | **Play Store: regioni/province/città d'Italia** (`com.asmolgam.italy`, `air.com.gamesaien.*`, `fr.ivaska.province_italia`) | Quiz a mappa su regioni/province/città italiane | ASO Play Store, recensioni, gratis con ads | Ads / IAP | 🟡 **Media su mobile**: occupano lo store con "quiz geografia Italia". **Nessuno fa i comuni sardi** |
| 16 | **TikTok/IG Sardegna** (@ig_sardinia 168K, @lasarda81, @sardegnatiktok, @instasardegna) + **"Sei sardo se"** (FB page 15,8K, 4 gruppi) | Contenuto identitario sardo | Contenuto nativo, community, algoritmo | Ads/brand deal | 🟢 **Non concorrenti: CANALI.** Sono la principale leva di lancio |
| 17 | **Vistanet, L'Unione Sarda, La Nuova Sardegna, SardiniaPost, CagliariPad** | Testate locali, format "quiz per sardi doc" | Editoria locale, social | Ads, abbonamenti | 🟢 **Non concorrenti: CANALI** (e hanno già un format quiz ricorrente → aggancio perfetto) |

### Il posizionamento in una frase

> **Intzetta è il primo gioco italiano di localizzazione spaziale su mappa applicato ai 377 comuni di una regione.** ✅ I 377 comuni sono verificati: *"I comuni della Sardegna... Sono 377"* — [it.wikipedia.org/wiki/Comuni_della_Sardegna](https://it.wikipedia.org/wiki/Comuni_della_Sardegna) (con dettaglio: 70 Città metropolitana di Cagliari, 26 Gallura Nord-Est Sardegna, 28 Medio Campidano, 53 Nuoro, 23 Ogliastra, 87 Oristano, 66 Città metropolitana di Sassari, 24 Sulcis Iglesiente).

Ha **tre vantaggi difendibili**: (1) nessun concorrente diretto sulla meccanica; (2) un bacino identitario fortissimo e non servito; (3) un tema SEO ("i 377 comuni della Sardegna") con concorrenza bassissima. Ha **un solo, grande svantaggio**: **nessuno oggi cerca il prodotto, perché non sa che esiste la categoria**. La crescita non può essere "intercettare domanda": deve essere **"creare categoria + cavalcare l'identità sarda"**.

---

## 3. SEO — keyword, intento, difficoltà e pagine da creare

### 3.1 Avvertenza sui numeri

🔴 **TUTTE le stime di volume e difficoltà in questa sezione sono MIE STIME, non dati di tool.** Google Trends era inaccessibile (HTTP 429, verificato). Non ho accesso a Semrush/Ahrefs/Ubersuggest in questa sessione. **Prima di qualsiasi investimento: validare queste 20 keyword su uno di questi tool**, o almeno su Keyword Planner di Google Ads (gratuito con account).

**Segnali indiretti che ho invece verificato e che sostengono le stime:**
- ✅ "Comuni della Sardegna" è un **contenuto enciclopedico di riferimento** su Wikipedia ([link](https://it.wikipedia.org/wiki/Comuni_della_Sardegna)) → esiste domanda informativa sul tema.
- ✅ Esistono **quiz utente su JetPunk** dal 2024 sulla Sardegna e sui comuni sardi ([link](https://www.jetpunk.com/user-quizzes/183621/comuni-della-sardegna-con-mappa)) → la gente cerca attivamente "quiz su questo tema".
- ✅ Esistono **risorse Wordwall sulla Sardegna create da insegnanti** ([link](https://wordwall.net/it-it/community/geografia/sardegna)) → esiste domanda **scolastica**.
- ✅ **GeoFun Games sta costruendo pagine "geografia per regione" con mini-quiz** ([link](https://www.geofungames.com/it)) → un concorrente internazionale sta già validando la strategia SEO "per regione". **Segnale forte**.
- ✅ **Relaydle** mantiene una directory di giochi quotidiani in italiano **ordinati per popolarità reale** ([link](https://relaydle.com/it/)) → esiste un pubblico che cerca "giochi come Wordle in italiano".
- ✅ Vistanet pubblica **format quiz ricorrenti** su temi sardi ([link](https://www.vistanet.it/cagliari/2026/04/30/quiz-per-sardi-doc-riuscite-a-indovinare-in-quale-spiaggia-ancora-selvaggia-ci-troviamo/)) → le testate locali investono su questo contenuto, segno di engagement.
- ❌ **Segnale contrario da non ignorare**: la ricerca per `"trova il comune"` + gioco/quiz **non restituisce alcun gioco** ([Bing](https://www.bing.com/search?q=%22trova+il+comune%22+gioco+quiz+comune+italiano+mappa&setlang=it&cc=IT)). 🟡 Il che significa che quella formulazione **potrebbe avere volume vicino a zero**: potrebbe essere una keyword *plausibile ma inesistente*. **È la prima cosa da validare con un tool.**

### 3.2 Top 20 keyword — intento e difficoltà stimata

**Legenda difficoltà 🔴 (mia stima):** 🟢 Molto bassa (pagina nuova può rankare in 1–3 mesi) · 🟡 Bassa-media · 🟠 Media (serve contenuto + autorità) · 🔴 Alta (serve autorità di dominio)

| # | Keyword | Intento | Diff. 🔴 | Volume 🔴 | Note / perché |
|---|---|---|---|---|---|
| 1 | **quiz geografia Sardegna** | Informazionale-commerciale | 🟢 | Basso-medio | Termine "core". Concorrenza: Wordwall, JetPunk, cartoni.wiki. Battibile |
| 2 | **geografia Sardegna quiz** | Informazionale | 🟢 | Basso | Variante di #1, stessa landing |
| 3 | **indovina il paese sulla mappa** | Transazionale (gioco) | 🟡 | Medio | Keyword **di categoria**: la usano i cloni GeoGuessr. Alta intenzione |
| 4 | **gioco paesi sardi** | Transazionale | 🟢 | Molto basso | Linguaggio naturale del target. Zero concorrenza |
| 5 | **quanto conosci la Sardegna** | Informazionale-intrattenimento | 🟢 | Basso | Formato quiz social. Ottimo per H1 e per TikTok |
| 6 | **comuni Sardegna quiz** | Informazionale | 🟢 | Basso | Unisce il tema (comuni) al formato (quiz) |
| 7 | **i 377 comuni della Sardegna** | Informazionale | 🟠 | Medio | Cattura Wikipedia. **Pagina pillar**: elenco + gioco per ogni provincia |
| 8 | **geoguessr Sardegna** | Navigazionale-transazionale | 🟡 | Basso-medio | **Keyword di aggancio**: intercetta chi cerca "geoguessr" + luogo |
| 9 | **geoguessr Italia** | Navigazionale | 🔴 | Alto | Dominata da GeoGuessr e WorldGuessr. **Non attaccare frontalmente** |
| 10 | **alternativa GeoGuessr gratis** | Transazionale | 🟠 | Medio | Alta conversione: intercetta il **paywall backlash**. WorldGuessr/OpenGuessr forti |
| 11 | **indovina il comune italiano** | Transazionale | 🟢 | Basso | ⚠️ Da validare: potrebbe essere a volume ~0 (vedi 3.1) |
| 12 | **gioco geografia Italia regioni** | Informazionale | 🟡 | Medio | Ponte tra Sardegna e future regioni. Strategia "hub" |
| 13 | **province della Sardegna quiz** | Informazionale | 🟢 | Basso | Long-tail, livello più facile del comune |
| 14 | **mappa interattiva comuni Sardegna** | Informazionale-strumentale | 🟡 | Medio | Utente che vuole *vedere*, non giocare. Pagina di servizio + CTA al gioco |
| 15 | **geografia della Sardegna scuola** | Informazionale (educational) | 🟢 | Basso-medio | **Intento docenti**. Altissima qualità di traffico (link da siti scolastici) |
| 16 | **quiz Sardegna per bambini** | Informazionale | 🟢 | Basso | Genitori + maestre. Stagionale (settembre) |
| 17 | **gioco quotidiano geografia italiano** | Transazionale | 🟢 | Basso | **La nicchia delle "daily game in italiano"** — Relaydle la copre già |
| 18 | **giochi come Wordle in italiano** | Informazionale | 🟡 | Medio | Ottimo per directory e listing (Relaydle). Alto volume percepito |
| 19 | **indovina la città sarda** | Informazionale-intrattenimento | 🟢 | Basso | **Già usata su TikTok da @lasarda81** → domanda dimostrata su social |
| 20 | **comune sardo da indovinare / indovina il paese sardo** | Transazionale | 🟢 | Molto basso | **Long-tail di marca futura**: presidiare prima che esista concorrenza |

**Le 3 keyword su cui costruirei tutto:** **#1 (quiz geografia Sardegna)** come testa di ponte, **#7 (i 377 comuni della Sardegna)** come pillar autorevole, **#10 (alternativa GeoGuessr gratis)** come motore di acquisizione ad alta conversione.

### 3.3 Pagine SEO da creare (architettura consigliata)

**Livello 0 — Home (una pagina pubblica indicizzabile, oggi mancante).**
`/` — H1: "Indovina i paesi della Sardegna sulla mappa". Contiene il gioco + 800 parole di contesto (cos'è, come si gioca, i 377 comuni, il punteggio max 40.000). **Requisito assoluto**: oggi non c'è pagina pubblica indicizzata. Niente di tutto il resto funziona senza questa.

**Livello 1 — Le 4 pagine pillar**

| URL | Keyword primaria | Contenuto |
|---|---|---|
| `/comuni-sardegna` | i 377 comuni della Sardegna | ⭐ **Pillar**. Elenco completo dei 377, con **tabella per provincia** (dati verificati: [Wikipedia](https://it.wikipedia.org/wiki/Comuni_della_Sardegna)), popolazione, altitudine, superficie. CTA: "gioca a indovinarli sulla mappa". **È la pagina che può rankare per un termine ad alto volume** sfruttando il divario con Wikipedia (loro hanno la tabella, noi la tabella + il gioco) |
| `/quiz-geografia-sardegna` | quiz geografia Sardegna | Landing commerciale del gioco. FAQ, come funziona il punteggio, classifica, guida ai round |
| `/geoguessr-sardegna` | geoguessr Sardegna | Pagina comparativa onesta: "Come GeoGuessr, ma al contrario e solo Sardegna". **Intercetta il navigational intent** senza attaccare "geoguessr italia" |
| `/alternativa-geoguessr-gratis` | alternativa GeoGuessr gratis | Perché Intzetta è gratis e illimitato vs. il paywall GeoGuessr (dati verificati in Sez. 1.1: daily sola gratis, poi €3,99+/mese) |

**Livello 2 — Le pagine per provincia (8 pagine: la strategia "per ogni provincia")**

`/quiz-comuni/cagliari`, `/quiz-comuni/sassari`, `/quiz-comuni/nuoro`, `/quiz-comuni/oristano`, `/quiz-comuni/gallura`, `/quiz-comuni/ogliastra`, `/quiz-comuni/medio-campidano`, `/quiz-comuni/sulcis-iglesiente`

Ognuna: "Indovina i comuni della provincia di X" + elenco comuni della provincia + gioco pre-filtrato. ✅ **Ripartizione verificata**: 70 Cagliari, 66 Sassari, 53 Nuoro, 87 Oristano, 26 Gallura, 23 Ogliastra, 28 Medio Campidano, 24 Sulcis Iglesiente — [Wikipedia](https://it.wikipedia.org/wiki/Comuni_della_Sardegna).

> 🟡 **Perché funziona:** GeoFun Games sta già facendo esattamente questo a livello internazionale ("Lezioni di geografia gratuite **per regione**", [fonte](https://www.geofungames.com/it)). Nessuno lo fa per le **province sarde**. 8 pagine = 8 keyword long-tail a concorrenza quasi nulla, e ogni pagina è **condivisibile in un gruppo Facebook provinciale** (Sez. 4).

**Livello 3 — Pagine educational (scuole)**

| URL | Target | Contenuto |
|---|---|---|
| `/scuola/geografia-sardegna` | Docenti | Scheda didattica pronta: obiettivi, come usare Intzetta in classe, esercizio sui 377 comuni, stampabile. **Linkabile dalle scuole** |
| `/scuola/quiz-sardegna-bambini` | Primaria | Versione semplificata, 20 comuni più popolosi |
| `/scuola/verifica-comuni-sardegna` | Docenti | "Verifica di geografia" in formato quiz con correzione automatica |

> 🟡 **Nota strategica:** l'intento "scuola" è la **fonte di link più economica e credibile** per un prodotto nuovo. Un sito scolastico pubblico che linka `intzetta` vale più di 50 post social. ✅ Il segnale che i docenti cercano attivamente questo tipo di risorsa è già verificato: esistono **risorse Wordwall "QUIZ SARDEGNA"** create da insegnanti ([fonte](https://wordwall.net/it-it/community/geografia/sardegna)) e piattaforme dedicate come [didattica.live](https://didattica.live/medie/prima/geografia/quiz/regioni-italia) e [risorsedidattiche.net](https://www.risorsedidattiche.net/scuola_secondaria/geografia/geografia.php).

**Livello 4 — Contenuto di attualità / link bait (per la stampa locale)**

`/curiosita/comune-piu-piccolo-sardegna` (✅ spunto verificato: **Baradili**, 75 abitanti — dati [Wikipedia](https://it.wikipedia.org/wiki/Comuni_della_Sardegna)), `/curiosita/comuni-piu-difficili-da-indovinare`, `/classifica`. Formato pensato per essere **ripreso dalle testate locali** (Sez. 4).

**Dettagli tecnici SEO da non sbagliare** (🟡 consigli, non verifiche):
- `hreflang` e **versione inglese** per la diaspora (Sez. 4.5) — è un moltiplicatore, non un prerequisito.
- **SSR/prerender**: oggi Intzetta è React SPA + Firebase Hosting (✅ [README](https://github.com/emaxgms/intzetta)). Una SPA vuota **non viene indicizzata bene**. Serve prerendering/SSR per le pagine di contenuto.
- **Dati strutturati** `Quiz` / `FAQPage` / `HowTo` → rich results.
- Il **gioco deve essere giocabile senza login**: oggi la classifica richiede Firebase Auth, ma il gioco in sé non deve chiedere l'account (✅ il README conferma "Autenticazione: Accedi con Google o email **per salvare i tuoi progressi**" → l'auth è opzionale per giocare: buono).

---

## 4. Canali di crescita non-SEO, realistici, a costo zero/basso

**Ordine di priorità per sforzo/impatto.** La logica: prima i canali dove **il pubblico è già concentrato e già parla di Sardegna**, poi quelli dove serve costruire relazione.

### 4.1 🥇 Community sarde online (impatto alto, sforzo basso) — **FARE SUBITO**

| Canale | URL / riferimento | Dimensione verificata | Approccio consigliato |
|---|---|---|---|
| **Gruppi Facebook "Sei sardo se..."** | ✅ [groups/seisardose](https://www.facebook.com/groups/seisardose/), [groups/640614692652748](https://www.facebook.com/groups/640614692652748/), [groups/891587478163559](https://www.facebook.com/groups/891587478163559/), [groups/1135908483090170](https://www.facebook.com/groups/1135908483090170/) | 4+ gruppi attivi (dimensione non verificabile) | **Post nativo, non pubblicitario.** Formato: screenshot del risultato + "Ho fatto X/40.000, chi mi batte?" + link. ⚠️ **Chiedere prima ai admin**: questi gruppi tollerano male lo spam e un ban è definitivo |
| **Pagina FB "Sei sardo se"** | ✅ [facebook.com/seisardosepage](https://www.facebook.com/seisardosepage/) | **15.773 like** | Contattare via DM: proporre il gioco come contenuto per i loro follower. Offrire "quiz della settimana" in esclusiva |
| **Instagram @ig_sardinia** | ✅ [instagram.com/ig_sardinia](https://www.instagram.com/ig_sardinia/) | **168K follower**, 3.108 post, attiva dal 2012, "COMUNITÀ UFFICIALE SARDA" | ⭐ **Il singolo canale a più alto potenziale.** DM proponendo una collaborazione a costo zero: loro pubblicano il gioco in Stories, Intzetta li cita nella home. Preparare una **share card verticale già pronta** (Sez. 5) per ridurre l'attrito |
| **r/Sardegna** | ✅ [reddit.com/r/Sardegna](https://www.reddit.com/r/Sardegna/) — "Questa sub vuole riunire sardi e chiunque sia interessato alla cultura/tradizioni dell'isola" ([wiki](https://www.reddit.com/r/Sardegna/wiki/index/)) | non verificabile (Reddit blocca API/fetch) | ⭐ **Il canale più adatto per un post tecnico-honest**: "Ho fatto un GeoGuessr al contrario sui 377 comuni sardi, cerco feedback". Reddit premia l'autenticità e punisce il marketing. Il founder-developer deve scrivere in prima persona (come fece Wallén nel 2013, ✅ [Wikipedia](https://en.wikipedia.org/wiki/GeoGuessr)) |
| **r/Sardinia** | ✅ [reddit.com/r/Sardinia](https://www.reddit.com/r/Sardinia/) — sub in inglese su cultura/historia/archeologia sarda, con thread tipo ["Best instagram/tiktok accounts to follow for Sardinian culture"](https://www.reddit.com/r/Sardinia/comments/1c0idqf/best_instagram_tiktok_accounts_to_follow_for/) | non verificabile | **Doppio uso**: (1) test della futura **versione inglese** con la diaspora; (2) fonte di richieste reali di contenuto sardo |
| **r/geoguessr + r/Worldle + community daily game** | ✅ [geoguessr.com wiki Italy](https://www.reddit.com/r/geoguessr/wiki/italy/) | grande | Pubblico già alfabetizzato alla meccanica: **zero educazione necessaria**. Post: "Ho costruito la versione italiana/regionale" |
| **Directory di daily game** | ✅ [relaydle.com/it](https://relaydle.com/it/) ("Giochi come Wordle in italiano: geografia, calcio, musica... ordinati in base a cosa si gioca davvero") | directory attiva | ⭐ **Quick win a sforzo quasi nullo**: chiedere l'inserimento. È un canale di scoperta con intento altissimo |
| **GeoGuessr Italia (community)** | ✅ [youtube.com/@geoguessritalia](https://www.youtube.com/@geoguessritalia), [instagram.com/geoguessritalia](https://www.instagram.com/geoguessritalia/) (**815 follower**), [linktr.ee/geoguessritalia](https://linktr.ee/geoguessritalia), [Twitch](https://linktr.ee/geoguessritalia) | piccola ma iper-rilevante | Audience **perfettamente sovrapposta**: ama la meccanica, è italiana. Proporre un **torneo Intzetta** in live su Twitch. 815 follower ma conversioni altissime |

### 4.2 🥈 Creator e influencer sardi (impatto alto, sforzo medio)

| Canale | URL | Note | Approccio |
|---|---|---|---|
| **@lasarda81** | ✅ [tiktok.com/@lasarda81/video/7617442383671594262](https://www.tiktok.com/@lasarda81/video/7617442383671594262) — video "**Sardegna: indovina la città sarda!**" | ⭐ **Ha già fatto esattamente il format di Intzetta su TikTok** → fit perfetto, zero educazione | DM: proporre di giocare a Intzetta in un video. Il video si auto-genera dal gameplay |
| **@anemiska** (Nemiski) | ✅ [tiktok.com/@anemiska](https://www.tiktok.com/@anemiska) — video GeoGuessr Italia con **77K like** e 4.060 like | Creator GeoGuessr IT con reach dimostrata | ⭐ Proporre "GeoGuessr Italia vs Intzetta Sardegna" |
| **@instasardegna**, **@sardegnatiktok** | ✅ [tiktok.com/@instasardegna](https://www.tiktok.com/@instasardegna), [tiktok.com/@sardegnatiktok](https://www.tiktok.com/@sardegnatiktok) | Account attivi su contenuti sardi | Stesso approccio: contenuto nativo, non spot |
| **Liste di creator sardi** | ✅ [kolsquare.com](https://www.kolsquare.com/it/top-influencers/i-top-instagrammer-sardi-secondo-kolsquare), [narameagency.com](https://www.narameagency.com/influencer-sardegna-2025-content-creator/), [influenxer.it](https://www.influenxer.it/influencer/sardegna-creator/) | **Contengono i nomi e i numeri dei top 10 creator sardi** → è la lista da cui partire per i DM | Usare queste liste come CRM di partenza |

### 4.3 🥉 Testate locali e radio (impatto medio-alto, sforzo basso-medio)

**Testate** (✅ fonti e directory: [tuttigiornali.it/sardegna](https://www.tuttigiornali.it/sardegna/), [cronacamedia.it](https://cronacamedia.it/blog/sardegna-notizie-cronaca-politica-cultura-sport/)):

| Testata | URL | Angolo |
|---|---|---|
| **L'Unione Sarda** | ✅ [unionesarda.it](https://www.unionesarda.it/) | Ha una **sezione dedicata "I Sardi Nel Mondo"** ✅ [unionesarda.it/sardi-nel-mondo](https://www.unionesarda.it/sardi-nel-mondo) → **doppio aggancio**: cronaca locale + diaspora |
| **La Nuova Sardegna** | ✅ [lanuovasardegna.it](https://www.lanuovasardegna.it/) | Quotidiano del gruppo GEDI, forte su Sassari/Nord Sardegna |
| **Vistanet** | ✅ [vistanet.it](https://www.vistanet.it/) — pubblica **format quiz ricorrenti** ("Quiz per sardi doc", [esempio](https://www.vistanet.it/cagliari/2026/04/30/quiz-per-sardi-doc-riuscite-a-indovinare-in-quale-spiaggia-ancora-selvaggia-ci-troviamo/)) | ⭐ **Il target n.1**: ha **già** la rubrica quiz. Proporre Intzetta come quiz interattivo ufficiale della rubrica |
| **SardiniaPost** | ✅ [sardiniapost.it](https://www.sardiniapost.it/) | Testata di approfondimento, taglio più giornalistico |
| **CagliariPad** | ✅ [cagliaripad.it](https://www.cagliaripad.it/) — ha pubblicato un pezzo sui travel creator sardi ([link](https://www.cagliaripad.it/674250/sardegna-regina-dei-social-boom-di-travel-creator-e-video-virali-dalle-spiagge/)) | Già attenta ai temi "Sardegna + social" |

**Radio** (✅ fonti: [radiolina.it](https://radiolina.it/), [radiox.it](https://www.radiox.it/), directory [radio-italiane.it/radio/sardegna](https://www.radio-italiane.it/radio/sardegna), [onlineradiobox.com/it/Sardinia-](https://onlineradiobox.com/it/Sardinia-/)):
- **Radiolina** (Cagliari, gruppo L'Unione Sarda, **radio ufficiale del Cagliari Calcio**) ✅ [radiolina.it](https://radiolina.it/) — il calcio è un aggancio: un quiz "quanto conosci la Sardegna" in una trasmissione sportiva funziona.
- **Radio X** (Sassari) ✅ [radiox.it](https://www.radiox.it/)
- Elenco completo delle emittenti sarde: ✅ [radio-italiane.it/radio/sardegna](https://www.radio-italiane.it/radio/sardegna)

> 🟡 **Angolo editoriale che funziona con la stampa locale** (non "ho fatto un gioco", ma): *"Un programmatore [sardo / di X] ha mappato i 377 comuni della Sardegna in un gioco: gli utenti devono indovinarli a occhi chiusi"*. È una **storia**, non una promozione. Servono: una novità (il record della classifica), un dato (quanti utenti), un elemento umano (il creatore).

### 4.4 Scuole (impatto alto e duraturo, sforzo medio)

| Canale | URL / riferimento | Approccio |
|---|---|---|
| **Risorse didattiche esistenti sulla Sardegna** | ✅ [wordwall.net/it-it/community/geografia/sardegna](https://wordwall.net/it-it/community/geografia/sardegna) — hub di quiz **creati da insegnanti** | ⭐ **Contattare gli autori di quelle risorse** (es. "Toschisveva" e altri): sono docenti già motivati sul tema. Sono i primi ambassador naturali |
| **Piattaforme per docenti** | ✅ [didattica.live](https://didattica.live/) ("piattaforma gratuita per studenti e insegnanti, oltre 100.000 domande"), [panquiz.com/scuola](https://www.panquiz.com/scuola/) (**300.000+ docenti e formatori**), [risorsedidattiche.net](https://www.risorsedidattiche.net/scuola_secondaria/geografia/geografia.php) (**168 schede e giochi di geografia**) | Proporre una scheda didattica Intzetta da pubblicare su queste piattaforme. **Zero costo, link di qualità** |
| **HubScuola (Mondadori)** | ✅ [area-geografia-ss1g.hubscuola.it](https://area-geografia-ss1g.hubscuola.it/) — "Strumenti per insegnare Geografia... migliaia di quesiti" | Canale editoriale: proporre come risorsa digitale abbinata al libro di testo |
| **Scuola Media Digitale** | ✅ [scuolamediadigitale.it](https://www.scuolamediadigitale.it/) | Community di docenti: guest post / segnalazione |
| **USR Sardegna e singoli istituti** | 🟡 (non verificato in questa sessione) | Via istituzionale, più lenta. Da attivare **dopo** aver creato le pagine `/scuola/` (Sez. 3.3) |

> 🟡 **Stagionalità**: il picco di interesse dei docenti è **fine agosto – settembre**. Un lancio "scuola" a settembre vale 5× un lancio a maggio.

### 4.5 Università e Pro Loco (impatto medio, sforzo medio)

| Canale | URL verificato | Approccio |
|---|---|---|
| **Università di Cagliari — associazioni studentesche** | ✅ [unica.it/it/didattica/vita-universitaria/associazioni-studentesche](https://www.unica.it/it/didattica/vita-universitaria/associazioni-studentesche) | ⭐ **Lista ufficiale di associazioni studentesche** → il canale giusto per proporre un **torneo Intzetta** in università (evento dal vivo, alto engagement, costo zero) |
| **ERSU Cagliari** | ✅ [ersucagliari.it](https://www.ersucagliari.it/) — "L'ERSU mette a disposizione i suoi spazi culturali per iniziative di carattere culturale, didattico, sociale... dedicate agli studenti" | Proporre un evento nei loro spazi culturali |
| **ERSU Sassari** | ✅ [ersusassari.it](https://ersusassari.it/) | Idem per il Nord Sardegna |
| **UNPLI Sardegna — Pro Loco** | ✅ [unpli.info/comitati-regionali/sardegna](https://www.unpli.info/comitati-regionali/sardegna/), [prolocosardegna.net](http://www.prolocosardegna.net/UNPLI/index.php), [facebook.com/p/Pro-Loco-Sardegna](https://www.facebook.com/p/Pro-Loco-Sardegna-100057120443404/) | ⭐⭐ **Il canale più sottovalutato.** UNPLI nazionale: "**oltre 6.200 associazioni Pro Loco**... circa **600.000 soci**" ✅ [unpli.info/chi-siamo-2](https://www.unpli.info/chi-siamo-2/). **Ogni Pro Loco = un paese sardo.** Un gioco sui 377 comuni è, per definizione, lo strumento di promozione perfetto per una Pro Loco. Angolo: "regala visibilità al tuo paese" |
| **Sagre ed eventi** | 🟡 | ✅ UNPLI assegna il marchio "**Sagra di Qualità**" (45 associazioni nel 2023) ✅ [facebook.com/p/Pro-Loco-Sardegna](https://www.facebook.com/p/Pro-Loco-Sardegna-100057120443404/) → le sagre sono punti di contatto fisici: **QR code** su un totem, "indovina il tuo paese e vinci" |

### 4.6 Diaspora sarda nel mondo (impatto medio, sforzo basso — ma richiede versione inglese)

| Canale | URL verificato | Dettaglio |
|---|---|---|
| **SardegnaMondo** | ✅ [sardegnamondo.it/circoli](https://www.sardegnamondo.it/circoli/) | "Rete delle Associazioni, delle Federazioni e dei circoli **sardi nel mondo**" |
| **Circoli sardi nel mondo (elenco dettagliato con contatti)** | ✅ [mlnsardu.org/wordpress/circoli-sardi-nel-mondo](https://www.mlnsardu.org/wordpress/circoli-sardi-nel-mondo/) | ⭐ **Questo è un elenco con nomi, presidenti, email e telefoni.** Esempi verificati: **Associazione S'Isula Sarda — Sardi de l'Ile de France** (Vitry-sur-Seine, presidente Antonio Corrias, `sisulasarda@neuf.fr`); **Circolo sardo "Quattro Mori"** (Augusta, **Germania**, presidente Mauro Soma, `quattro-mori-augsburg@t-online.de`). ⚠️ **Questi indirizzi potrebbero essere datati: verificare prima di scrivere** |
| **L'Unione Sarda — "I Sardi Nel Mondo"** | ✅ [unionesarda.it/sardi-nel-mondo](https://www.unionesarda.it/sardi-nel-mondo) e [sezione Circoli](https://www.unionesarda.it/sardi-nel-mondo/circoli) | Testata **con una sezione dedicata alla diaspora** → unico contatto che copre **sia stampa sia diaspora** |
| **Gruppi Facebook diaspora** | ✅ [groups/infodeisardinelmondo](https://www.facebook.com/groups/infodeisardinelmondo/), [groups/338433455733](https://www.facebook.com/groups/338433455733/) | Community attive di sardi all'estero |
| **r/Sardinia** (inglese) | ✅ [reddit.com/r/Sardinia](https://www.reddit.com/r/Sardinia/) | Pubblico internazionale, **ma la maggioranza è straniera appassionata di Sardegna, non diaspora sarda** 🟡 |

> ⚠️ **Vincolo reale:** la diaspora **non gioca in italiano** (2ª/3ª generazione in Germania, Belgio, Argentina). ✅ Il contesto lo conferma: esistono circoli in **Francia, Germania**. 🟡 **Senza versione inglese, questo canale vale poco.** Con la versione inglese, diventa un moltiplicatore forte perché la nostalgia dell'isola è il motore emotivo più potente che esista per questo prodotto.

### 4.7 Il canale più potente di tutti, e non è elencato sopra

🟡 **Il gioco stesso, se progettato per diffondersi.** Tutti i canali sopra servono a innescare il primo ciclo. Ma il motore che ha fatto GeoGuessr (streamer) e Wordle (emoji grid) non è un canale, è **una meccanica**. La Sez. 5 è quindi, di fatto, il canale n. 1.

---

## 5. Meccaniche di viralità — come deve essere il risultato condivisibile

### 5.1 Il principio, dalle fonti

Tre proprietà rendono una share virale, tutte **verificate** sul caso Wordle (Sez. 1.2):
1. **Non spoilera** → chi la vede può ancora giocare (*"it leaked nothing"*, [dinogame.gg](https://dinogame.gg/blog/why-wordle-blew-up/))
2. **È confrontabile** → stesso puzzle per tutti, stesso giorno (*"communal context that makes sharing meaningful"*, [nichemetric.com](https://www.nichemetric.com/blog/wordle-free-game-nyt-acquisition-case-study))
3. **È rituale** → una volta al giorno, tutti i giorni (*"built anticipation and gave users a reason to come back"*, [getnoise.com](https://getnoise.com/q/why-did-wordle-go-viral))

E una proprietà **specifica dell'Italia**, verificata: **WhatsApp è il canale dominante**. Dati:
- ✅ "il **90,1%** degli utenti internet italiani tra i 16 e i 64 anni dichiara di utilizzare **WhatsApp** ogni mese" — [esendex.it](https://www.esendex.it/blog/post/statistiche-whatsapp/) (dato 2026)
- ✅ "in Italia il messaging via WhatsApp raggiunge la **pressoché totalità** della popolazione connessa: il Paese conta **52,6 milioni di utenti internet** con una penetrazione del 89,4%" — [sendseven.com](https://sendseven.com/it/blog/statistiche-whatsapp-italia-2026) (fonte: Datareportal Digital 2026 Italy)
- ✅ ~**35 milioni di utenti attivi mensili** in Italia secondo We Are Social/Meltwater (gennaio 2025), "oltre il 58% della popolazione" — [theglobaldigest.com](https://theglobaldigest.com/it/whatsapp-in-italia-dominio-regolamentazione-e-futuro-della-messaggistica/)
- ✅ Contesto generale: **42,2 milioni** di identità social in Italia (71,2% della popolazione), **53,3 milioni** di utenti internet (89,9%), **28,2 M Facebook**, **27,8 M Instagram**, **42,2 M YouTube** — [datareportal.com/reports/digital-2025-italy](https://datareportal.com/reports/digital-2025-italy)
- ✅ L'analisi di settore conferma la specificità italiana: "*L'app di messaggistica è di gran lunga il canale più diffuso in Italia... molto più che in alcuni mercati, es. negli USA dove WhatsApp è meno centrale*" — [blacklemon.com](https://www.blacklemon.com/servizi/social-media-marketing/social-media-in-italia-2025-dati-statistiche-e-confronto-con-il-mondo.html)

> **Conseguenza di progetto:** il formato di condivisione di Intzetta non deve essere ottimizzato per Twitter/X (come Wordle nel 2022) ma per **un incollaggio in una chat WhatsApp di gruppo**. Testo breve, emoji grandi, **nessun carattere strano**, e — differenza chiave da Wordle — **il link va messo**: su WhatsApp un link è cliccabile e trasforma la condivisione in acquisizione diretta.

### 5.2 Il formato consigliato: la "griglia dei 10 paesi"

🟡 **Proposta mia**, costruita sui vincoli verificati sopra.

**Vincolo tecnico di partenza:** Intzetta fa **8 round** con punteggio massimo **40.000** (= 5.000/round, esattamente come il Classic di GeoGuessr ✅ [Wikipedia](https://en.wikipedia.org/wiki/GeoGuessr)). Una griglia a 8 righe è troppo verticale per WhatsApp; 8 emoji in una riga è troppo poco informativo. **Consiglio: 8 righe di 1 emoji, oppure una riga riassuntiva a 8 emoji** (vedi sotto).

**Opzione A — riga singola (massima compattezza, stile Wordle)**

```
Intzetta #142 — 28.450/40.000
🟩🟩🟨🟧🟩🟥🟩🟨
intzetta.it
```

Dove: 🟩 ≤25 km · 🟨 ≤75 km · 🟧 ≤150 km · 🟥 >150 km (soglie da tarare sulla geografia sarda: l'isola è ~270 km di diagonale, quindi le soglie devono essere **molto più strette** di quelle di un gioco globale).

> 🟡 **Punto cruciale di design:** la Sardegna è lunga ~270 km e larga ~145 km. Le soglie di punteggio e i colori **devono essere calibrati sull'isola**, non su una mappa mondiale. Un errore di 30 km in Sardegna è molto grave; nel mondo è eccellente. **Questa calibrazione è il cuore dell'identità del prodotto** e va comunicata nella share ("in Sardegna 30 km sono tanti").

**Opzione B — riga per round (più informativa, più "flex")**

```
Intzetta #142 — 28.450/40.000
1. Bitti      🟩 12 km
2. Teulada    🟨 48 km
3. Arzachena  🟧 121 km
...
```

**Opzione C — formato "sfida diretta" (il più adatto a WhatsApp)** ⭐ il mio consiglio

```
🏝️ INZETTA #142
Ho fatto 28.450 su 40.000
Sai piazzare Bitti, Teulada e Arzachena sulla mappa?
👉 intzetta.it
🟩🟩🟨🟧🟩🟥🟩🟨
```

Perché Opzione C: include una **call to action esplicita** ("sai piazzare...?"), **nomina i paesi** (curiosità + sfida), **ha il link** (acquisizione), e mantiene la griglia (status/confronto). È progettata per essere incollata in un gruppo WhatsApp di amici o di famiglia.

### 5.3 Formati di condivisione da implementare

| # | Formato | Perché | Sforzo |
|---|---|---|---|
| 1 | **Testo + emoji copiabile con 1 tap** (`navigator.clipboard`) | È il formato Wordle. Base indispensabile | 🟢 Basso |
| 2 | **Link diretto nel testo condiviso** | Differenza chiave vs. Wordle. Trasforma la share in acquisizione. **Ogni condivisione deve portare a una pagina pubblica indicizzata** (Sez. 3.3) | 🟢 Basso |
| 3 | **`navigator.share()` nativo mobile** | Apre direttamente il selettore di condivisione → WhatsApp è la prima voce su Android/iOS in Italia | 🟢 Basso |
| 4 | **Immagine verticale 1080×1920 auto-generata** (canvas) | Per **Instagram/Facebook Stories** e per i gruppi WhatsApp (dove un'immagine ferma lo scroll più di un testo). Deve contenere: la mappa della Sardegna con i pin, i paesi, il punteggio, il logo, l'URL | 🟠 Medio |
| 5 | **Card "sfida un amico" con link firmato** | Genera un link `?challenge=<id>` che mostra "Il tuo amico ha fatto 28.450: battilo". **Il loop più potente** perché è una sfida 1-a-1 dentro una chat | 🟠 Medio |
| 6 | **Classifica settimanale condivisibile per provincia** | "Sono il n. 3 della provincia di Nuoro". Attiva l'**identità locale** — il motore emotivo sardo | 🟠 Medio |
| 7 | **Streak visibile** (giorni consecutivi) | La streak è il meccanismo di retention ✅ documentato in GeoGuessr (**"Play the Daily challenge — Keep your streak alive!"**, [geoguessr.com/pricing](https://www.geoguessr.com/pricing)) e in Worldle (pagina [/stats](https://worldle.teuteuf.fr/stats) con "win rate, guess distribution, streak calendar") | 🟡 Medio |
| 8 | **Modalità "sfida le tue origini"** | "Indovina il tuo paese natale" — al termine, l'utente scopre quanti km di errore ha fatto **sul proprio comune**. 🟡 **Questa è la mia idea a più alto potenziale virale**: è personale, umiliante o trionfale, e **assolutamente irresistibile da condividere**, specialmente nella diaspora | 🟡 Medio |

### 5.4 Il prodotto minimo per far funzionare tutto questo

🟡 elenco di prerequisiti, in ordine di dipendenza:

1. **Modalità giornaliera** (oggi assente) — stesso set di paesi per tutti, mezzanotte ora locale (come Worldle ✅ [fonte](https://worldle.teuteuf.fr/)). **Senza questo, non esiste la share comparabile, e senza share comparabile non esiste viralità.** È il singolo intervento a più alto ROI.
2. **Streak** + notifica/promemoria.
3. **Share text + share image + `navigator.share()`**.
4. **Pagina pubblica indicizzabile** con il gioco giocabile **senza login** (l'auth solo per la classifica).
5. **Pagina `/comuni-sardegna`** (pillar SEO) e le **8 pagine per provincia**.
6. **Versione inglese** solo dopo i punti 1–5 (serve per la diaspora, Sez. 4.6).

---

## 6. Conclusione — (b) top 20 keyword e (c) canali prioritizzati

### (b) Top 20 keyword con intento e difficoltà stimata

*(ripresa della Sez. 3.2 — 🔴 tutte le difficoltà e i volumi sono MIE STIME, da validare con tool)*

| # | Keyword | Intento | Diff. 🔴 | Priorità |
|---|---|---|---|---|
| 1 | quiz geografia Sardegna | Inf.-comm. | 🟢 | ⭐⭐⭐ Testa di ponte |
| 2 | geografia Sardegna quiz | Inform. | 🟢 | ⭐⭐ |
| 3 | indovina il paese sulla mappa | Transaz. | 🟡 | ⭐⭐⭐ Categoria |
| 4 | gioco paesi sardi | Transaz. | 🟢 | ⭐⭐ |
| 5 | quanto conosci la Sardegna | Inf.-intr. | 🟢 | ⭐⭐ |
| 6 | comuni Sardegna quiz | Inform. | 🟢 | ⭐⭐ |
| 7 | i 377 comuni della Sardegna | Inform. | 🟠 | ⭐⭐⭐ Pillar |
| 8 | geoguessr Sardegna | Nav.-transaz. | 🟡 | ⭐⭐⭐ Aggancio |
| 9 | geoguessr Italia | Nav. | 🔴 | ⭐ Non attaccare |
| 10 | alternativa GeoGuessr gratis | Transaz. | 🟠 | ⭐⭐⭐ Conversione |
| 11 | indovina il comune italiano | Transaz. | 🟢 | ⭐⭐ Da validare (forse ~0 volume) |
| 12 | gioco geografia Italia regioni | Inform. | 🟡 | ⭐⭐ Ponte |
| 13 | province della Sardegna quiz | Inform. | 🟢 | ⭐⭐ |
| 14 | mappa interattiva comuni Sardegna | Inf.-strum. | 🟡 | ⭐⭐ Servizio |
| 15 | geografia della Sardegna scuola | Inform. | 🟢 | ⭐⭐⭐ Link building |
| 16 | quiz Sardegna per bambini | Inform. | 🟢 | ⭐⭐ Stagionale |
| 17 | gioco quotidiano geografia italiano | Transaz. | 🟢 | ⭐⭐ |
| 18 | giochi come Wordle in italiano | Inform. | 🟡 | ⭐⭐⭐ Directory |
| 19 | indovina la città sarda | Inf.-intr. | 🟢 | ⭐⭐ Social |
| 20 | indovina il paese sardo | Transaz. | 🟢 | ⭐⭐ Long-tail di marca |

### (c) Canali di lancio prioritizzati — sforzo / impatto

**Scala.** Sforzo: 🟢 <2h · 🟡 1–2 giorni · 🟠 1 settimana · 🔴 >1 settimana di lavoro continuativo. Impatto: numero e qualità di utenti attesi nel primo mese, a parità di esecuzione. 🔴 **Le stime di impatto sono MIE IPOTESI.**

| Pri. | Canale | Sforzo | Impatto | Azione concreta |
|---|---|---|---|---|
| **0** | ⚠️ **PREREQUISITO: modalità giornaliera + share text + pagina pubblica indicizzabile** | 🔴 | — | **Senza questo, tutti i canali sotto rendono 1/10.** Fare questo prima di qualsiasi lancio |
| **1** | **r/Sardegna** — post del founder in prima persona | 🟢 | ⭐⭐⭐⭐⭐ | "Ho fatto un GeoGuessr al contrario sui 377 comuni sardi, cerco feedback". Stile Wallén 2013 |
| **2** | **Gruppi FB "Sei sardo se..."** (4+ gruppi) + pagina [Sei sardo se](https://www.facebook.com/seisardosepage/) (15,8K) | 🟢 | ⭐⭐⭐⭐⭐ | Post nativo con screenshot risultato. **Chiedere permesso agli admin** |
| **3** | **DM a @ig_sardinia** (168K follower) | 🟢 | ⭐⭐⭐⭐⭐ | Proporre collaborazione a costo zero. **Preparare prima la share card verticale** |
| **4** | **Inserimento in directory daily game** — [Relaydle](https://relaydle.com/it/) e simili | 🟢 | ⭐⭐⭐⭐ | Email/DM di richiesta. Costo quasi nullo, intento altissimo |
| **5** | **DM a creator TikTok sardi** — [@lasarda81](https://www.tiktok.com/@lasarda81/video/7617442383671594262) (ha già il format), [@anemiska](https://www.tiktok.com/@anemiska) (GeoGuessr IT, 77K like) | 🟡 | ⭐⭐⭐⭐⭐ | "Gioca a Intzetta in un video". Il gameplay si auto-genera |
| **6** | **Community GeoGuessr Italia** — [@geoguessritalia](https://www.instagram.com/geoguessritalia/), [YouTube](https://www.youtube.com/@geoguessritalia), [Twitch](https://linktr.ee/geoguessritalia) | 🟢 | ⭐⭐⭐⭐ | Torneo su Twitch. Audience sovrapposta, 815 follower ma conversioni alte |
| **7** | **Vistanet** — ha già la rubrica "Quiz per sardi doc" | 🟡 | ⭐⭐⭐⭐ | ⭐ **Il pitch media più facile**: il format esiste già, manca solo la versione interattiva |
| **8** | **UNPLI Sardegna / Pro Loco** ([prolocosardegna.net](http://www.prolocosardegna.net/UNPLI/index.php), [unpli.info](https://www.unpli.info/comitati-regionali/sardegna/)) | 🟠 | ⭐⭐⭐⭐ | "Regala visibilità al tuo paese". 6200+ Pro Loco in Italia, 600.000 soci. QR code alle sagre |
| **9** | **Docenti: autori delle risorse Wordwall sulla Sardegna** ([hub](https://wordwall.net/it-it/community/geografia/sardegna)) | 🟡 | ⭐⭐⭐ | Contattare gli insegnanti che **già** creano quiz sardi. Ambassador naturali |
| **10** | **Pagine /scuola/ + piattaforme docenti** ([didattica.live](https://didattica.live/), [PanQuiz](https://www.panquiz.com/scuola/) 300K docenti, [risorsedidattiche.net](https://www.risorsedidattiche.net/scuola_secondaria/geografia/geografia.php)) | 🟡 | ⭐⭐⭐ | Scheda didattica da pubblicare. **Link di qualità, lanciare a settembre** |
| **11** | **L'Unione Sarda** (sezione "[I Sardi Nel Mondo](https://www.unionesarda.it/sardi-nel-mondo)") + [La Nuova Sardegna](https://www.lanuovasardegna.it/) + [SardiniaPost](https://www.sardiniapost.it/) + [CagliariPad](https://www.cagliaripad.it/) | 🟡 | ⭐⭐⭐ | Comunicato con angolo-*storia*, non annuncio di prodotto |
| **12** | **Radio** — [Radiolina](https://radiolina.it/) (radio ufficiale Cagliari Calcio), [Radio X](https://www.radiox.it/) | 🟡 | ⭐⭐ | Rubrica settimanale "indovina il paese". Aggancio: il calcio |
| **13** | **Università** — [associazioni studentesche Unica](https://www.unica.it/it/didattica/vita-universitaria/associazioni-studentesche), [ERSU Cagliari](https://www.ersucagliari.it/), [ERSU Sassari](https://ersusassari.it/) | 🟠 | ⭐⭐⭐ | Torneo dal vivo negli spazi ERSU |
| **14** | **Diaspora** — [SardegnaMondo](https://www.sardegnamondo.it/circoli/), [elenco circoli con contatti](https://www.mlnsardu.org/wordpress/circoli-sardi-nel-mondo/), [FB I Sardi Nel Mondo](https://www.facebook.com/groups/infodeisardinelmondo/) | 🟠 | ⭐⭐ (⭐⭐⭐⭐ **con versione EN**) | ⚠️ **Bloccato dalla lingua.** Fare dopo la versione inglese. Verificare i contatti dell'elenco (possono essere datati) |
| **15** | **r/Sardinia** (inglese) | 🟢 | ⭐⭐ | Test della versione EN + pubblico internazionale appassionato di Sardegna |

### Il piano in tre mosse, se dovessi scegliere solo tre cose

1. **Costruire la modalità giornaliera + la share string** (Sez. 5). 🔴 È il 70% del risultato. Senza, Intzetta è un sito che si visita una volta.
2. **Post su r/Sardegna + 3 gruppi Facebook sardi, con la share card pronta.** 🟢 Costo: un pomeriggio. È il test di domanda più onesto ed economico che esista.
3. **Creare la pagina `/comuni-sardegna` sui 377 comuni** con il gioco incorporato. 🟠 È l'unico asset che accumula valore nel tempo: intercetta un intento informativo che esiste già (Wikipedia lo dimostra) e che oggi **nessun gioco presidia**.

---

## Appendice — Elenco completo delle fonti citate

**Prodotti e piattaforme**
- GeoGuessr — [home](https://www.geoguessr.com/) · [pricing](https://www.geoguessr.com/pricing) · [free](https://www.geoguessr.com/free) · [IT](https://www.geoguessr.com/it) · [mappe Italia](https://www.geoguessr.com/it/maps/italy) · [Seterra Italia regioni](https://www.geoguessr.com/it/vgp/3092) · [shop](https://shop.geoguessr.com) · [gift card](https://www.geoguessr.com/gift-card)
- Wikipedia — [GeoGuessr (EN)](https://en.wikipedia.org/wiki/GeoGuessr) · [Worldle (EN)](https://en.wikipedia.org/wiki/Worldle) · [Wordle (EN)](https://en.wikipedia.org/wiki/Wordle) · [Comuni della Sardegna (IT)](https://it.wikipedia.org/wiki/Comuni_della_Sardegna)
- Worldle / Teuteuf — [worldle](https://worldle.teuteuf.fr/) · [stats](https://worldle.teuteuf.fr/stats) · [WhereTaken](https://wheretaken.com/) · [Statle](https://statele.teuteuf.fr/) · [App Store](https://apps.apple.com/app/apple-store/id6505002321) · [Play Store](https://play.google.com/store/apps/details?id=fr.teuteuf.worldle.twa) · [TikTok](https://www.tiktok.com/@teuteufgames) · [Instagram](https://www.instagram.com/teuteufgames)
- Altri daily geografici — [Globle](https://globle.org/) · [GeoDle IT](https://geodle.org/it) · [GeoDle sagome](https://geodle.org/it/outline) · [GeoRankle IT](https://georankle.io/it) · [GeoFun Games IT](https://www.geofungames.com/it) · [Geo Sfida Quotidiana](https://www.geofungames.com/it/games/daily-challenge) · [Indovina la Città](https://www.geofungames.com/it/games/guess-the-city) · [GeoGames.io IT](https://geogames.io/it) · [MapGuesser IT](https://mapguesser.fr/it/game) · [WorldGuessr](https://www.worldguessr.com/) · [WorldGuessr daily](https://www.worldguessr.com/daily) · [WorldGuessr Italia](https://www.worldguessr.com/map/italia) · [OpenGuessr](https://www.openguessr.com/)
- Wordle in italiano / directory — [Relaydle](https://relaydle.com/it/) · [Wordly IT](https://wordly.org/it) · [Wordle.global IT](https://wordle.global/it) · [Wordle.me IT](https://wordle.me/it)
- Quiz — [JetPunk](https://www.jetpunk.com/) · [Comuni Sardegna con mappa](https://www.jetpunk.com/user-quizzes/183621/comuni-della-sardegna-con-mappa) · [Quiz sulla Sardegna](https://www.jetpunk.com/user-quizzes/73781/quiz-sulla-sardegna) · [Indovina la regione](https://www.jetpunk.com/user-quizzes/1968512/indovina-la-regione-italiana-dall-immagine) · [PurposeGames Comuni Sardegna](https://www.purposegames.com/game/comuni-della-sardegna) · [PurposeGames Province e Comuni](https://www.purposegames.com/game/a3b12315de) · [Divario Italia](https://divarioitalia.it/quiz/indovina-la-regione)
- App Play Store — [Le regioni d'Italia](https://play.google.com/store/apps/details?id=com.asmolgam.italy&hl=it) · [Quiz Geografia Italia](https://play.google.com/store/apps/details?id=com.mappadellitalia.geografiadellitalia&hl=it) · [Regioni e Province](https://play.google.com/store/apps/details?id=air.com.gamesaien.italyregionsandprovincesmapquiz&hl=it) · [Province e città](https://play.google.com/store/apps/details?id=fr.ivaska.province_italia&hl=it)
- Didattica — [Wordwall community Geografia Sardegna](https://wordwall.net/it-it/community/geografia/sardegna) · [Wordwall QUIZ SARDEGNA](https://wordwall.net/it/resource/70295957/quiz-sardegna) · [Wordwall Sardegna](https://wordwall.net/it/resource/3156609/geografia/quiz-sardegna) · [didattica.live](https://didattica.live/) · [didattica.live regioni](https://didattica.live/medie/prima/geografia/quiz/regioni-italia) · [PanQuiz](https://www.panquiz.com/scuola/) · [risorsedidattiche.net](https://www.risorsedidattiche.net/scuola_secondaria/geografia/geografia.php) · [HubScuola Geografia](https://area-geografia-ss1g.hubscuola.it/) · [Scuola Media Digitale](https://www.scuolamediadigitale.it/)
- Altri quiz sulla Sardegna — [cartoni.wiki](https://www.cartoni.wiki/blog/geografia_quiz-sardegna_blog_778) · [Italian Travel Team](https://www.italiantravelteam.com/quiz-sardegna/) · [Ricerche per la scuola](https://www.ricercheperlascuola.it/quiz/la-sardegna-ricerca-per-bambini/) · [Genially](https://view.genially.com/6463bb668bd37f0012ee46eb/interactive-content-quiz-sardegna) · [Quizalize](https://resources.quizalize.com/view/quiz/sardegna-bc2badc0-85ef-48f8-99df-8736772d6367)

**Community, social e canali**
- [r/Sardegna](https://www.reddit.com/r/Sardegna/) · [r/Sardegna wiki](https://www.reddit.com/r/Sardegna/wiki/index/) · [r/Sardinia](https://www.reddit.com/r/Sardinia/) · [thread creator sardi](https://www.reddit.com/r/Sardinia/comments/1c0idqf/best_instagram_tiktok_accounts_to_follow_for/) · [r/geoguessr wiki Italy](https://www.reddit.com/r/geoguessr/wiki/italy/) · [Elenco subreddit italiani](https://www.reddit.com/r/Italia/comments/o6nbkf/elenco_dei_subreddit_italiani/) · [Awesome Italian Reddit](https://danieleongari.github.io/awesome-italian-reddit/)
- Facebook — [Sei sardo se (pagina)](https://www.facebook.com/seisardosepage/) · [gruppo seisardose](https://www.facebook.com/groups/seisardose/) · [gruppo 640614692652748](https://www.facebook.com/groups/640614692652748/) · [gruppo 891587478163559](https://www.facebook.com/groups/891587478163559/) · [gruppo 1135908483090170](https://www.facebook.com/groups/1135908483090170/) · [I Sardi Nel Mondo](https://www.facebook.com/groups/infodeisardinelmondo/) · [gruppo 338433455733](https://www.facebook.com/groups/338433455733/) · [Pro Loco Sardegna](https://www.facebook.com/p/Pro-Loco-Sardegna-100057120443404/)
- Instagram / TikTok — [@ig_sardinia](https://www.instagram.com/ig_sardinia/) · [@geoguessritalia](https://www.instagram.com/geoguessritalia/) · [@lasarda81](https://www.tiktok.com/@lasarda81/video/7617442383671594262) · [@anemiska](https://www.tiktok.com/@anemiska) · [video IT Geoguessr](https://www.tiktok.com/@anemiska/video/7403403705300700448) · [@instasardegna](https://www.tiktok.com/@instasardegna) · [@sardegnatiktok](https://www.tiktok.com/@sardegnatiktok) · [#geoguessr](https://www.tiktok.com/tag/geoguessr)
- YouTube / Twitch — [@geoguessritalia](https://www.youtube.com/@geoguessritalia) · [linktr.ee/geoguessritalia](https://linktr.ee/geoguessritalia)
- Influencer sardi — [Kolsquare](https://www.kolsquare.com/it/top-influencers/i-top-instagrammer-sardi-secondo-kolsquare) · [Narame Agency](https://www.narameagency.com/influencer-sardegna-2025-content-creator/) · [Influenxer](https://www.influenxer.it/influencer/sardegna-creator/)

**Media, istituzioni, diaspora, università**
- [L'Unione Sarda](https://www.unionesarda.it/) · [I Sardi Nel Mondo](https://www.unionesarda.it/sardi-nel-mondo) · [Circoli](https://www.unionesarda.it/sardi-nel-mondo/circoli) · [La Nuova Sardegna](https://www.lanuovasardegna.it/) · [SardiniaPost](https://www.sardiniapost.it/) · [CagliariPad](https://www.cagliaripad.it/) · [pezzo travel creator](https://www.cagliaripad.it/674250/sardegna-regina-dei-social-boom-di-travel-creator-e-video-virali-dalle-spiagge/) · [Vistanet](https://www.vistanet.it/) · [Quiz per sardi doc](https://www.vistanet.it/cagliari/2026/04/30/quiz-per-sardi-doc-riuscite-a-indovinare-in-quale-spiaggia-ancora-selvaggia-ci-troviamo/) · [tuttigiornali Sardegna](https://www.tuttigiornali.it/sardegna/) · [cronacamedia](https://cronacamedia.it/blog/sardegna-notizie-cronaca-politica-cultura-sport/)
- Radio — [Radiolina](https://radiolina.it/) · [Radio X](https://www.radiox.it/) · [radio-italiane.it Sardegna](https://www.radio-italiane.it/radio/sardegna) · [OnlineRadioBox Sardegna](https://onlineradiobox.com/it/Sardinia-/)
- Turismo / istituzioni — [SardegnaTurismo](https://www.sardegnaturismo.it/it) · [Regione Sardegna](https://www.regione.sardegna.it/)
- Pro Loco — [UNPLI Sardegna](https://www.unpli.info/comitati-regionali/sardegna/) · [UNPLI Chi siamo (6.200 associazioni, 600.000 soci)](https://www.unpli.info/chi-siamo-2/) · [prolocosardegna.net](http://www.prolocosardegna.net/UNPLI/index.php) · [delibera Regione Sardegna su contributi Pro Loco](https://delibere.regione.sardegna.it/api/assets/c463fd63-b155-451b-945a-fd2ced13dafe)
- Università — [Unica — associazioni studentesche](https://www.unica.it/it/didattica/vita-universitaria/associazioni-studentesche) · [ERSU Cagliari](https://www.ersucagliari.it/) · [ERSU Sassari](https://ersusassari.it/)
- Diaspora — [SardegnaMondo circoli](https://www.sardegnamondo.it/circoli/) · [Circoli sardi nel mondo (con contatti)](https://www.mlnsardu.org/wordpress/circoli-sardi-nel-mondo/)

**Dati su piattaforme e comportamenti**
- [DataReportal — Digital 2025: Italy](https://datareportal.com/reports/digital-2025-italy) · [Similarweb — jetpunk.com](https://www.similarweb.com/website/jetpunk.com/) · [Esendex — statistiche WhatsApp](https://www.esendex.it/blog/post/statistiche-whatsapp/) · [Sendseven — WhatsApp Italia 2026](https://sendseven.com/it/blog/statistiche-whatsapp-italia-2026) · [The Global Digest — WhatsApp in Italia](https://theglobaldigest.com/it/whatsapp-in-italia-dominio-regolamentazione-e-futuro-della-messaggistica/) · [Blacklemon — Social Media in Italia 2025](https://www.blacklemon.com/servizi/social-media-marketing/social-media-in-italia-2025-dati-statistiche-e-confronto-con-il-mondo.html) · [Open.online — italiani e social](https://www.open.online/2024/02/21/italiani-social-media-rapporto-digital-2024-whatsapp-tiktok/)

**Analisi sulla viralità (fonti secondarie, non primarie)**
- [dinogame.gg — Why Wordle blew up](https://dinogame.gg/blog/why-wordle-blew-up/) · [nichemetric.com — Wordle case study](https://www.nichemetric.com/blog/wordle-free-game-nyt-acquisition-case-study) · [getnoise.com — Why did Wordle go viral](https://getnoise.com/q/why-did-wordle-go-viral) · [realgrowthmatters.com — Wordle/NYT](https://realgrowthmatters.com/learn/case-studies/wordle-nyt-acquisition/) · [puzzlecottage.com — Wordle history](https://puzzlecottage.com/wordle-history)

**Prodotto analizzato**
- [github.com/emaxgms/intzetta](https://github.com/emaxgms/intzetta) · [README raw](https://raw.githubusercontent.com/emaxgms/intzetta/main/README.md) — contatto: `emavacca00@gmail.com`, Instagram [@emavacca](https://www.instagram.com/emavacca). Stack: React + React-Leaflet + **Esri World Imagery**, Firebase (Auth, Firestore), `@turf/turf` per i calcoli geografici, DiceBear per gli avatar. Licenza MIT.

**Ricerca keyword (fallita — documentata)**
- ❌ Google Trends: `https://trends.google.com/trends/explore?geo=IT&q=quiz%20sardegna,geoguessr,quiz%20geografia` → **HTTP 429 Too Many Requests** (verificato anche via `r.jina.ai`)
- ❌ AppBrain: [com.asmolgam.italy](https://www.appbrain.com/app/le-regioni-d-italia-quiz/com.asmolgam.italy), [com.mappadellitalia.geografiadellitalia](https://www.appbrain.com/app/quiz-geografia-italia/com.mappadellitalia.geografiadellitalia) → **HTTP 403** (protezione Cloudflare)
- ❌ Reddit `about.json`: [r/Sardegna](https://www.reddit.com/r/Sardegna/about.json), [r/Sardinia](https://www.reddit.com/r/Sardinia/about.json) → **HTTP 403**

---

*Fine del report. Tutte le affermazioni marcate ✅ sono state lette direttamente dalle fonti citate in questa sessione. Le stime 🔴 vanno validate con strumenti a pagamento prima di decisioni di investimento.*
