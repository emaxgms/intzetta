# Intzetta — Piano di monetizzazione operativo

> Documento decisionale per il titolare. Ultimo aggiornamento: **ricerca del 2026**, dati verificati con URL in calce.
> Legenda: ✅ **verificato su fonte** · 🟡 **deduzione** (conseguenza logica di fatti verificati) · 🔴 **stima dichiarata** (non verificabile).
> **Avvertenza di metodo:** il tool di ricerca web di questa sessione era privo di API key. La verifica è stata fatta con `web_fetch` diretto sulle pagine ufficiali (e su DuckDuckGo HTML come motore di ricerca). Le pagine `support.google.com` restituiscono il corpo troncato al fetch diretto: dove indicato, il contenuto è stato letto tramite proxy di rendering. Tutto ciò che non ho potuto leggere è marcato 🔴 o dichiarato non verificabile. **Nessun numero è inventato: dove non c'era fonte, c'è scritto che non c'è.**

---

## 0. La risposta in una riga

**Con 0 utenti attivi, attivare la pubblicità non serve a niente. Il collo di bottiglia non è la monetizzazione: è il traffico.** Con 20.000 partite/mese questo documento parla di **circa 30-90 € lordi al mese**, non di migliaia di euro. Ogni ora spesa sull'ottimizzazione degli annunci prima di avere 1.000 partite/mese è un'ora buttata; ogni ora spesa su contenuti indicizzabili e distribuzione vale 100 volte tanto. Il sistema vite + abbonamento ha senso **solo dopo** i 5.000 utenti attivi mensili.

---

## 1. Mappa delle possibilità pubblicitarie gratuite

### 1.1 La scoperta che cambia il piano: AdSense richiede contenuto

Questa è la cosa più importante del documento, e va letta prima di tutto il resto.

Le **Norme per i publisher di Google**, sezione *Inventory value*, dicono letteralmente:

