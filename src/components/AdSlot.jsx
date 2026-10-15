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
 * Video dopo la partita.
 *
 * Perche' dopo e non durante: interrompere un round rovina la partita, mentre il momento in cui
 * il punteggio sta per uscire e' l'unico in cui l'utente sta comunque aspettando qualcosa.
 *
 * DUE ACCORTEZZE NECESSARIE (la prima versione era sbagliata):
 *  - il pulsante si sblocca solo quando l'annuncio ha FINITO, non quando sono passati 5 secondi.
 *    Se l'annuncio dura 30 secondi, sbloccare a 5 significherebbe lasciar chiudere a forza un
 *    annuncio in corso: oltre a essere scorretto, viola le regole del network.
 *  - i 5 secondi sono un MINIMO, non una scadenza.
 * L'annuncio vero, quando c'e', si disegna da solo sopra la pagina: qui sotto resta solo il
 * conteggio e il pulsante. Non serve nessun <ins>.
 */
export function VideoBreak({ attivo, onFinito }) {
  const [secondi, setSecondi] = useState(VIDEO_SECONDS);
  const [conteggioFinito, setConteggioFinito] = useState(false);
  const [annuncioFinito, setAnnuncioFinito] = useState(false);
  const avviato = useRef(false);

  useEffect(() => {
    if (!attivo || avviato.current) return undefined;
    avviato.current = true;

    let tick = null;
    let rete = null;

    const avviaConteggio = () => {
      setSecondi(VIDEO_SECONDS);
      setConteggioFinito(false);
      tick = setInterval(() => {
        setSecondi((s) => {
          if (s <= 1) {
            clearInterval(tick);
            setConteggioFinito(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    };

    if (adsDemo()) {
      // Dimostrazione: non c'e' nessun annuncio, quindi il conteggio basta.
      setAnnuncioFinito(true);
      avviaConteggio();
    } else {
      // Rete di sicurezza: se per qualsiasi motivo il network non risponde, non si puo'
      // lasciare l'utente bloccato su questa schermata.
      rete = setTimeout(() => {
        setAnnuncioFinito(true);
        setConteggioFinito(true);
      }, 45000);
      requestVideoBreak({
        prima: avviaConteggio,
        dopo: () => setAnnuncioFinito(true),
      });
    }

    return () => {
      if (tick) clearInterval(tick);
      if (rete) clearTimeout(rete);
    };
  }, [attivo]);

  if (!attivo || !adsActive()) return null;

  const pronto = conteggioFinito && annuncioFinito;

  return (
    <div className="video-pubblicita" role="dialog" aria-label="Pubblicità">
      <div className="video-riquadro">
        <div className="video-finto">
          <p>pubblicità</p>
          <small>{conteggioFinito ? 'premi il pulsante per continuare' : 'ancora qualche secondo'}</small>
        </div>
        <div className="video-conteggio">{secondi > 0 ? `${secondi}s` : '—'}</div>
      </div>
      <button
        type="button"
        className="button video-chiudi"
        onClick={onFinito}
        disabled={!pronto}
        title={pronto ? 'Chiudi e vedi il risultato' : 'Attendi la fine della pubblicità'}
      >
        {pronto ? 'Vedi il risultato' : `Attendi ${secondi}s`}
      </button>
    </div>
  );
}
