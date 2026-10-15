/**
 * Configurazione della pubblicita'.
 *
 * Sta tutta qui, e sta SPENTA di default. Finche' non ci sono le credenziali di un network
 * pubblicitario, nel sito non compare nessun banner e nessun video: meglio niente che un
 * riquadro vuoto o un finto annuncio.
 *
 * Come si accende (dopo aver ottenuto l'approvazione di AdSense):
 *   VITE_ADS_ENABLED=true
 *   VITE_ADS_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 *   VITE_ADS_SLOT_BANNER=1234567890        (il numero dello spazio pubblicitario del banner)
 *
 * Per vedere come sara' fatto prima di avere l'account:
 *   VITE_ADS_MODE=demo
 * Che mostra i riquadri con la scritta "spazio pubblicitario" invece dell'annuncio.
 */

const env = import.meta.env || {};

export const ADS_ENABLED = String(env.VITE_ADS_ENABLED || '').toLowerCase() === 'true';
export const ADS_MODE = (env.VITE_ADS_MODE || '').toLowerCase(); // '' | 'demo'
export const ADS_CLIENT = env.VITE_ADS_CLIENT || '';
export const ADS_SLOT_BANNER = env.VITE_ADS_SLOT_BANNER || '';
export const ADS_SLOT_VIDEO = env.VITE_ADS_SLOT_VIDEO || '';

/** Secondi di video dopo la partita. */
export const VIDEO_SECONDS = 5;

/** Vero se c'e' qualcosa da mostrare: o la pubblicita' vera, o la dimostrazione. */
export function adsVisible() {
  return ADS_ENABLED && Boolean(ADS_CLIENT);
}

/**
 * Vero se va mostrata la dimostrazione (riquadri finti, per rivedere il progetto).
 *
 * In produzione NON deve mai essere vera: mostrare un riquadro finto sarebbe pubblicita'
 * annunciata e non mostrata. Se la modalita' dimostrazione e' accesa in un sito pubblicato,
 * si disattiva da sola e lo segnala in console.
 */
export function adsDemo() {
  if (adsVisible() || ADS_MODE !== 'demo') return false;
  const inProduzione =
    typeof window !== 'undefined' &&
    window.location &&
    !/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(window.location.hostname) &&
    !window.location.hostname.endsWith('.web.app') &&
    !window.location.hostname.endsWith('.firebaseapp.com');
  if (inProduzione) {
    console.error(
      '[pubblicita] VITE_ADS_MODE=demo su un sito pubblico: i riquadri finti non vengono mostrati. ' +
        'Togliere la modalita\' dimostrazione prima di pubblicare.'
    );
    return false;
  }
  return true;
}

/** Vero se c'e' qualcosa da disegnare, vero o finto. */
export function adsActive() {
  return adsVisible() || adsDemo();
}

// ---------------------------------------------------------------------------
// Quanto spesso mostrare il video
// ---------------------------------------------------------------------------
//
// Le regole di H5 Games Ads vietano i fullscreen "dopo ogni interazione dell'utente". Mostrare un
// video dopo OGNI partita, con l'allenamento illimitato, significherebbe violarle e rovinare il
// gioco. Si mostra quindi al massimo una volta ogni VIDEO_EVERY_N_GAMES partite.
//
// Sulle partite classificate il problema non si pone: sono al massimo 3 al giorno, quindi il
// limite non le tocca quasi mai.

const VIDEO_COUNTER_KEY = 'intzetta:ads:games';
export const VIDEO_EVERY_N_GAMES = 3;

function leggiContatore() {
  try {
    return parseInt(window.localStorage.getItem(VIDEO_COUNTER_KEY) || '0', 10) || 0;
  } catch (err) {
    return 0;
  }
}

function scriviContatore(valore) {
  try {
    window.localStorage.setItem(VIDEO_COUNTER_KEY, String(valore));
  } catch (err) {
    /* niente da fare */
  }
}

/**
 * Decide se questa partita merita il video, e aggiorna il conteggio.
 * Restituisce true ogni VIDEO_EVERY_N_GAMES partite.
 */
export function shouldShowVideo() {
  if (!adsActive()) return false;
  const n = leggiContatore() + 1;
  if (n >= VIDEO_EVERY_N_GAMES) {
    scriviContatore(0);
    return true;
  }
  scriviContatore(n);
  return false;
}

let scriptCaricato = false;

/** Carica lo script di AdSense una volta sola. Non fa nulla in modalita' dimostrazione. */
export function loadAdsScript() {
  if (!adsVisible() || scriptCaricato) return;
  scriptCaricato = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADS_CLIENT)}`;
  document.head.appendChild(s);
}

/**
 * Chiede un annuncio a schermo intero (video) e chiama `fatto` quando ha finito.
 *
 * Usa l'API "H5 Games Ads" di Google, pensata per i giochi HTML5. Se non e' configurata,
 * chiama subito `fatto`: il gioco non deve mai restare bloccato in attesa di un annuncio.
 */
export function requestVideoBreak({ prima, dopo } = {}) {
  if (!adsVisible() || typeof window === 'undefined') {
    dopo?.();
    return;
  }

  window.adsbygoogle = window.adsbygoogle || [];
  window.adBreak = window.adBreak || function adBreak(config) {
    window.adsbygoogle.push(config);
  };
  window.adConfig = window.adConfig || function adConfig(config) {
    window.adsbygoogle.push(config);
  };

  try {
    window.adConfig({ preloadAdBreaks: 'on', sound: 'on' });
    window.adBreak({
      type: 'next',
      name: 'dopo-partita',
      beforeAd: () => prima?.(),
      afterAd: () => dopo?.(),
      adBreakDone: () => dopo?.(),
    });
  } catch (err) {
    console.error('Errore nella richiesta del video pubblicitario:', err);
    dopo?.();
  }
}
