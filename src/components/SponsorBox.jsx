import { useMemo, useEffect } from 'react';
import sponsorData from '../data/sponsor.json';
import { track } from '../utils/analytics';

/**
 * Riquadro degli sponsor locali.
 *
 * PERCHE' ESISTE QUESTA FORMA E NON UN NETWORK PUBBLICITARIO
 * ---------------------------------------------------------
 * Un banner venduto direttamente a un'attivita' sarda a 150-300 euro l'anno rende quanto
 * 8.000-16.000 partite al mese di pubblicita' programmatica. E non richiede l'approvazione di
 * nessuno, non ha soglie di pagamento, non introduce cookie e non dipende dalla scala.
 *
 * REGOLE CHE SI E' DATO
 * ---------------------
 *  - si mostra UNA volta sola per pagina, in fondo, mai sopra la mappa o i pulsanti;
 *  - e' scritto chiaramente che e' uno sponsor, non un contenuto del gioco;
 *  - si alterna fra gli sponsor attivi in base al giorno, cosi' nessuno domina;
 *  - se non c'e' nessuno sponsor attivo il riquadro non esiste e non occupa spazio;
 *  - i click vengono contati, per poter dire allo sponsor quante volte e' stato visto.
 */

function oggiKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Sponsor attivi in una certa data. */
export function sponsorAttivi(dataKey = oggiKey()) {
  const elenco = Array.isArray(sponsorData.sponsor) ? sponsorData.sponsor : [];
  return elenco.filter((s) => {
    if (!s.attivo) return false;
    if (s.dal && dataKey < s.dal) return false;
    if (s.al && dataKey > s.al) return false;
    return true;
  });
}

/** Uno sponsor al giorno, a rotazione: si alternano senza che nessuno resti sempre fuori. */
export function sponsorDelGiorno(dataKey = oggiKey()) {
  const attivi = sponsorAttivi(dataKey);
  if (attivi.length === 0) return null;
  // Numero di giorni dall'inizio dell'epoca: cambia ogni giorno e resta stabile nella giornata.
  const giorni = Math.floor(Date.parse(`${dataKey}T00:00:00Z`) / 86400000);
  return attivi[giorni % attivi.length];
}

export default function SponsorBox({ posizione = 'fondo', dataKey }) {
  const sponsor = useMemo(() => sponsorDelGiorno(dataKey), [dataKey]);

  useEffect(() => {
    if (sponsor) track('sponsor_visto', { sponsor: sponsor.id, localita: sponsor.localita || '' });
  }, [sponsor]);

  if (!sponsor) return null;

  const contenuto = (
    <>
      <span className="sponsor-etichetta">Sponsor locale</span>
      <strong className="sponsor-nome" style={{ color: sponsor.colore || undefined }}>
        {sponsor.nome}
      </strong>
      <span className="sponsor-testo">{sponsor.testo}</span>
      {sponsor.localita && <span className="sponsor-luogo">{sponsor.localita}</span>}
    </>
  );

  const onClick = () => track('sponsor_cliccato', { sponsor: sponsor.id });

  return (
    <div className={`sponsor-box sponsor-${posizione}`}>
      {sponsor.url ? (
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={onClick}
          title={`Visita ${sponsor.nome}`}
        >
          {contenuto}
        </a>
      ) : (
        <div>{contenuto}</div>
      )}
    </div>
  );
}
