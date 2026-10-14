/**
 * Misurazione degli eventi di gioco.
 *
 * Perche' esiste: fino a oggi non c'era NESSUNO strumento per sapere quante persone aprono il gioco
 * e quante partite finiscono. Senza questi numeri non si puo' ne' ottimizzare il prodotto ne'
 * dimostrare qualcosa a un cliente B2B.
 *
 * Come e' fatto, e perche' cosi':
 *  - il livello e' neutro rispetto al fornitore: si attiva con la variabile d'ambiente
 *    VITE_ANALYTICS_PROVIDER. Finche' non e' configurata, tutte le chiamate non fanno NULLA:
 *    nessun dato esce dal browser, quindi non si introducono obblighi di consenso prima di aver
 *    scelto lo strumento;
 *  - non registriamo mai dati personali: niente email, niente identificatori utente, niente
 *    coordinate cliccate. Solo eventi di gioco e numeri aggregati;
 *  - gli strumenti senza cookie (Umami, Plausible) non richiedono il banner di consenso.
 *
 * Per attivarla, aggiungere al file .env.local (o alle variabili di build su Firebase):
 *    VITE_ANALYTICS_PROVIDER=umami
 *    VITE_ANALYTICS_SCRIPT_URL=https://...   (per Umami/Plausible: URL dello script)
 *    VITE_ANALYTICS_SITE_ID=...              (per Umami)
 *    VITE_ANALYTICS_DOMAIN=intzetta.top      (per Plausible)
 */

let provider = null;

function readConfig() {
  const env = import.meta.env || {};
  return {
    name: (env.VITE_ANALYTICS_PROVIDER || '').trim().toLowerCase(),
    scriptUrl: env.VITE_ANALYTICS_SCRIPT_URL || '',
    siteId: env.VITE_ANALYTICS_SITE_ID || '',
    domain: env.VITE_ANALYTICS_DOMAIN || '',
  };
}

/** Inserisce lo script del fornitore scelto. Chiamata una sola volta, all'avvio. */
export function initAnalytics() {
  const cfg = readConfig();
  if (!cfg.name || provider) return cfg.name || null;

  if (cfg.name === 'debug') {
    provider = 'debug';
    return provider;
  }

  if (cfg.name === 'umami' || cfg.name === 'plausible') {
    if (!cfg.scriptUrl || !cfg.siteId) return null;
    const s = document.createElement('script');
    s.defer = true;
    s.src = cfg.scriptUrl;
    s.dataset.websiteId = cfg.siteId;
    // ATTENZIONE: l'attributo che limita la misurazione a un dominio ha un nome diverso
    // nei due strumenti. Sbagliarlo significa misurare anche le prove in locale.
    if (cfg.domain) {
      if (cfg.name === 'umami') s.dataset.domains = cfg.domain; // data-domains
      else s.dataset.domain = cfg.domain; // data-domain
    }
    if (cfg.name === 'umami') {
      // Rispetta l'impostazione "non tracciare" del browser e raccogli i dati sui tempi di
      // caricamento: su un gioco che si apre dal telefono in mobilità sono numeri che servono.
      s.dataset.doNotTrack = 'true';
      s.dataset.performance = 'true';
    }
    document.head.appendChild(s);
    provider = cfg.name;
    return provider;
  }

  if (cfg.name === 'ga4') {
    // Google Analytics 4 richiede un banner di consenso: da attivare solo con la CMP pronta.
    if (!cfg.siteId) return null;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.siteId)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', cfg.siteId);
    provider = 'ga4';
    return provider;
  }

  return null;
}

/**
 * Registra un evento. Non fa nulla se nessun fornitore e' configurato.
 * Non deve MAI interrompere il gioco: ogni errore viene ignorato.
 */
export function track(event, props = {}) {
  try {
    if (!provider) return;
    const payload = { ...props };

    if (provider === 'debug') {
      // Utile in sviluppo per verificare che gli eventi partano davvero.
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event, payload);
      return;
    }
    if (provider === 'umami' && typeof window.umami?.track === 'function') {
      window.umami.track(event, payload);
      return;
    }
    if (provider === 'plausible' && typeof window.plausible === 'function') {
      window.plausible(event, { props: payload });
      return;
    }
    if (provider === 'ga4' && typeof window.gtag === 'function') {
      window.gtag('event', event, payload);
    }
  } catch (err) {
    /* la misurazione non deve mai rompere il gioco */
  }
}

/** Nomi degli eventi, in un posto solo, per non avere stringhe sparse nel codice. */
export const EVENTS = {
  GAME_STARTED: 'partita_iniziata',
  ROUND_SCORED: 'round_punteggiato',
  GAME_FINISHED: 'partita_finita',
  SHARE_CLICKED: 'condivisione_cliccata',
  DAILY_BLOCKED: 'sfida_gia_giocata',
  DAILY_RESUMED: 'sfida_ripresa',
  PRACTICE_STARTED: 'allenamento_iniziato',
};
