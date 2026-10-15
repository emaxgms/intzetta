import { useEffect, useRef, useState } from 'react';
import {
  ADS_CLIENT,
  ADS_SLOT_BANNER,
  VIDEO_SECONDS,
  adsActive,
  adsDemo,
  adsVisible,
  loadAdsScript,
  requestVideoBreak,
} from '../utils/ads';

/**
 * Riquadro pubblicitario sempre presente, ma discreto.
 *
 * Scelte pensate per non rovinare il gioco:
 *  - sta in fondo alla pagina, mai sopra la mappa e mai sopra i pulsanti;
 *  - altezza dichiarata, cosi' non fa "saltare" il contenuto quando arriva;
 *  - non si carica finche' non e' visibile: non ruba banda a chi non arriva in fondo;
 *  - se la pubblicita' non e' configurata non occupa NESSUNO spazio.
 */
export function AdBanner() {
  const riferimento = useRef(null);
  const pushato = useRef(false);

  useEffect(() => {
    if (!adsActive() || !riferimento.current) return undefined;
    loadAdsScript();

    // Si carica solo quando entra nello schermo.
    const osservatore = new IntersectionObserver(
      (voci) => {
        if (!voci.some((v) => v.isIntersecting) || pushato.current) return;
        pushato.current = true;
        if (adsVisible()) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.error('Errore nel caricamento del banner:', err);
          }
        }
      },
      { rootMargin: '120px' }
    );
    osservatore.observe(riferimento.current);
    return () => osservatore.disconnect();
  }, []);

  if (!adsActive()) return null;

  return (
    <div className="ad-banner" ref={riferimento}>
      {adsDemo() ? (
        <div className="ad-finto">
          <span>spazio pubblicitario</span>
          <small>banner in fondo alla pagina</small>
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={ADS_SLOT_BANNER}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}

/**
 * Video breve dopo la partita.
 *
 * Perche' dopo e non durante: interrompere un round rovina la partita, mentre il momento in cui
 * il punteggio e' appena uscito e' l'unico in cui l'utente sta gia' aspettando qualcosa.
 * Dopo VIDEO_SECONDS secondi compare "Chiudi": il video non puo' bloccare nessuno.
 */
export function VideoBreak({ attivo, onFinito }) {
  const [secondi, setSecondi] = useState(VIDEO_SECONDS);
  const [pronto, setPronto] = useState(false);
  const avviato = useRef(false);

  useEffect(() => {
    if (!attivo || avviato.current) return undefined;
    avviato.current = true;

    let timer = null;
    const partire = () => {
      setSecondi(VIDEO_SECONDS);
      setPronto(false);
      timer = setInterval(() => {
        setSecondi((s) => {
          if (s <= 1) {
            clearInterval(timer);
            setPronto(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    };

    if (adsDemo()) {
      partire();
    } else {
      requestVideoBreak({ prima: partire, dopo: partire });
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [attivo]);

  if (!attivo || !adsActive()) return null;

  return (
    <div className="video-pubblicita" role="dialog" aria-label="Pubblicità">
      <div className="video-riquadro">
        {adsDemo() ? (
          <div className="video-finto">
            <p>video pubblicitario</p>
            <small>durata {VIDEO_SECONDS} secondi</small>
          </div>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%' }}
            data-ad-client={ADS_CLIENT}
            data-ad-slot=""
            data-ad-format="fluid"
          />
        )}
        <div className="video-conteggio">{secondi > 0 ? `${secondi}s` : 'fine'}</div>
      </div>
      <button
        type="button"
        className="button video-chiudi"
        onClick={onFinito}
        disabled={!pronto}
        title={pronto ? 'Chiudi e vedi il risultato' : 'Attendi la fine del video'}
      >
        {pronto ? 'Vedi il risultato' : `Attendi ${secondi}s`}
      </button>
    </div>
  );
}
