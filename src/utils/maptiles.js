/**
 * Sorgente delle immagini della mappa.
 *
 * SITUAZIONE (aggiornata)
 * -----------------------
 * Il gioco usava il servizio pubblico World Imagery di Esri (server.arcgisonline.com) senza chiave.
 * Funzionava, ma i termini d'uso di Esri NON permettono di usarlo in un prodotto commerciale:
 * vietano l'uso commerciale dei contenuti di ArcGIS Living Atlas senza accordo, la
 * ridistribuzione delle tessere, il self-hosting e la raccolta sistematica delle tessere.
 *
 * ORA E' RISOLTO: si usa ArcGIS Location Platform con il token dell'account. Nessun canone,
 * 2.000.000 di tessere al mese gratuite, poi 0,15 $ per 1.000. Sono le STESSE immagini di prima
 * (i file restituiti sono identici), ma passando dall'indirizzo autorizzato e con la fatturazione
 * corretta.
 *
 * COME E' STATA TROVATA LA URL GIUSTA (utile se un giorno va rifatto)
 * ------------------------------------------------------------------
 * Il servizio "Static Basemap Tiles" NON espone le immagini satellitari: espone solo lo strato
 * delle etichette (arcgis/imagery/labels). La base satellitare si ottiene dal servizio
 * "Basemap Styles", chiedendo lo stile arcgis/imagery in formato JSON:
 *   https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/imagery?f=json&token=...
 * Dentro quel JSON le sorgenti sono due, separate:
 *   - una RASTER  -> le immagini satellitari      (quella che serve a noi)
 *   - una VECTOR  -> strade, confini ed ETICHETTE (quella che NON va usata)
 * Si prende solo la prima. Cosi' la mappa resta senza i nomi dei paesi, che altrimenti
 * risolverebbero il gioco.
 *
 * ATTENZIONE, due vincoli del contratto Esri:
 *  - non mettere un proxy o una cache condivisa lato server: "a single request for Resultant
 *    Output may not be used to serve multiple users". La cache del browser di ogni giocatore
 *    invece e' normale e consentita.
 *  - non scaricare le tessere per ospitarle altrove.
 *
 * IL TOKEN viaggia nel JavaScript inviato al browser: e' inevitabile per una mappa lato client.
 * Va limitato al dominio intzetta.top dalla console ArcGIS, per referrer.
 *
 * L'alternativa a costo zero e senza account e' il layer Sentinel-2 cloudless del 2016 di EOX
 * (licenza CC BY 4.0, quindi uso commerciale permesso con attribuzione), ma e' a 10 metri per
 * pixel e fermo al 2016: a zoom 13 un paese e' una macchia di ~26 pixel. Va bene come ripiego.
 */

const ESRI_LEGACY_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const ESRI_LEGACY_ATTRIBUTION = '&copy; <a href="https://www.esri.com/">Esri</a>';

const EOX_2016_URL =
  'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/GoogleMaps_MapsCompatible/{z}/{y}/{x}.jpg';

const EOX_2016_ATTRIBUTION =
  'EOxCloudless by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)';

/** Sorgente attiva, letta dalla configurazione con ripiego sul servizio attuale. */
export function getTileSource() {
  const env = import.meta.env || {};
  const url = (env.VITE_MAP_TILES_URL || '').trim();

  if (url) {
    return {
      url,
      attribution: env.VITE_MAP_TILES_ATTRIBUTION || ESRI_LEGACY_ATTRIBUTION,
      // La configurazione e' stata fornita: nessun avviso in console.
      configured: true,
    };
  }

  return {
    url: ESRI_LEGACY_URL,
    attribution: ESRI_LEGACY_ATTRIBUTION,
    configured: false,
  };
}

/**
 * Avviso quando si sta usando la sorgente NON autorizzata per uso commerciale.
 *
 * L'avviso appare anche in produzione, di proposito: se un giorno si compila senza la variabile
 * d'ambiente (per esempio su un'altra macchina, o dopo un cambio di configurazione) il sito
 * funzionerebbe lo stesso ma senza licenza, e nessuno se ne accorgerebbe fino al primo controllo.
 */
export function warnIfUnlicensedSource(source) {
  if (source.configured) return;
  // eslint-disable-next-line no-console
  console.warn(
    '[mappe] ATTENZIONE: si sta usando il servizio Esri pubblico senza chiave. Non e\' utilizzabile ' +
      'per un sito commerciale (pubblicita\' o contratti con enti). Impostare VITE_MAP_TILES_URL e ' +
      'VITE_MAP_TILES_ATTRIBUTION. Istruzioni in src/utils/maptiles.js'
  );
}

export const TILE_PRESETS = { ESRI_LEGACY_URL, EOX_2016_URL, EOX_2016_ATTRIBUTION };