> "We do not allow Google-served ads on screens: without publisher-content or with low-value content, that are under construction, that are used for alerts, navigation or other behavioral purposes." ✅ ([support.google.com/publisherpolicies/answer/10502938](https://support.google.com/publisherpolicies/answer/10502938?hl=en))

E le **AdSense Program policies** elencano fra i divieti di posizionamento:

> "Placed on any non-content-based page." ✅ ([support.google.com/adsense/answer/48182](https://support.google.com/adsense/answer/48182?hl=en))

E tra i requisiti di ammissibilità:

> "Your content must be high-quality, original, and attract an audience." ✅ ([support.google.com/adsense/answer/9724](https://support.google.com/adsense/answer/9724?hl=en))

**Tradotto per Intzetta:** un sito che è *solo* un gioco a pagina singola con la mappa — nessun testo, nessuna pagina editoriale — **rientra nel caso vietato**. È il motivo numero uno per cui i siti di giochi si vedono rifiutare AdSense o se lo vedono disattivare dopo l'approvazione.

**Le 6 pagine sui comuni non sono un contorno: sono la condizione di ammissibilità.** Senza contenuto editoriale attorno al gioco, AdSense non approva. Con esse, il sito smette di essere "un gioco a pagina singola" e diventa "un sito di contenuto sulla geografia della Sardegna che include un gioco".

**Cosa fare, concretamente, prima di candidarsi:**

1. Ogni pagina comuni-provincia deve avere **almeno 400-600 parole scritte da una persona**, non generate in serie. Non "Cagliari: 1.234 abitanti, superficie X km²" per 377 comuni: quel contenuto è *thin content* e non passa. Servono testi con un punto di vista: storia, curiosità, cosa vedere, perché quel nome è interessante, aneddoti locali.
2. Almeno **8-10 pagine con contenuto realmente originale**, non 6 cloni provinciali. Se le 6 pagine sono generate dallo stesso template con i dati cambiati, Google le legge come una sola pagina duplicata sei volte.
3. Pagine obbligatorie per l'approvazione, indipendentemente dai contenuti: **Privacy Policy**, **Chi siamo**, **Contatti** (con un indirizzo email reale funzionante), **Termini di servizio**.
4. Un **menù di navigazione** che porti alle pagine di contenuto dal gioco. Se il contenuto esiste ma nessuno ci arriva e non è linkato, non conta.
5. Candidarsi **dopo** aver pubblicato i contenuti, non prima.

🟡 Se non fai questo, il rischio non è "l'approvazione tarda": è il rifiuto, e un rifiuto va poi gestito con una ri-candidatura che richiede tempo. Meglio arrivare al form con il sito già a posto.

### 1.2 Il formato che rende: fullscreen sì, ma solo con l'esenzione di Google

I **Better Ads Standards**, che le Norme Google rendono vincolanti, vietano sul mobile web i *Prestitial Ads* e i *Full-screen Scrollover Ads*:

> "Mobile Web Experiences: Pop-up Ads, Prestitial Ads, Ad Density Higher Than 30%, Flashing Animated Ads, Auto-playing Video Ads with Sound, Postitial Ads with Countdown, Full-screen Scrollover Ads, Large Sticky Ads" ✅ ([betterads.org/standards](https://www.betterads.org/standards/))

Le Norme Google lo ribadiscono:

> "You must not: place Google-served ads on screens that do not conform to the Better Ads Standards." ✅ ([support.google.com/publisherpolicies/answer/10502938](https://support.google.com/publisherpolicies/answer/10502938?hl=en))

**Conseguenza pesante:** il video a schermo intero dopo la partita, fatto con **un normale banner AdSense "fluid" a tutto schermo, viola le policy.** Non è una zona grigia: è una violazione che porta alla disattivazione dell'erogazione.

**L'unica strada legittima** è **H5 Games Ads**, che concede un'esenzione esplicita e di portata limitata:

> "If you are approved for access, then by using the H5 Games Ad Placement APIs described in this documentation, you acknowledge that use of the Ad Placement API provides a limited scope permission to use full screen ads as described in this policy article." ✅ ([developers.google.com/ad-placement/docs/signup](https://developers.google.com/ad-placement/docs/signup))

E le regole che l'esenzione impone sono queste — vanno rispettate alla lettera:

> "Publishers are not allowed to use full screen ads: ... that are triggered after a user closes another full screen ad. ... that trigger after every user interaction." ✅ ([support.google.com/adsense/answer/9959170](https://support.google.com/adsense/answer/9959170))

🟡 **Non "ogni partita vale un video" in senso cieco.** "After every user interaction" è vietato. Un video dopo *ogni* partita, sessione dopo sessione, si avvicina molto a quella definizione. La lettura prudente: **un video per partita classificata, con un tetto giornaliero, mai due video consecutivi, mai a partita iniziata**. Con 3 vite al giorno il tetto si auto-impone: massimo 3 video al giorno per utente registrato. Sulle partite di allenamento, che sono illimitate, **il video va limitato (es. 1 ogni 2-3 partite)** proprio per non trasformarsi in "after every user interaction".

### 1.3 Tabella comparativa dei network

| Network | Serve P.IVA? | Requisiti minimi | Revenue share | Pagamento minimo | Adatto a sito italiano piccolo? | Note |
|---|---|---|---|---|---|---|
| **Google AdSense** (display) | No per aprire (è sufficiente il Codice Fiscale) 🟡 | Contenuto originale e di qualità; **no pagine non basate su contenuto** ✅ | 80% (≈68% se l'inserzionista compra via Google Ads) ✅ | 70 € con bonifico ✅ | **Sì, è il punto di partenza** | Va attivato solo dopo aver pubblicato i contenuti editoriali |
| **AdSense H5 Games Ads** (interstitial + rewarded) | No per aprire | **By application**: account AdSense approvato + *partner eligibility*, approvazione non garantita ✅ | Non pubblicata per il video ✅ (non verificabile) | Come AdSense | **Sì, ma è la parte incerta** | È l'**unico** modo legittimo per il fullscreen. Italia presente nel form di candidatura 🟡 |
| **Google Ad Manager** | No | Nessuna soglia self-service; gratis fino a **200 M impression/mese in Italia** ✅ | Dipende dalla domanda che colleghi | Come AdSense | **Tecnicamente sì, praticamente no** | Ad Manager 360 è a contratto e non self-service ✅. A questi volumi non aggiunge nulla che AdSense non faccia |
| **EthicalAds** | No | **50.000 pageview/mese**, siti *developer-focused*, invito ✅ | 70% ✅ | 50 $ ✅ | **No, oggi** | È l'unico network davvero *cookieless* (niente banner). Tienilo in lista per il futuro: ma vuole pubblico tecnico, non geografia |
| **Ezoic** | No | **250.000 utenti attivi mensili** ✅ (sotto soglia esiste l'Incubator Program) | Non pubblicata | Variabile | **No** | Sei a 24 utenti registrati: sei lontanissimo. Richiede CMP |
| **Media.net** | Non specificato | Nessuna soglia pubblicata; approvazione discrezionale, ads.txt obbligatorio ✅ | Non pubblicata | ~100 $ (non verificato) | **No** | La domanda è concentrata su USA/CA/UK: il tuo traffico italiano varrebbe poco 🟡. Non è confermato che accetti publisher italiani |
| **Snigel / Publisher Collective** | **Sì** 🟡 | **3 M pageview/mese**, o siti da ~300 €/giorno ✅ | Non pubblicata | Variabile | **No** | Managed service: serve un rapporto commerciale, quindi P.IVA |
| **Playwire** | **Sì** 🟡 | **500.000 pageview/mese** + footprint USA/UK/CA ✅ | Non pubblicata | Variabile | **No** | Il requisito di traffico anglofono ti esclude due volte |
| **Publift** | **Sì** 🟡 | >**2.000 USD/mese** di ricavi ads (o 500k pageview) ✅ | Non pubblicata | Variabile | **No** | Valutano siti in forte crescita anche sotto soglia, ma non a 24 utenti |
| **Setupad** | **Sì** 🟡 | Self-serve da **10 M visite/mese** ✅ | Non pubblicata | Variabile | **No** | Fuori scala di tre ordini di grandezza |
| **Adcash** | No | Nessuna soglia pubblicata, revisione compliance ✅ | Non pubblicata | **5 USD** (PayPal/Revolut/Skrill) ✅ | Sì come ripiego | Formati: Video (In-Stream/Pre-Roll/Slider), Pop-Under, In-Page Push, Interstitial, Display, Autotag ✅. **Nessun rewarded video** ✅ |
| **Monetag** (ex PropellerAds) | No | **Nessun minimo di traffico** ✅; serve dominio proprio, no blogspot/wix | Non pubblicata | **5 $** (PayPal/Skrill/Webmoney); 1.000 $ per bonifico ✅ | Sì come ripiego | SmartLink, Popunder, Push, In-Page Push, Vignette — **nessun rewarded** ✅ |
| **Adsterra** | No | Rifiuta siti "with extremely limited audiences" ✅ | Non pubblicata | **5 $** ✅ | Sì, quando avrai un minimo di traffico | **Nessun rewarded video** ✅. Richiede privacy policy e consenso cookie ✅ |
| **AppLixir** | No | **100.000 impression/mese** ✅ | Non pubblicata | Variabile | **Non ancora, ma è il candidato giusto per il rewarded** | Rewarded video web-first, CPM dichiarati 4-15 $ ✅, **CMP Didomi inclusa** ✅ |
| **AdInPlay** (gruppo Venatus) | **Sì** 🟡 | Nessuna soglia pubblica, onboarding gestito dal team ✅ | Non pubblicata | Variabile | **Da contattare a 20-30k partite/mese** | Offre esplicitamente rewarded, video, banner, interstitial per publisher di browser game ✅ |
| **Playgama** | No | Serve il gioco con SDK integrato | **50%** su playgama.com; 70/80/90% a scaglioni sui siti partner ✅ | **100 $** ✅ | Sì, ma è un altro mestiere | Distribuzione su YouTube Playables, MSN, Facebook, Yandex, TikTok ✅. Payout 100 $ ✅ |
| **GameDistribution** | No per lo sviluppatore | Il publisher (sito) **deve avere Google Ad Manager** ✅ | **33%** al developer ✅ | **100 €** ✅ | **No, per te** | Richiede localizzazione in inglese ✅. Il publisher prende 33% ma deve ospitare giochi **altrui** ✅ |
| **CrazyGames SDK** | No | Devi pubblicare su CrazyGames | Non applicabile | **100 €** ✅ | **No** | SDK disabilitato fuori da crazygames.com ✅; **solo le loro ads sono ammesse** ✅; **inglese obbligatorio** ✅ |
| **Poki** | No | Devi pubblicare su Poki | 50/50 sul traffico Poki, 100% sul tuo ✅ | Non verificato | **No** | *Platform-only monetization* ✅. L'italiano è previsto (EFIGS) ma non risolve l'esclusiva web |

**Conclusione della tabella:** per Intzetta esistono oggi **tre opzioni reali** — AdSense display (subito, dopo i contenuti), AdSense H5 Games Ads (per il video, quando sarai approvato), e AdInPlay/AppLixir (quando avrai ~100.000 impression/mese, cioè circa 20.000-25.000 partite/mese). Tutto il resto è fuori scala o inadatto. **Adcash, Monetag e Adsterra li elenco per completezza, ma non li consiglio:** sono reti di popunder e push, e metterle su un gioco "pulito" che vuole farsi usare dalle scuole è un modo per distruggere la reputazione e la fidelizzazione prima di averla costruita.

### 1.4 Il vincolo di consenso che oggi non hai

Oggi Umami è senza cookie, quindi **non hai bisogno di un banner di consenso**. Questo è un vantaggio competitivo reale: nessun attrito all'ingresso.

🟡 **Attivare AdSense lo fa sparire.** AdSense usa cookie pubblicitari di terze parti; in EEA/UE richiede una CMP registrata presso IAB Europe (TCF). Google ha una pagina dedicata al tema: *"Publisher integration with the IAB Europe TCF"* ✅ ([support.google.com/adsense/answer/9804260](https://support.google.com/adsense/answer/9804260?hl=en)) — nota: il corpo della pagina non è leggibile al fetch diretto, quindi cito il titolo come prova, non il testo.

Il modello dei network lo conferma: Adcash impone una privacy policy che spieghi i cookie pubblicitari ✅, Adsterra impone il messaggio di consenso a ogni visitatore ✅, Monetag impone un sistema di opt-in per gli utenti UE ✅.

**Da mettere in conto:** il giorno in cui accendi AdSense, Intzetta passa da "nessun banner" a "banner di consenso GDPR" — con un calo di partenza del traffico e un'attivazione in più da gestire. È il costo di ingresso, non un imprevisto. **Se scegli EthicalAds o AppLixir, questo costo è zero o quasi** (AppLixir include la CMP nel network ✅): è l'unico vero argomento a favore di un network più piccolo.

---

## 2. Quale combinazione rende di più, in concreto

### 2.1 Come ho costruito i calcoli (leggere prima dei numeri)

Tutti gli scenari usano **partite totali al mese** (classificate + allenamento), come richiesto. Le ipotesi sono dichiarate e modificabili:

| Parametro | Valore usato | Perché |
|---|---|---|
| Impression banner per partita | **4,5** | Un banner a fondo pagina per schermata (home, round, risultato). Con 3 vite + allenamento la media realistica è 4-5. 🔴 stima |
| RPM banner (traffico italiano) | **1,5 €** | Numero già verificato nella ricerca precedente, confermato dall'ordine di grandezza dei dati indipendenti: 2-4 €/1.000 pageview per blog italiani generalisti ✅. 1,5 € è **prudente**, non ottimistico |
| Quota video (partite classificate) | **40%** delle partite | Sei piccolo: Google e i network non garantiscono fill rate alto sui publisher nuovi. 🔴 stima |
| eCPM video (Italia/UE) | **3,00 €** | I rewarded nei giochi web stanno a ~8-15 $ in UE ✅; il CPM italiano è ~1/3 degli USA ✅ (~1,90 $ vs ~5,20 $ ✅). Un eCPM di 3 € per un publisher italiano minuscolo è **generoso** |
| Costo variabile video | **0,35 €** per view | Se usi Google H5 Games, Google serve l'annuncio dal suo ad server e il publisher copre i costi tecnologici. 🔴 stima dichiarata, non verificata: potrebbe essere zero con H5 Games |
| Quota publisher su quanto vedi | **80%** ✅ | Revenue share AdSense for Content ✅ ([support.google.com/adsense/answer/180195](https://support.google.com/adsense/answer/180195)) |
| Commissione versamento AdSense | **~3%** 🔴 | Stima per bonifico su banca italiana, non verificata |
| Conversione free→paid | **0,5% / 1% / 2%** | Range indicato nella ricerca precedente; coerente con i benchmark: 1,83% dei giocatori mobile fa acquisti in-app ✅ (Unity), 2-5% è il benchmark ufficiale Unity per il mobile ✅. Il **web sta nella parte bassa**: 0,5-1% è realistico, 2% è ottimistico |
| Imposte | **non calcolate** | Dipendono dalla tua situazione. Vedi §3.4 |

### 2.2 Scenario A — Solo banner

Costo variabile: zero. Il netto è quindi il lordo × 80% (quota publisher) × 97% (commissione versamento).

| Partite/mese | Impression banner | Lordo | Netto (20% Google) | Netto in tasca |
|---|---|---|---|---|
| **5.000** | 22.500 | ~11 € | ~8,50 € | **~8 €/mese** |
| **20.000** | 90.000 | ~45 € | ~35 € | **~34 €/mese** |
| **80.000** | 360.000 | ~180 € | ~140 € | **~135 €/mese** |

**La soglia di pagamento di AdSense è 70 €** ✅: sotto quella cifra i soldi restano in account e **non arrivano**. Ecco quando la superi, con l'ipotesi che metà delle partite siano di allenamento (i video si contano solo sulle partite classificate):

| | Solo banner, RPM 1,5 € | Solo banner, RPM 3 € |
|---|---|---|
| **20.000 partite/mese** | ~34 € netti → **soglia NON superata** | ~69 € netti → **soglia al limite** |
| **40.000 partite/mese** | ~69 € netti → **soglia al limite** | ~137 € netti → superata |
| **80.000 partite/mese** | ~135 € netti → superata | ~275 € netti → superata |

🟡 **In parole povere: con il solo banner e l'RPM prudente di 1,5 €, il primo bonifico AdSense arriva attorno alle 40.000 partite al mese — e con i primi mesi di accumulo, realisticamente dopo 5-7 mesi di attività.** Aggiungendo il video la soglia si anticipa di poco (~34.000 partite/mese, perché il solo banner "premia" anche sulle partite di allenamento, che sono illimitate). Non è un dettaglio contabile: significa che per i primi mesi **non incassi nulla, qualunque cosa tu faccia**.

### 2.3 Scenario B — Banner + video 5 secondi dopo la partita

Questa è la parte più importante da capire: **il video rende molto per singola impression, ma ne hai pochissime.**

| Partite/mese | Lordo banner | Lordo video | **Lordo totale** | Netto dopo Google e costi video | Netto in tasca |
|---|---|---|---|---|---|
| **5.000** | ~11 € | ~1 € | **~12 €** | ~8 € | **~8 €/mese** |
| **20.000** | ~45 € | ~5 € | **~50 €** | ~34 € | **~33 €/mese** |
| **80.000** | ~180 € | ~19 € | **~199 €** | ~132 € | **~128 €/mese** |

**Sii brutale con te stesso, come chiedevi:**
- A **5.000 partite/mese il video vale circa 1 € al mese.** Non "poco": **niente**. E in cambio hai messo un video a schermo intero davanti agli occhi di ogni giocatore.
- A **20.000 partite/mese** parliamo di **~50 € lordi, ~33 € netti**. Sì: **cinquanta euro lordi al mese**. Non è una svista, è il conto.
- 🟡 **Il video a 5 secondi non è 8 volte il banner per i tuoi ricavi totali.** L'8× è un moltiplicatore di *eCPM per impression* ✅ (confermato da un caso pubblico su un gioco web: eCPM degli interstitial **8× più alto** dei banner, ma con **4,5× meno impression**, e i banner facevano comunque il **40% dei ricavi** ✅ — [mobidictum.com](https://mobidictum.com/monetizing-web-game-rocketgoal-playgama/)). Playgama avverte esplicitamente che **non esiste una quota standard** interstitial/banner ✅. Chi ti dice "il video ti moltiplica i ricavi per 8" ti sta vendendo il moltiplicatore sbagliato: quello giusto, sui *ricavi totali*, è nell'ordine di **1,1-1,5×**.
- Il problema strutturale: **il giocatore gioca 3 partite al giorno.** Più vite vendi, più video generi — ma anche più vite regali, e ogni vita gratuita è un video in meno che potevi monetizzare. Vedi §3.

### 2.4 Scenario C — Banner + video + abbonamento + vite

Qui bisogna prima dire una cosa che i numeri nascondono: **per vendere abbonamenti servono persone, non partite.** 20.000 partite/mese ÷ 30 giorni ÷ 3 partite al giorno ≈ **220 utenti attivi giornalieri**, che sono nell'ordine di **600-700 utenti attivi mensili** 🟡. Su quella base, l'1% di conversione significa **6-7 abbonati**. Sei. Non seicento.

| Partite/mese | Utenti attivi mensili 🟡 | Abbonati (0,5% / 1% / 2%) | Ricavi abbonamento | Ricavi vite 🔴 | **Totale premium lordo** | **Totale con ads lordo** |
|---|---|---|---|---|---|---|
| **5.000** | ~165 | 0 / 1 / 3 | 0-8 € | 0-4 € | **~0-12 €** | **~12-24 €** |
| **20.000** | ~660 | 3 / 7 / 13 | 8-33 € | 4-16 € | **~12-49 €** | **~62-99 €** |
| **80.000** | ~2.640 | 13 / 26 / 53 | 33-132 € | 16-65 € | **~49-197 €** | **~248-396 €** |

**Netto in tasca (Scenario C), dopo commissioni di pagamento ~5% sui ricavi premium:**

| Partite/mese | Ipotesi bassa | Ipotesi realistica | Ipotesi alta |
|---|---|---|---|
| 5.000 | ~8 € | ~15 € | ~26 € |
| 20.000 | ~35 € | ~60 € | ~115 € |
| 80.000 | ~135 € | ~225 € | ~425 € |

🟡 **L'abbonamento e le vite diventano la voce più importante dei ricavi solo sopra ~30.000-40.000 partite/mese.** Sotto, la pubblicità domina comunque, ed è dominante in modo misero.

### 2.5 Il verdetto onesto

| Soglia | Cosa succede davvero |
|---|---|
| **< 5.000 partite/mese** | La monetizzazione è **rumore**. Qualunque configurazione produce meno di 10 € al mese. **Non attivare niente.** |
| **5.000-20.000** | Il banner comincia a coprire i costi vivi (dominio + hosting Firebase, ~0-15 €/anno). **Non ci paghi una cena.** |
| **20.000-80.000** | Si parla di **30-100 € netti al mese**. Il video diventa visibile ma resta minoritario. La soglia dei 70 € di AdSense si supera attorno alle 23-25.000 partite/mese. |
| **80.000+** | **130-400 € netti al mese** a seconda della conversione premium. Qui il gioco inizia a essere un piccolo secondo lavoro, non un'attività. |
| **~200.000+** | Comincia a servire una partita IVA per gestirlo in modo pulito (abitualità, vedi §3.4) 🟡 |

**Il collo di bottiglia ha un nome e non è "AdSense vs rewarded": è il numero di persone che aprono il sito.** A 200.000 partite/mese sei nell'ordine di 6.500 utenti attivi mensili 🟡 — per un gioco iper-locale su una regione da 1,56 milioni di residenti, è l'1,4% della popolazione sarda che gioca almeno una volta al mese. Ambizioso ma non impossibile. **Prima di allora, tutto il resto è contabilità creativa.**

---

## 3. Progetto del sistema "vite + abbonamento"

### 3.1 Quante vite e perché quei numeri

**Proposta: 3 vite gratuite al giorno (le partite classificate), allenamento illimitato e fuori classifica.**

Perché 3 e non 5 o 10 — l'economia del gioco:
- **3 vite × 30 secondi per round × 5 round ≈ 7-8 minuti al giorno.** È la durata di una pausa caffè: il formato giusto per un gioco giornaliero mobile-first. Con 10 vite diventa 25 minuti, e chi ha 25 minuti probabilmente non apre un quiz sui comuni sardi.
- **La sfida giornaliera ha senso solo se è scarsa.** Se puoi giocare 10 volte, la classifica giornaliera diventa "chi ha più tempo", non "chi è più bravo". 3 vite la tengono una gara di abilità.
- **Il vincolo è ciò che crea il bisogno di comprare.** Con 3 vite gratuite e una partita sbagliata, resta la voglia di rigiocare *oggi*, non domani. È esattamente il momento in cui si vende un pacchetto di vite.
- **Attenzione al valore percepito dell'abbonamento:** 3 vite al giorno valgono ~90 partite al mese. A 0,33 €/vita (prezzo del pacchetto grande sotto), regalare 3 vite al giorno significa **regalare ~30 €/mese di valore teorico** e chiedere 2,99 €/mese per togliere la pubblicità. Il premium non deve vendere *vite*: deve vendere **niente pubblicità**. Le vite sono un prodotto separato e impulsivo. Tienili separati o l'abbonamento sembrerà una truffa.

🟡 **3 vite è già quello che il codice implementa** (`LIVES_PER_DAY = 3` in `src/utils/lives.js`): la proposta conferma la scelta, non la cambia.

### 3.2 Prezzi consigliati

Confronto con il mercato reale (prezzi verificati sulle pagine ufficiali):

| Prodotto | Prezzo | Cosa include | Confronto |
|---|---|---|---|
| **Pacchetto vite piccolo** | **0,99 €** | 3 vite (= 1 partita classificata extra al giorno per 3 giorni) | 0,33 €/vita 🔴 |
| **Pacchetto vite medio** | **2,49 €** | 10 vite | 0,25 €/vita 🔴 |
| **Pacchetto vite grande** | **4,99 €** | 25 vite | 0,20 €/vita 🔴 |
| **Abbonamento mensile** | **2,99 €/mese** | Niente pubblicità + 5 vite/giorno + statistiche | GeoGuessr Pro: **3,99 €/mese** su base annua (**47,88 €/anno**, prezzo pieno 6,99 €/mese) ✅ |
| **Abbonamento annuale** | **24,99 €/anno** | Come sopra | **JetPunk Premium: 12 / 20 / 40 $** ✅ · **GeoGuessr Pro: 47,88 €/anno** ✅ · **GeoGuessr Elite: 71,88 €/anno** ✅ |

**Perché questi numeri:**

1. **Il pacchetto piccolo sta sotto 1 €.** È la soglia psicologica dell'acquisto d'impulso su mobile. Sopra 1 € scatta la riflessione, e su un quiz gratuito la riflessione finisce quasi sempre con "no".
2. **Il pacchetto grande sta sotto 5 €.** Stessa logica, un ordine di grandezza sopra.
3. **L'annuale a 24,99 € è sopra JetPunk (20 $) e sotto GeoGuessr (47,88 €).** È la posizione giusta: JetPunk è la prova che **20 $/anno funziona** in questo genere ✅; GeoGuessr è la prova che **3,99 €/mese funziona** in un gioco di geografia ✅. Intzetta non ha né la scala di JetPunk né la profondità di GeoGuessr: posizionarsi nel mezzo con un prezzo più basso di GeoGuessr è difendibile, posizionarsi sopra è no.
4. **🔴 Nessuno mette il gioco principale a pagamento, ed è verificato:** JetPunk vende la rimozione della pubblicità ✅, Worldle ha un link "Remove Ads" nella home ✅, GeoGuessr vende *"Ad-free: Enjoy Geoguessr without ads!"* ✅. **Il gioco resta gratis per tutti, sempre.** Chi paga compra tempo, comodità e assenza di interruzioni — mai l'accesso.
5. **🔴 Il prezzo del "togli la pubblicità" a vita (pagamento una tantum) non è stato verificabile** su nessun concorrente diretto in questa ricerca: le pagine di checkout sono applicazioni JavaScript che non espongono i prezzi al fetch. Non ti do un numero inventato. La mia raccomandazione è di **non** offrire un "a vita" a questo stadio: incassi una volta e perdi il ricavo ricorrente proprio dagli utenti più affezionati.

### 3.3 Regole anti-abuso: il problema è grave, non teorico

**Il difetto attuale, nel codice:** `src/utils/lives.js` tiene le vite in `localStorage`. Il commento nel file lo ammette già:

> "Le vite vivono nella memoria del browser. Chi vuole imbrogliare puo' svuotarla e riottenere le vite gratuite."

Con la pubblicità e le classifiche, questo smette di essere un dettaglio tecnico e diventa **un problema economico**: chi svuota il localStorage ottiene vite illimitate gratis, quindi (a) non compra mai niente, e (b) **domina la classifica giornaliera**, che è il motivo per cui gli altri giocano. Un imbroglione visibile in cima alla classifica uccide la classifica.

**Regole da implementare, in ordine di importanza:**

1. **Le vite devono stare su Firestore, non nel browser.** Un documento per utente per giorno (`lives/{uid}_{data}`), con le regole di sicurezza Firestore che vietano la scrittura diretta del contatore dall'app. È l'unica contromisura che conta davvero.
2. **Il consumo della vita avviene lato server**, all'inizio della partita classificata, non alla fine. Se il consumo è alla fine, chi abbandona la partita non consuma la vita e gioca all'infinito.
3. **La sfida giornaliera è una sola per utente, per data.** La partita giornaliera valida i comuni del giorno con lo stesso seed su tutti i dispositivi; il tentativo viene marcato come consumato **al momento dell'avvio**, in una transazione che fallisce se esiste già un tentativo per quella data.
4. **La classifica non accetta punteggi scritti dal client.** Il punteggio va ricalcolato lato server (o validato con Cloud Functions) a partire dalle coordinate inviate dall'app e dal tempo trascorso. Oggi un utente con la console aperta può scrivere qualunque punteggio.
5. **Tetto all'accumulo delle vite comprate** (es. massimo 50): impedisce l'acquisto speculativo e rende il wallet più leggibile.
6. **Limite di frequenza** sulle partite classificate per account e per IP: 3 gratuite + le comprate, non di più. Impedisce la creazione massiva di account per rigiocare gratis.
7. **Tempistica minima fra due partite classificate** (es. 5 secondi): senza questo, un bot "gioca" 500 partite in un minuto.
8. **Non mostrare mai il punteggio esatto prima della conferma** e non riusare gli stessi comuni in ordine diverso: rende inutile la condivisione delle risposte.

🟡 **Finché non hai il conteggio lato server, la classifica è decorativa.** Se l'obiettivo è vendere vite e abbonamenti, il backend di validazione non è un "nice to have": è il prerequisito. Senza, stai vendendo un prodotto che chiunque può ottenere gratis con due click negli strumenti per sviluppatori.

### 3.4 Come incassare: Stripe, Paddle o Xsolla (e il nodo partita IVA)

I numeri reali, verificati:

| | **Stripe** | **Paddle** | **Lemon Squeezy** | **Xsolla** |
|---|---|---|---|---|
| Modello | Payment processor | **Merchant of Record** | **Merchant of Record** | Merchant of Record (gaming) |
| Costo | **1,5% + 0,25 €** carte standard SEE; 2,8% + 0,25 € carte premium SEE ✅ | **5% + 0,50 $** per transazione ✅ | **5% + 0,50 $**, +1,5% internazionali, +1,5% PayPal, +0,5% abbonamenti ✅ | Non verificato |
| Chi emette la fattura | **Tu** | **Paddle** ✅ | **Lemon Squeezy** | Loro |
| Chi versa l'IVA | **Tu** | **Paddle** ✅ | **Lemon Squeezy** | Loro |
| Aprire senza P.IVA | **Sì** ✅ (Codice Fiscale) | Non verificato | Non verificato | Non verificato |
| Costi extra | 20 € per contestazione ✅; SEPA 0,35 € ✅ | — | 1% payout fuori USA ✅ | — |
| Adatto a pacchetti da 0,99 € | **No, non economicamente** | **No** ✅ | **No** | Non verificato |

**Il punto critico che devi capire bene (e che è la vera notizia di questa sezione):**

✅ **Stripe permette a un privato senza partita IVA di aprire l'account.** È documentato esplicitamente:

> "Se non sei titolare di Partita IVA, durante l'attivazione del tuo account Stripe puoi inserire il tuo Codice Fiscale, che verrà utilizzato per la fatturazione elettronica." ✅ ([support.stripe.com](https://support.stripe.com/questions/faq-vat-e-invoicing-requirements-in-italy?locale=it-IT))

🟡 **Ma questo ti mette nei guai, non ti toglie dai guai.** Con Stripe resti **tu** il venditore verso il cliente: sei tu che devi emettere il documento fiscale al consumatore italiano, tu che devi gestire l'IVA, tu che rispondi del diritto di recesso. Un privato senza partita IVA **non può emettere una fattura a un consumatore**: non ha gli strumenti. Stripe ti dà l'incasso, non la conformità.

✅ **Paddle risolve il problema fiscale alla radice.** Paddle è *seller on record*:

> "Paddle acts as a reseller of your product, and is, therefore, the "seller on record". This way, Paddle will be responsible for the collection and payment of VAT and tax instead of you." ✅ ([paddle.com](https://www.paddle.com/help/start/intro-to-paddle/how-paddle-is-able-to-take-on-your-vat-and-tax-responsibilities))

e concretamente: *"Calculate and charge the correct amount of sales tax... Remit those taxes to the relevant tax authorities globally. Issue compliant invoices."* ✅

**Ma Paddle ha due problemi per te, ed è onesto dirli:**
1. ✅ **Prezzo minimo:** *"For products under $10, reach out to us for custom pricing."* Il tuo pacchetto vite da 0,99 € è **sotto i 10 $**. Paddle ti chiede di contattarli: significa che il micro-pacchetto non è il loro caso d'uso.
2. ✅ **Costo:** 5% + 0,50 $ fisso su una transazione da 0,99 € è una commissione del **~55%**. **Inaccettabile.** Su un abbonamento annuale da 24,99 €, invece, è l'8,4% circa: **tollerabile**.
3. Per un privato senza partita IVA, la fattura che Paddle riceve da te è una vendita B2B cross-border in **reverse charge** ✅ — e anche questa è una casella che va gestita con un commercialista, non a occhio. 🟡 *Verifica in anticipo se Paddle accetta un venditore privato senza P.IVA: la pagina che ho consultato non lo dichiara.*

**La conclusione operativa — e non è quella che ti aspetti:**

| Cosa vendere | Come incassarlo | Perché |
|---|---|---|
| **Pacchetti vite (0,99-4,99 €)** | **Rimandare.** Non prima della P.IVA. | Su 0,99 €, Stripe costa il 40% (0,25 € fissi su 0,99 € = 25%, più 1,5%): ti restano ~0,73 €. Paddle ti chiede un accordo custom. E senza P.IVA non puoi emettere il documento al cliente. **Il micro-pagamento è la cosa più difficile da fare legalmente, non la più facile.** |
| **Abbonamento mensile (2,99 €)** | Stripe, se hai la P.IVA | Su 2,99 € Stripe costa ~9%: accettabile |
| **Abbonamento annuale (24,99 €)** | **Paddle o Lemon Squeezy** | Loro emettono la fattura e versano l'IVA per te ✅. Su 24,99 € il 5% + 0,50 $ è ~8%. È l'unico prodotto che puoi vendere **davvero** senza partita IVA complessa 🟡 |
| **Xsolla** | Non considerarlo ora | Nasce per publisher di giochi con volumi e contratti; per un privato con 30 abbonati è sovradimensionato. Commissioni non verificate |

**Quando serve il commercialista — le tre soglie, in ordine:**

1. **Prima di incassare un solo euro da vendite ai consumatori** (non dalla pubblicità). Il nodo non è la tassa: è l'emissione del documento fiscale al cliente finale e la gestione dell'IVA. Con Paddle/Lemon Squeezy questo nodo si sposta su di loro ✅, ma il tuo reddito resta reddito da dichiarare.
2. **Prima di vendere a minorenni** (vedi §3.5): rischio annullabilità e rischio AGCM.
3. **Appena l'attività diventa abituale.** ✅ **Non esiste una soglia di fatturato che fa scattare la partita IVA.** La fonte dell'Agenzia delle Entrate è netta: *"non esistono regole o parametri quantitativi fiscali che consentono di individuare in maniera netta le differenze che distinguono le attività abituali da quelle occasionali"* ✅ ([fiscooggi.it](https://www.fiscooggi.it/portale/-/lavoro-occasionale-parasubordinato-e-autonomo-con-partita-iva-5)). L'abitualità si desume da **ripetitività, regolarità, stabilità e sistematicità** ✅, e può imporre la P.IVA **anche con compensi modesti e anche con un solo committente** ✅.
4. 🟡 **Il famoso limite dei 5.000 € non è una franchigia IVA.** È solo la soglia di iscrizione alla Gestione separata INPS: la circolare INPS n. 103/2004 parla di *"fascia di esenzione"* e prevede che, superata, i contributi siano dovuti solo sull'eccedenza ✅ ([INPS](https://servizi2.inps.it/servizi/Bussola/VisualizzaDoc.aspx?sVirtualURL=/Circolari/Circolare%20numero%20103%20del%206-7-2004.htm)). Chi ti dice "sotto 5.000 € sei a posto" ti sta dicendo una cosa falsa.

🟡 **La mia lettura del tuo caso:** ricavi pubblicitari che arrivano **ogni mese**, per anni, con continuità, sono **reddito abituale** anche se valgono 30 € al mese. Tecnicamente il presupposto della P.IVA c'è. **Non è un problema se resti sotto le soglie di fatto: è un problema se un giorno arrivi a 200.000 partite/mese e 400 € al mese di ricavi e non hai mai aperto niente.** Affronta la domanda con un commercialista quando il gioco supera **~150-200 €/mese ricorrenti**, non prima e non dopo. ✅ *Non ho potuto verificare l'importo esatto delle sanzioni per omessa fatturazione in caso di attività abituale senza P.IVA: quel punto va verificato a parte (D.Lgs. 471/1997 e D.Lgs. 74/2000).*

### 3.5 Nota legale: pubblicità e vendita a minorenni

Questo è il punto in cui il progetto può fare davvero male, perché **il gioco piace a studenti e scuole**, e questo ha tre conseguenze concrete.

**(a) Il segnale di età verso Google è cambiato, e va usato quello giusto.**

✅ I vecchi tag TFCD (child-directed) e TFUA (under age of consent) sono **deprecati**: oggi si usa il **TFAT, Tag for age treatment** ([support.google.com/adsense/answer/9007197](https://support.google.com/adsense/answer/9007197?hl=en)).

> "The tag for under age of consent (TFUA) and the tag for child-directed treatment (TFCD) are now deprecated. Instead, use the Tag for age treatment (TFAT)."

Con il valore **CHILD (1)** succede questo — ed è un colpo diretto ai ricavi:

> "Personalized ads and remarketing are disabled. Requests to third-party ad vendors, such as ad measurement pixels and third-party ad servers, are disabled." ✅

🟡 **Cosa significa in euro:** la pubblicità non personalizzata rende molto meno. Se tratti l'intero sito come *child-directed*, il tuo RPM non è 1,5-3 €: è probabilmente **la metà o meno**. Su 20.000 partite/mese, Scenario A scende da ~34 € netti a **~15-20 € netti**. Il "tratta tutto come child-directed, è più sicuro" è una scelta che paghi, e va fatta consapevolmente.

🟡 **La raccomandazione, e la motiva:** Intzetta **non è un sito per bambini**. È un gioco di geografia sulla Sardegna, pensato per un pubblico adulto (residenti, turisti, appassionati di geografia e cartografia), che **piace anche** agli studenti. "Piace ai minori" non equivale a "diretto ai minori". Per restare fuori dal trattamento *child* in modo difendibile:
- il tono del sito, i testi, le grafiche e i contenuti sono per adulti (geografia, turismo, cultura locale — non cartoni animati né mascotte);
- le pagine editoriali parlano di territorio e viaggi, non di "giochiamo insieme";
- **ma** appena c'è un minore identificabile, scatta il trattamento protettivo: **niente pubblicità personalizzata e niente acquisti per gli utenti che dichiarano meno di 16 anni.**

✅ Google, comunque, si riserva di trattare d'ufficio il sito come *child restricted* per i propri obblighi COPPA, dandone comunicazione ✅. La decisione non è interamente tua.

**(b) Le regole italiane ed europee sugli acquisti dei minori sono severe.**

- ✅ **Codice del Consumo, art. 26, comma 1, lett. e)** — *non* l'art. 23: è **in ogni caso aggressiva** la pratica che consiste nell'*"includere in un messaggio pubblicitario un'esortazione diretta ai bambini affinché acquistino o convincano i genitori o altri adulti ad acquistare loro i prodotti reclamizzati"* ✅ ([brocardi.it](https://www.brocardi.it/codice-del-consumo/parte-ii/titolo-iii/capo-ii/sezione-ii/art26.html)). Le pratiche aggressive sono accertate e sanzionate dall'**AGCM**.
- ✅ **DSA, art. 28, par. 2** — divieto di presentare pubblicità **basata sulla profilazione** che usi dati personali del destinatario se il fornitore sa con ragionevole certezza che è minore ✅ ([orientamenti della Commissione, GU C/2025/5519](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=OJ:C_202505519)). Gli orientamenti aggiungono che va garantito che **non venga sfruttata la mancanza di esperienza dei minori in ambito commerciale**, citando espressamente spese indesiderate, **valute virtuali** e meccaniche additive ✅.
- ✅ **Art. 1425 c.c.** — il contratto è annullabile se una parte era legalmente incapace di contrarre: **un acquisto di vite fatto da un minorenne è annullabile** su iniziativa sua o dei genitori ✅ ([Gazzetta Ufficiale](https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.progressivo=0&art.idArticolo=1425&art.versione=1&art.codiceRedazionale=042U0262&art.dataPubblicazioneGazzetta=1942-04-04&art.idGruppo=179&art.idSottoArticolo1=10&art.idSottoArticolo=1&art.flagTipoArticolo=2)). L'annullabilità cade solo se il minore ha **occultato l'età con raggiri** (art. 1426 c.c.) — e *"la semplice dichiarazione da lui fatta di essere maggiorenne non è di ostacolo all'impugnazione"* ✅. **Un checkbox "sono maggiorenne" non ti protegge.**
- ✅ **Precedente UE direttamente sul punto:** l'azione coordinata CPC sugli acquisti in-app (IP/14/847) stabilì che i giochi "gratuiti" non devono trarre in inganno sui costi reali, che **non devono contenere esortazioni dirette ai bambini all'acquisto** e che i pagamenti non devono avvenire tramite impostazioni predefinite senza consenso esplicito ✅ ([Commissione Europea](https://ec.europa.eu/commission/presscorner/api/files/document/print/en/ip_14_847/IP_14_847_EN.pdf)).
- ✅ **AdSense accetta solo titolari maggiorenni:** *"we can only accept applications from applicants who are at least 18 years of age"* ✅ ([support.google.com/adsense/answer/9724](https://support.google.com/adsense/answer/9724?hl=en)). Se il sito fosse di un minorenne, l'account dovrebbe essere di un genitore, che incasserebbe tutto.

**Come restare in regola, concretamente:**
1. **Gate di età neutro** all'ingresso: chiedi la data di nascita insieme alla provincia (serve già per la classifica provinciale, quindi non è un ostacolo). Niente autodichiarazione "sono maggiorenne" come unica difesa.
2. **Sotto i 16 anni: nessun acquisto, nessuna pubblicità personalizzata, nessuna classifica pubblica con nome.** Puoi lasciare il gioco completo e gratuito: è didatticamente giusto e ti protegge.
3. **Nessuna esortazione diretta all'acquisto rivolta a un minore.** Le offerte di vite e abbonamento non compaiono a chi si è dichiarato minorenne, e il copy non usa il registro "chiedi ai tuoi genitori".
4. **Consenso del genitore** per gli under 16 che vogliono la classifica con nome visibile.
5. **Nessuna meccanica di casualità a pagamento** (loot box, pacchetti vite "a sorpresa"): gli orientamenti UE le citano espressamente come rischio ✅, e in Italia sono terreno fertile per l'AGCM. Se un giorno le introduci, **le probabilità vanno pubblicate** e servono regole specifiche.
6. **Diritto di recesso:** vendendo a consumatori UE, il recesso di 14 giorni è la regola; per i contenuti digitali si può chiedere il consenso espresso alla fruizione immediata con perdita del recesso, ma **va chiesto in modo esplicito e tracciato**. Con i merchant of record (Paddle/Lemon Squeezy) questo onere è loro ✅; con Stripe è tuo.
7. **Scuole:** se vuoi lavorare con le scuole, la strada pulita è il **canale insegnante** (l'adulto usa il gioco in classe, nessun account per gli studenti o account senza pubblicità), non la vendita agli studenti. È la stessa scelta che fanno i prodotti educational seri.

---

## 4. Come NON fare la pubblicità

### 4.1 Il banner: in basso, non in alto

**In basso. Sempre in basso.** Motivo tecnico e non estetico: su mobile-first, l'area del pollice è la parte inferiore dello schermo, e la mappa di Leaflet **occupa tutto lo schermo ed è cliccabile**. Un banner in alto o sticky in alto sta nella zona in cui l'utente tocca per trascinare la mappa e per premere "Conferma": i click accidentali sono **il primo motivo di sospensione AdSense** e il primo motivo per cui un giocatore abbandona.

🟡 **Il codice fa già la cosa giusta.** `src/components/AdSlot.jsx` posiziona il banner in fondo, con un commento che spiega esattamente questo: *"sta in fondo alla pagina, mai sopra la mappa e mai sopra i pulsanti"*, *"altezza dichiarata, così non fa saltare il contenuto quando arriva"*, *"non si carica finché non è visibile"*. Sono le tre scelte corrette. Non cambiarle.

**Dimensioni consigliate:** 320×50 o 320×100 su mobile (formato standard, il meno invasivo e il meglio supportato), `data-ad-format="auto"` con `data-full-width-responsive="true"` come già impostato. Un'area di 300×250 quadrata "grande" su mobile occupa metà schermo: no.

**Il compromesso che vale la pena testare (solo dopo):** un banner sticky in basso **sulla sola schermata di risultato**, dove la mappa non c'è più e nessuno deve cliccare nulla. Sticky a fondo pagina nel gioco = no; sticky nel risultato = quasi sicuramente sì. Da testare con i dati, non a impressione.

### 4.2 Quando NON mostrare pubblicità (regole non negoziabili)

| Momento | Regola | Perché |
|---|---|---|
| **All'avvio, prima della prima partita** | **Mai.** Nessun prestitial, nessun video d'apertura | I Better Ads Standards li vietano ✅; le regole H5 Games vietano i fullscreen *"before the opening or after closing of the app/page"* ✅ |
| **Durante un round** | **Mai.** Nessun banner sopra la mappa, nessun popup, nessun interstitial fra un round e l'altro | Il round dura 30 secondi e il punteggio dipende dal tempo: qualunque interruzione falsa la partita. E "inaspettati durante la fruizione" è vietato ✅ |
| **Primi 3-5 secondi di sessione** | **Mai** | Il giocatore non ha ancora capito cosa fa il sito: è il momento in cui decide se restare |
| **Due fullscreen consecutivi** | **Mai** | Esplicitamente vietato ✅: *"that are triggered after a user closes another full screen ad"* |
| **Dopo ogni interazione utente** | **Mai** | Esplicitamente vietato ✅. È il vincolo che obbliga a limitare il video sulle partite di allenamento, che sono illimitate |
| **Su schermate "dead end"** | **Mai** | Vietato dalle Norme Google ✅: nessun annuncio dove l'utente non può uscire senza cliccare l'annuncio. Attenzione allo stato di fine vite: **deve sempre esserci un'uscita visibile** (allenamento gratuito) prima di qualunque offerta |
| **Su pagine senza contenuto** | **Mai** | È il divieto che rischia di farti rifiutare l'account ✅. Vedi §1.1 |
| **Densità pubblicitaria > 30%** | **Mai** | Soglia esplicita dei Better Ads Standards ✅ |

### 4.3 Perché il video di 5 secondi dopo la partita è il compromesso giusto

Il video dopo la partita funziona perché è **l'unico momento in cui l'utente sta già aspettando qualcosa**. Il round è finito, il punteggio sta per comparire: il video si inserisce in un'attesa che esiste comunque. È l'esatto contrario di un'interruzione, ed è per questo che è difendibile davanti alle policy e sopportabile per il giocatore.

**Ma cinque secondi sono cinque secondi solo se sono davvero cinque.** 🟡 **Il codice attuale ha qui un problema da correggere:** in `src/components/AdSlot.jsx`, il contatore dei 5 secondi parte e sblocca il pulsante "Vedi il risultato" **indipendentemente da quanto duri davvero l'annuncio**. Se l'annuncio reale dura 15 o 30 secondi (e con H5 Games Ads la durata la decide Google, non tu), il pulsante si sblocca mentre l'annuncio sta ancora andando — e la chiusura forzata dell'annuncio è a sua volta una violazione. **Il pulsante va sbloccato sull'evento `afterAd`/`adBreakDone` del network**, con i 5 secondi come *minimo* e non come timer autonomo.

**Altre due cose da sistemare prima di andare in produzione:**
- Il riquadro `<ins class="adsbygoogle" data-ad-slot="">` con `data-ad-format="fluid"` **non mostrerà nulla**: lo slot è vuoto e il formato fluid non è un rewarded. Va sostituito con la chiamata corretta all'API Ad Placement.
- `src/components/AdSlot.jsx` mostra i riquadri finti in modalità demo ("video pubblicitario", "spazio pubblicitario"). **Verifica che `VITE_ADS_MODE` non sia `demo` in produzione**: un finto annuncio pubblicato è peggio di nessun annuncio, e comunicare "pubblicità" senza mostrarla è ingannevole verso l'utente.

### 4.4 Un terzo formato che non hai considerato

🟡 **Nessun banner, nessun video: la sponsorizzazione locale diretta.** Un gioco sulla Sardegna con utenti sardi e turisti ha un inventario che vale più di 1,5 € di RPM per un motivo semplice: **un'azienda sarda paga per essere vista da chi gioca, non da chiunque navighi.** Cantina, agriturismo, museo, noleggio, giornale locale, Pro Loco, consorzio turistico.

Numeri grezzi, ma utili per capire l'ordine di grandezza: 🔴 un banner fisso venduto direttamente a **150-300 €/anno** a un singolo sponsor locale vale quanto **8.000-16.000 partite/mese** di AdSense. **Venti sponsor locali valgono più di tutto il tuo scenario a 80.000 partite/mese.** Non ha bisogno di AdSense, non ha bisogno di CMP, non ha bisogno di partita IVA complessa (è una prestazione occasionale verso un'azienda, che può emettere ritenuta d'acconto), e non dipende dal traffico internazionale. È la vera opportunità di monetizzazione iper-locale, ed è quella che quasi tutti i progetti come il tuo non vedono perché guardano solo i network.

---

## 5. Sequenza operativa

### Settimana 1 — Fondamenta (niente pubblicità)

- **Verifica che Umami registri gli eventi che contano**: partite iniziate, partite concluse, vite esaurite, click sulla condivisione WhatsApp, provenienza. Senza questi dati non saprai mai quale leva funziona.
- **Pubblica le pagine obbligatorie**: Privacy Policy, Chi siamo, Contatti (email reale), Termini di servizio. ⚠️ **Senza queste AdSense non approva, punto.**
- **Aggiungi il gate di età + provincia** (§3.5), che serve sia per la legge sia per le classifiche provinciali.
- **Distribuzione, non codice**: gruppi Facebook sardi di geografia/territorio, community di insegnanti, subreddit r/Sardegna, newsletter locali. Regala il gioco a 20 persone che conosci e guarda dove si bloccano.

### Settimane 2-4 — Primi 1.000 giochi

- **Obiettivo misurabile: 1.000 partite/mese.** Non euro: partite.
- Rilancia la sfida giornaliera con il testo di condivisione WhatsApp già pronto (è la leva di crescita più adatta a mobile-first italiano).
- **Riscrivi 8-10 pagine comuni con contenuto umano vero**, 400-600 parole ciascuna. Non generarle: scrivile. È il lavoro meno divertente e il più redditizio di tutto il progetto, perché è ciò che sblocca AdSense e il traffico organico insieme.
- Invia un paio di pagine a Google Search Console per l'indicizzazione. ⚠️ **Oggi il sito non risulta indicizzato nemmeno cercando il nome esatto** — è un problema di distribuzione, non di SEO fine.

### Settimane 5-8 — Soglia AdSense

- Solo ora, con contenuti pubblicati e navigabili: **candidati ad AdSense.**
- Aspettati una risposta in giorni o settimane. Se viene rifiutata, chiedi il motivo e **correggi prima di riprovare**: una ri-candidatura a vuoto consuma tempo.
- **Non attivare il banner durante l'attesa.** AdSense non paga le impression prima dell'approvazione, e il codice è già spento di default: lascialo spento.

### Settimane 9-12 — Accensione

- **Approva → accendi il banner** (`VITE_ADS_ENABLED=true` + client + slot). Il codice è pronto: è solo una variabile d'ambiente. Da questo momento **serve un banner di consenso GDPR**: mettilo in conto e misura il calo di traffico.
- **Candidati separatamente a H5 Games Ads** per il video a schermo intero. È un prodotto *by application* con approvazione non garantita ✅: candidarsi non costa, ma **non progettare nulla che dipenda dall'approvazione.**
- In parallelo: **correggi il contatore dei 5 secondi** (§4.3) e **prepara il conteggio delle vite lato server** (§3.3). Sono i due veri prerequisiti della monetizzazione premium.

### Settimane 13+ — Premium (solo se il traffico c'è)

- **Condizione di ingresso: almeno 5.000 partite/mese e ~500 utenti attivi mensili.** Sotto quella soglia il premium non si ripaga del tempo che costa costruirlo.
- Attiva l'abbonamento **annuale** per primo (24,99 €): è l'unico prodotto con commissioni sostenibili e, con un merchant of record, senza obblighi IVA in capo a te ✅.
- **Pacchetti vite e mensile: rimandali** finché non hai la partita IVA e la fatturazione elettronica a posto (§3.4). Non è prudenza eccessiva: su 0,99 € la commissione di Stripe è il 40% e non puoi emettere il documento al cliente.
- **Apri il discorso commercialista** quando i ricavi ricorrenti superano ~150-200 €/mese 🟡 (§3.4).

### Cosa NON fare finché non c'è traffico

1. **NON attivare la pubblicità con 0 utenti.** È la trappola principale, e il motivo è aritmetico: con 500 partite/mese il banner rende **~0,80 €**. Hai aggiunto un banner di consenso GDPR, un rischio di policy e un attrito all'ingresso, in cambio di ottanta centesimi. **Il collo di bottiglia è il traffico, non la monetizzazione.**
2. **NON comprare traffico.** Pagare 50 € per ottenere 2 € di pubblicità è un modo per perdere 48 € con metodo.
3. **NON candidarti a Ezoic (250k utenti ✅) né contattare Snigel (3M pageview ✅), Playwire (500k pageview ✅), Publift (2.000 $/mese ✅), Setupad (10M visite ✅).** Sono fuori scala di due ordini di grandezza: candidarsi oggi significa solo farsi mettere in lista d'attesa.
4. **NON iscriverti a CrazyGames o Poki.** Richiedono l'inglese ✅, vietano altre reti pubblicitarie dentro il gioco ✅, l'SDK è disabilitato sul tuo dominio ✅, e Poki chiede l'esclusiva web ✅. Su un gioco iper-locale in italiano sono la strada sbagliata — e quei portali **non sono adatti al progetto**, come già verificato.
5. **NON mettere popunder, push notification o interstitial aggressivi di Adcash/Monetag/Adsterra.** Rende qualche euro in più oggi e distrugge la fidelizzazione e la reputazione presso scuole e istituzioni, che sono il tuo canale di crescita più credibile.
6. **NON vendere vite prima del conteggio lato server.** Oggi chiunque può scrivere vite illimitate con due click negli strumenti per sviluppatori: venderesti un prodotto che l'acquirente può già avere gratis, e falserebbe la classifica.
7. **NON mettere il gioco principale a pagamento.** ✅ Verificato su JetPunk, Worldle e GeoGuessr: **nessuno lo fa.** Si vende la rimozione della pubblicità e le comodità, mai l'accesso.
8. **NON aprire la partita IVA per 30 €/mese di pubblicità.** Il costo di gestione supera il ricavo. 🟡
9. **NON aggiungere altri formati pubblicitari prima di aver misurato il primo.** Una variabile alla volta, con i dati di Umami, o non saprai mai cosa ha funzionato.
10. **NON fare il video prima della partita.** Mai, in nessuna configurazione, per nessun motivo ✅.

---

## 6. Cosa fare adesso

Cinque azioni, in quest'ordine, senza toccare la pubblicità:

1. **Pubblica Privacy Policy, Chi siamo, Contatti, Termini.** Oggi sono il prerequisito legale **e** il prerequisito AdSense. Costo: una serata. Valore: sblocca tutto il resto.
2. **Riscrivi 8-10 pagine comuni con contenuto umano di 400-600 parole.** È il lavoro che nessuno vuole fare e che decide se AdSense ti approva e se Google ti indicizza. Da fare **prima** della candidatura, non dopo.
3. **Porta il conteggio delle vite e la validazione dei punteggi su Firestore.** È il prerequisito di qualsiasi cosa a pagamento. Finché le vite stanno in `localStorage`, il sistema premium non è vendibile.
4. **Trova i primi 100 giocatori veri** (gruppi sardi, insegnanti, condivisione WhatsApp): misura con Umami, non a impressione. **Obiettivo: 1.000 partite/mese prima di qualunque discorso su AdSense.**
5. **Candidati ad AdSense solo quando i punti 1-2 sono fatti**, e accendi il banner solo dopo l'approvazione.

**E una decisione da prendere consapevolmente:** quanto vale il tuo tempo? Se il tuo obiettivo è **30-100 €/mese**, il percorso di questo documento lo raggiunge a 20.000-80.000 partite/mese e richiede mesi di lavoro sulla distribuzione. Se il tuo obiettivo è **costruire qualcosa che la Sardegna usi** — scuole, turisti, residenti — allora Intzetta ha senso e i ricavi pubblicitari sono un effetto collaterale gradito, non la ragione del progetto. **Sono due progetti diversi e vanno scelti adesso, perché le decisioni di prodotto cambiano:** il primo massimizza le impression, il secondo le minimizza. 🟡 La mia lettura dei fatti è che la seconda strada — contenuto di qualità, nessuna pubblicità invasiva, sponsorizzazioni locali, canale scuole — sia **più redditizia e più difendibile** della prima. Venti sponsor sardi valgono più di 80.000 partite di AdSense (§4.4).

---

## Fonti

### Google / policy
- AdSense — revenue share (80% / 68%): https://support.google.com/adsense/answer/180195 ✅
- AdSense — revenue share update, solo AdSense for Content: https://support.google.com/adsense/answer/14129646 ✅
- AdSense — requisiti di ammissibilità, contenuto originale, età 18+ del titolare: https://support.google.com/adsense/answer/9724?hl=en ✅
- AdSense — Tag for age treatment (TFAT), deprecazione TFCD/TFUA: https://support.google.com/adsense/answer/9007197?hl=en ✅
- AdSense Program policies — "non-content-based page": https://support.google.com/adsense/answer/48182?hl=en ✅
- Google Publisher Policies — Inventory value, Better Ads Standards, dead-end screen: https://support.google.com/publisherpolicies/answer/10502938?hl=en ✅
- Ad Placement API — iscrizione, prodotto *by application*, esenzione fullscreen: https://developers.google.com/ad-placement/docs/signup ✅
- AdSense H5 Games Ads — regole sui fullscreen, *adBreak()*: https://support.google.com/adsense/answer/9959170 ✅
- AdSense H5 Games Ads — pagina prodotto, eleggibilità: https://adsense.google.com/start/h5-games-ads/ ✅
- Ad Manager — soglie gratuite, Italia a 200 M impression/mese: https://support.google.com/admanager/answer/6214526 ✅
- Ad Manager 360 — account a pagamento, non self-service: https://support.google.com/admanager/answer/6022000 ✅
- TCF IAB Europe / CMP in EEA (solo titolo, corpo non leggibile): https://support.google.com/adsense/answer/9804260?hl=en ✅
- Better Ads Standards: https://www.betterads.org/standards/ ✅

### Network pubblicitari
- EthicalAds — publisher, 50k pageview: https://www.ethicalads.io/publishers/ ✅ · policy, 70% e soglia 50 $: https://www.ethicalads.io/publisher-policy/ ✅
- Ezoic — 250.000 utenti attivi mensili: https://support.ezoic.com/kb/article/getting-started-ezoics-requirements ✅
- Media.net — inventory policies: https://www.media.net/legal/inventorypolicies ✅
- Publisher Collective (ex Snigel) — 3 M pageview: https://www.publisher-collective.com/faq ✅
- Playwire — 500k pageview: https://www.playwire.com/faq ✅
- Publift — oltre 2.000 USD/mese: https://www.publift.com/how-it-works ✅
- Setupad — piani da 10 M visite: https://setupad.com/setupad-self-serve/ ✅
- Adcash — requisiti: https://support.adcash.com/en/articles/362 ✅ · formati video: https://adcash.com/video-ads/ ✅ · soglie di pagamento: https://support.adcash.com/en/articles/364-publisher-payments-overview ✅ · privacy/cookie: https://adcash.com/legal/ ✅
- Monetag (ex PropellerAds) — nessun minimo di traffico, formati, payout: https://propellerads.com/publishers/ ✅ · regole di contenuto: https://help.monetag.com/en/articles/6726292-website-content-main-rules-for-publishers ✅ · termini e opt-in UE: https://monetag.com/terms ✅
- Adsterra — termini publisher: https://adsterra.com/publishers-terms-managed/ ✅
- AppLixir — rewarded web, 100k impression, CMP Didomi, CPM 4-15 $: https://www.applixir.com/ ✅
- AdInPlay — rewarded per publisher di browser game: https://adinplay.com/publishers ✅
- Playgama — SDK e partner: https://playgama.com/developers ✅ · revenue share: https://playgama.com/blog/business-faqs/what-revenue-share-do-html5-game-portals/ ✅ · requisiti per piattaforma: https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements ✅
- GameDistribution — sviluppatori: https://gamedistribution.com/developers/ ✅ · termini developer (33%, 100 €): https://static.gamedistribution.com/terms/developer.html ✅ · termini publisher (Ad Manager obbligatorio): https://static.gamedistribution.com/terms/publisher.html ✅
- CrazyGames — SDK disabilitato fuori dominio: https://docs.crazygames.com/sdk/intro/ ✅ · solo ads SDK: https://docs.crazygames.com/requirements/ads/ ✅ · inglese obbligatorio: https://docs.crazygames.com/requirements/gameplay/ ✅ · soglia 100 €: https://docs.crazygames.com/faq/ ✅
- Poki — platform-only monetization: https://developers.poki.com/guide/requirements-quality ✅ · modello 50/50: https://developers.poki.com/guide/working-with-poki ✅ · localizzazione EFIGS: https://developers.poki.com/guide/localization ✅
- Benchmark interstitial vs banner (caso RocketGoal, eCPM 8×): https://mobidictum.com/monetizing-web-game-rocketgoal-playgama/ ✅
- Playgama — nessuno split standard interstitial/banner: https://playgama.com/blog/business-faqs/what-share-of-revenue-usually-comes-from/ ✅

### Pagamenti, fisco
- Stripe Italia — IVA e fatturazione, Codice Fiscale senza P.IVA: https://support.stripe.com/questions/faq-vat-e-invoicing-requirements-in-italy?locale=it-IT ✅
- Stripe — prezzi Italia: https://stripe.com/it/pricing ✅ · onboarding/KYC: https://docs.stripe.com/get-started/account/set-up?locale=it-IT ✅
- Paddle — prezzi 5% + 0,50 $: https://www.paddle.com/pricing ✅ · gestione IVA: https://www.paddle.com/help/sell/tax/how-paddle-handles-vat-on-your-behalf ✅ · seller on record: https://www.paddle.com/help/start/intro-to-paddle/how-paddle-is-able-to-take-on-your-vat-and-tax-responsibilities ✅
- Lemon Squeezy — merchant of record: https://docs.lemonsqueezy.com/help/payments/merchant-of-record ✅ · prezzi: https://www.lemonsqueezy.com/pricing ✅
- Agenzia delle Entrate / Fisco Oggi — occasionalità e abitualità, nessuna soglia quantitativa: https://www.fiscooggi.it/portale/-/lavoro-occasionale-parasubordinato-e-autonomo-con-partita-iva-5 ✅ · requisiti dell'occasionalità: https://www.fiscooggi.it/portale/-/quando-il-lavoro-autonomo-%C3%A8-occasionale ✅
- INPS — circolare 103/2004, i 5.000 € come fascia di esenzione contributiva: https://servizi2.inps.it/servizi/Bussola/VisualizzaDoc.aspx?sVirtualURL=/Circolari/Circolare%20numero%20103%20del%206-7-2004.htm ✅

### Legale, minori, consumatori
- Commissione UE — orientamenti art. 28 DSA (GU C/2025/5519): https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=OJ:C_202505519 ✅
- Codice del Consumo art. 26, comma 1, lett. e) — esortazione diretta ai bambini: https://www.brocardi.it/codice-del-consumo/parte-ii/titolo-iii/capo-ii/sezione-ii/art26.html ✅
- AGCM — pratiche commerciali scorrette e minori: https://www.agcm.it/competenze/tutela-del-consumatore/pratiche-commerciali-scorrette/ ✅
- Art. 1425 c.c. — annullabilità per incapacità: https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.progressivo=0&art.idArticolo=1425&art.versione=1&art.codiceRedazionale=042U0262&art.dataPubblicazioneGazzetta=1942-04-04&art.idGruppo=179&art.idSottoArticolo1=10&art.idSottoArticolo=1&art.flagTipoArticolo=2 ✅ · art. 1426 c.c. — raggiri del minore: https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.progressivo=0&art.idArticolo=1426&art.versione=1&art.codiceRedazionale=042U0262&art.dataPubblicazioneGazzetta=1942-04-04&art.idGruppo=179&art.idSottoArticolo1=10&art.idSottoArticolo=1&art.flagTipoArticolo=2 ✅
- Commissione UE — azione CPC sugli acquisti in-app (IP/14/847): https://ec.europa.eu/commission/presscorner/api/files/document/print/en/ip_14_847/IP_14_847_EN.pdf ✅

### Prezzi dei concorrenti e benchmark
- GeoGuessr — prezzi Pro (3,99 €/mese, 47,88 €/anno) ed Elite (71,88 €/anno): https://www.geoguessr.com/pricing ✅
- JetPunk Premium — 12 / 20 / 40 $: https://www.jetpunk.com/premium ✅
- Worldle — "Remove Ads" e Premium Membership: https://worldle.teuteuf.fr/ ✅
- Unity — payer conversion 2-5% (top 6-8%) e 1,83% di spender: https://unity.com/resources/in-app-purchases-guide ✅ · https://www.pocketgamer.biz/less-than-2-of-mobile-gamers-make-an-in-app-purchase/ ✅
- State of Web Gaming 2026 — 58% gioca perché è gratis; Poki 100 M MAU: https://www.gamespress.com/NEW-STUDY-REVEALS-THE-GROWTH-ENGAGEMENT-DISCOVERABILITY-AND-VALUE-DRIV ✅
- RPM AdSense Italia 2-4 €: https://crm.gtechgroup.it/knowledge-base/article/rpm-adsense-cos-e-questa-metrica-e-come-migliorarla ✅ · 10-30 €/mese per 5.000 visite: https://www.iofacciosoldi.com/google-adsense-guida/ ✅
- CPM programmatic per Paese (Italia ~1,90 $ vs USA ~5,20 $): https://adscalculator.xyz/blog/global-programmatic-display-cpm-benchmark-by-country-2025/ ✅
- JetPunk "Regions of Italy Map Quiz" — 155.790 tentativi cumulativi: https://www.jetpunk.com/quizzes/regions-of-italy ✅

### Codice del progetto (stato attuale)
- `src/utils/lives.js` — `LIVES_PER_DAY = 3`, vite in `localStorage` con limite noto dichiarato nel file
- `src/utils/ads.js` — pubblicità spenta di default, `VIDEO_SECONDS = 5`, `window.adBreak`/`window.adConfig` (API Ad Placement H5 già predisposta)
- `src/components/AdSlot.jsx` — banner in fondo con `IntersectionObserver`, altezza riservata; `VideoBreak` con timer autonomo di 5 secondi e `<ins>` con `data-ad-slot` vuoto (**da correggere**, §4.3)

### Dati di mercato (contesto già fornito, non riverificati)
- Residenti Sardegna 1,56 milioni; turisti 2025: 5,17 milioni di arrivi, 21,9 milioni di presenze
- RPM di riferimento: 1,5 € (display base) / ~6 € (interstitial + consenso fatto bene) / ~10 € (stack completo) per 1.000 pageview
- 100 €/mese ≈ 17.000 pageview con RPM 6 €
- Fullscreen ≈ 8× il banner per impression; CPM italiano ≈ 1/3 di quello statunitense; 58% gioca sul web perché "è gratis"
- Conversione free→paid realistica per giochi web casual: 0,5-2%
