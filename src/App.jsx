import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import './daily.css';
import './ui.css';
import L from 'leaflet';
import Auth from './components/Auth';
import Leaderboard from './components/Leaderboard';
import BestScore from './components/BestScore';
import { AdBanner, VideoBreak } from './components/AdSlot';
import { useAuth } from './context/AuthContext';
import {
  ROUNDS_PER_GAME,
  MAX_GAME_SCORE,
  ROUND_TIME_LIMIT_S,
  todayKey,
  pickDailyCities,
  pickRandomCities,
  pickRandomFrom,
  roundPoints,
  timeMultiplier,
  distanceEmoji,
  formatDistance,
  buildShareText,
  shareResult,
  getDailyResult,
  saveDailyResult,
  getDailyProgress,
  saveDailyProgress,
  clearDailyProgress,
  registerDailyPlayed,
  effectiveStreak,
  msUntilNextDaily,
  formatCountdown,
  dailyNumber,
} from './utils/daily';
import { livesState, consumeLife } from './utils/lives';
import {
  saveRankedScore,
  boardForRun,
  dailyBoardId,
  provinceBoardId,
  BOARD_GENERALE,
} from './utils/db';
import { provinceGroups, provinceFromSearch, citiesByProvince, PROVINCE } from './utils/provinces';
import { initAnalytics, track, EVENTS } from './utils/analytics';
import { getTileSource, warnIfUnlicensedSource } from './utils/maptiles';
import { adsActive, loadAdsScript } from './utils/ads';

// ---------------------------------------------------------------------------
// Mappa
// ---------------------------------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MARKER_ICON = L.icon({
  iconUrl: '/marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const SARDINIA_BOUNDS = [
  [38.8, 8.1],
  [41.3, 9.8],
];
const HOME_VIEW = { center: [40.1, 9.0], zoom: 8 };

const TILE_SOURCE = getTileSource();

function MapClickHandler({ onClick }) {
  useMapEvents({ click: onClick });
  return null;
}

function ResetMapView({ trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) map.setView(HOME_VIEW.center, HOME_VIEW.zoom);
  }, [trigger, map]);
  return null;
}

function CenterCity({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates) map.setView(coordinates);
  }, [coordinates, map]);
  return null;
}

// ---------------------------------------------------------------------------
// Agganci riutilizzabili
// ---------------------------------------------------------------------------

/** Ricalcola il giorno corrente: se si gioca oltre la mezzanotte, la sfida cambia. */
function useDateKey() {
  const [key, setKey] = useState(() => todayKey());
  useEffect(() => {
    const id = setInterval(() => setKey(todayKey()), 30000);
    return () => clearInterval(id);
  }, []);
  return key;
}

function useCountdown() {
  const [ms, setMs] = useState(() => msUntilNextDaily());
  useEffect(() => {
    const id = setInterval(() => setMs(msUntilNextDaily()), 30000);
    return () => clearInterval(id);
  }, []);
  return ms;
}

/**
 * Cronometro del round. Si aggiorna ogni decimo di secondo perche' il punteggio dipende
 * dal tempo impiegato, non solo dalla distanza.
 */
function useRoundTimer(attivo) {
  const [trascorsi, setTrascorsi] = useState(0);
  const inizio = useRef(null);

  useEffect(() => {
    if (!attivo) {
      inizio.current = null;
      setTrascorsi(0);
      return undefined;
    }
    inizio.current = Date.now();
    setTrascorsi(0);
    const id = setInterval(() => {
      setTrascorsi((Date.now() - inizio.current) / 1000);
    }, 100);
    return () => clearInterval(id);
  }, [attivo]);

  return { trascorsi, rimanenti: Math.max(0, ROUND_TIME_LIMIT_S - trascorsi) };
}

// ---------------------------------------------------------------------------
// Confine di sicurezza
// ---------------------------------------------------------------------------

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Errore imprevisto nell\'interfaccia:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="start-page">
        <div className="daily-panel">
          <h1>Ops, qualcosa non va</h1>
          <p className="countdown">Si è verificato un errore imprevisto. Ricaricare la pagina di solito risolve.</p>
          <button type="button" className="button" onClick={() => window.location.reload()} title="Ricarica la pagina">
            Ricarica
          </button>
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// Pezzi di interfaccia
// ---------------------------------------------------------------------------

function ShareBox({ result }) {
  const text = useMemo(() => buildShareText(result), [result]);
  const [status, setStatus] = useState(null);

  const handleShare = async () => {
    track(EVENTS.SHARE_CLICKED, { modalita: result.mode, punteggio: result.score });
    setStatus(await shareResult(text));
  };

  return (
    <div className="share-box">
      <button type="button" className="button share" onClick={handleShare} title="Condividi il risultato">
        Condividi il risultato
      </button>
      {status === 'copied' && <p className="share-hint">Testo copiato: incollalo nella chat.</p>}
      {status === 'manual' && <p className="share-hint">Copia il testo qui sotto e incollalo nella chat.</p>}
      {status === 'shared' && <p className="share-hint">Condiviso!</p>}
      <pre className="share-text">{text}</pre>
    </div>
  );
}

function RoundList({ rounds }) {
  return (
    <ul className="round-list">
      {rounds.map((r, i) => (
        <li key={`${r.name}-${i}`}>
          <span className="round-emoji" aria-hidden="true">{distanceEmoji(r.distanceM)}</span>
          <span className="round-name">{r.name}</span>
          <span className="round-distance">
            {r.skipped ? 'tempo scaduto' : formatDistance(r.distanceM)}
          </span>
          <span className="round-points">{(r.points || 0).toLocaleString('it-IT')}</span>
        </li>
      ))}
    </ul>
  );
}

/** Pastiglie per scegliere il territorio: tutta la Sardegna oppure una provincia. */
function SelettoreTerritorio({ scelto, onScegli, gruppi }) {
  return (
    <div className="territorio">
      <button
        type="button"
        className={`pillola ${scelto === null ? 'attiva' : ''}`}
        onClick={() => onScegli(null)}
        title="Gioca su tutti i comuni della Sardegna"
      >
        Tutta la Sardegna
      </button>
      {gruppi.map((g) => (
        <button
          key={g.sigla}
          type="button"
          className={`pillola ${scelto === g.sigla ? 'attiva' : ''}`}
          onClick={() => onScegli(g.sigla)}
          title={`Gioca sui ${g.cities.length} comuni della ${g.nome}`}
        >
          {g.breve}
          <span className="pillola-conteggio">{g.cities.length}</span>
        </button>
      ))}
    </div>
  );
}

/** Pastiglie per scegliere quale classifica guardare. */
function SelettoreClassifica({ scelte, attiva, onScegli }) {
  return (
    <div className="classifiche-scelta">
      {scelte.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`pillola ${attiva === s.id ? 'attiva' : ''}`}
          onClick={() => onScegli(s.id)}
        >
          {s.nome}
        </button>
      ))}
    </div>
  );
}

function IndicatoreVite({ stato }) {
  const mostrate = Math.min(stato.total, 5);
  return (
    <div className="vite" title={`${stato.freeLeft} gratuite oggi, ${stato.bought} comprate`}>
      <span className="vite-etichetta">Vite</span>
      <span className="vite-pallini">
        {Array.from({ length: mostrate }).map((_, i) => (
          <span key={i} className="vite-pallino" aria-hidden="true">
            {i < stato.freeLeft ? '❤️' : '💛'}
          </span>
        ))}
        {stato.total > mostrate && <span className="vite-extra">+{stato.total - mostrate}</span>}
      </span>
      <span className="vite-numero">{stato.total}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagina iniziale
// ---------------------------------------------------------------------------

function StartPage({
  onStartDaily,
  onStartRanked,
  onStartPractice,
  dailyResult,
  inProgress,
  streak,
  countdownMs,
  dateKey,
  province,
  onScegliProvincia,
  vite,
  provinceGroups: gruppi,
}) {
  const classiDisponibili = useMemo(() => {
    const base = [
      { id: BOARD_GENERALE, nome: 'Generale' },
      { id: dailyBoardId(dateKey), nome: 'Oggi' },
    ];
    if (province) base.push({ id: provinceBoardId(province.sigla), nome: province.breve });
    return base;
  }, [dateKey, province]);

  const [classifica, setClassifica] = useState(classiDisponibili[0].id);
  useEffect(() => {
    if (!classiDisponibili.some((c) => c.id === classifica)) setClassifica(classiDisponibili[0].id);
  }, [classiDisponibili, classifica]);

  const puoGiocare = vite.canPlay;

  return (
    <div className="start-page">
      <header>
        <div className="logo">
          <img src="/logo-t.png" alt="Logo" />
        </div>
        <Auth />
      </header>

      <section className="intro">
        <h1>{province ? province.breve.toUpperCase() : 'SCOPRI LA SARDEGNA!'}</h1>

        <IndicatoreVite stato={vite} />
        {streak > 0 && (
          <p className="streak" title="Giorni consecutivi in cui hai giocato la sfida">
            🔥 {streak} {streak === 1 ? 'giorno di fila' : 'giorni di fila'}
          </p>
        )}

        {dailyResult ? (
          <div className="daily-panel played">
            <h3>Sfida #{dailyNumber(dateKey)} — già giocata</h3>
            <p className="daily-score">
              {dailyResult.score.toLocaleString('it-IT')} / {MAX_GAME_SCORE.toLocaleString('it-IT')}
            </p>
            <div className="daily-grid" aria-hidden="true">
              {(dailyResult.rounds || []).map((r, i) => (
                <span key={i}>{distanceEmoji(r.distanceM)}</span>
              ))}
            </div>
            <ShareBox result={dailyResult} />
            <p className="countdown">Prossima sfida fra {formatCountdown(countdownMs)}</p>
          </div>
        ) : (
          <div className="daily-panel">
            <button
              type="button"
              className="play"
              onClick={onStartDaily}
              disabled={!puoGiocare}
              title="La sfida di oggi: gli stessi comuni per tutti, una volta sola"
            >
              {inProgress ? 'RIPRENDI LA SFIDA' : 'SFIDA DEL GIORNO'}
            </button>
            <p className="countdown">
              Sfida #{dailyNumber(dateKey)} · {ROUNDS_PER_GAME} comuni · {ROUND_TIME_LIMIT_S}s a round
            </p>
          </div>
        )}

        <div className="daily-panel territorio-pannello">
          <h3>Scegli il territorio e gioca per la classifica</h3>
          <SelettoreTerritorio scelto={province?.sigla ?? null} onScegli={onScegliProvincia} gruppi={gruppi} />
          <button
            type="button"
            className="button"
            onClick={onStartRanked}
            disabled={!puoGiocare}
            title="Partita valida per la classifica: consuma una vita"
          >
            {province ? `Gioca su ${province.comuni} comuni` : 'Gioca una partita classificata'}
          </button>
          <p className="countdown">
            {puoGiocare
              ? 'Consuma una vita. Il punteggio entra in classifica.'
              : 'Vite esaurite per oggi. Puoi allenarti, oppure comprarne altre (in arrivo).'}
          </p>
        </div>

        <div className="daily-panel">
          <button
            type="button"
            className="button secondary"
            onClick={onStartPractice}
            title="Gioca quanto vuoi: non consuma vite e non entra in classifica"
          >
            Allenamento libero
          </button>
          <p className="countdown">Illimitato, senza vite, fuori classifica.</p>
        </div>
      </section>

      <section className="stats">
        <SelettoreClassifica scelte={classiDisponibili} attiva={classifica} onScegli={setClassifica} />
        <Leaderboard
          boardId={classifica}
          maxPlayers={5}
          titolo={classiDisponibili.find((c) => c.id === classifica)?.nome || 'Classifica'}
        />
        <BestScore />
      </section>

      <AdBanner />

      <footer className="legal-links">
        <a href="/comuni-sardegna.html">I 377 comuni della Sardegna</a>
        <span className="gap"> | </span>
        <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <span className="gap"> | </span>
        <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer">Termini di Servizio</a>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagina finale
// ---------------------------------------------------------------------------

function EndPage({ result, streak, onRestart, onPractice, refreshData, classificata }) {
  const { score, rounds, mode } = result;
  return (
    <div className="end-page">
      <header>
        <div className="logo">
          <img src="/logo-t.png" alt="Logo" />
        </div>
        <Auth />
      </header>

      <div className="finalMessage">
        {score === 0 && <h1>No asi intzettau nudda!</h1>}
        {score > 0 && score <= 2500 && <h1>Caddu lanzu, musca meda!</h1>}
        {score > 2500 && score <= 5000 && <h1>Intzettare non è il tuo forte!</h1>}
        {score > 5000 && score <= 9000 && <h1>Bonu po fundi a Santu Ingiu!</h1>}
        {score > 9000 && score <= 20000 && <h1>Ndasi intzettau una pariga!</h1>}
        {score > 20000 && score <= 30000 && <h1>Bravu complimenti!</h1>}
        {score > 30000 && score < MAX_GAME_SCORE && <h1>Bravu Meda!</h1>}
        {score === MAX_GAME_SCORE && <h1>Ses un Intzettadori!</h1>}
      </div>

      <h2>
        {mode === 'daily' ? `Sfida #${dailyNumber(result.dateKey)} — ` : ''}
        Intzettati: {score.toLocaleString('it-IT')}/{MAX_GAME_SCORE.toLocaleString('it-IT')}
      </h2>

      {!classificata && (
        <p className="countdown">
          Partita di allenamento: non entra in classifica. Gioca una partita classificata per
          confrontarti con gli altri.
        </p>
      )}

      {streak > 0 && mode === 'daily' && (
        <p className="streak">🔥 {streak} {streak === 1 ? 'giorno' : 'giorni'} di fila</p>
      )}

      <RoundList rounds={rounds} />
      <ShareBox result={result} />

      <div className="end-actions">
        <button type="button" className="button" onClick={onRestart} title="Torna alla pagina iniziale">
          Torra a Giogai
        </button>
        <button type="button" className="button secondary" onClick={onPractice} title="Nuova partita di allenamento">
          Allenamento
        </button>
      </div>

      <section className="stats">
        <Leaderboard maxPlayers={10} refreshData={refreshData} />
        <BestScore score={score} />
      </section>

      <AdBanner />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Partita
// ---------------------------------------------------------------------------

function Game({ modalita, dateKey, cities, initialRounds = [], onProgress, onGameEnd, classificata }) {
  const [roundIndex, setRoundIndex] = useState(initialRounds.length);
  const [rounds, setRounds] = useState(initialRounds);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [ultimo, setUltimo] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const startedAtRef = useRef(Date.now());
  const chiuso = useRef(false);

  const totalRounds = cities.length;
  const currentCity = cities[roundIndex] || null;
  const score = rounds.reduce((sum, r) => sum + r.points, 0);
  const inCorso = !showResult && Boolean(currentCity);
  const { trascorsi, rimanenti } = useRoundTimer(inCorso);

  const handleMapClick = (e) => {
    if (!showResult) setSelectedPosition(e.latlng);
  };

  /** Chiude il round: distanza e tempo insieme. */
  const chiudiRound = useCallback(
    (posizione, secondi) => {
      if (chiuso.current || !currentCity) return;
      chiuso.current = true;

      let distanceM = null;
      let punti = 0;
      if (posizione) {
        const from = turf.point([posizione.lng, posizione.lat]);
        const to = turf.point([currentCity.coordinates[1], currentCity.coordinates[0]]);
        distanceM = turf.distance(from, to) * 1000;
        punti = roundPoints(distanceM, secondi);
      }

      const round = {
        name: currentCity.name,
        distanceM: distanceM === null ? Number.MAX_SAFE_INTEGER : distanceM,
        points: punti,
        seconds: Math.round(secondi * 10) / 10,
        skipped: distanceM === null,
      };

      const prossimi = [...rounds, round];
      setUltimo({ ...round, quota: timeMultiplier(secondi) });
      setRounds(prossimi);
      setShowResult(true);

      track(EVENTS.ROUND_SCORED, {
        modalita,
        round: prossimi.length,
        punti,
        secondi: round.seconds,
        saltato: round.skipped,
      });
      if (classificata) onProgress?.({ rounds: prossimi });
    },
    [currentCity, modalita, onProgress, rounds, classificata]
  );

  // Tempo scaduto: si chiude il round con quello che c'e' sullo schermo.
  useEffect(() => {
    if (!inCorso || rimanenti > 0) return;
    chiudiRound(selectedPosition, ROUND_TIME_LIMIT_S);
  }, [inCorso, rimanenti, selectedPosition, chiudiRound]);

  const finish = (finalRounds) => {
    onGameEnd({
      mode: modalita,
      dateKey,
      score: finalRounds.reduce((sum, r) => sum + r.points, 0),
      rounds: finalRounds,
      durationMs: Date.now() - startedAtRef.current,
    });
  };

  const handleNext = () => {
    const nextIndex = roundIndex + 1;
    chiuso.current = false;
    if (nextIndex < totalRounds) {
      setRoundIndex(nextIndex);
      setSelectedPosition(null);
      setShowResult(false);
      setUltimo(null);
      setResetTrigger((n) => n + 1);
    } else {
      finish(rounds);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (!showResult && selectedPosition) chiudiRound(selectedPosition, trascorsi);
      else if (showResult) handleNext();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  const urgente = rimanenti <= 5;

  return (
    <section className="game-page">
      <div className="game-overlay">
        <div className="city-prompt">{currentCity ? currentCity.name : 'Caricando...'}</div>

        <div className={`cronometro ${urgente ? 'urgente' : ''}`} title="Tempo rimasto per questo round">
          <span className="cronometro-numero">{Math.ceil(rimanenti)}</span>
          <span className="cronometro-barra" aria-hidden="true">
            <span style={{ width: `${Math.max(0, (rimanenti / ROUND_TIME_LIMIT_S) * 100)}%` }} />
          </span>
        </div>

        <div className="score-display">
          {score.toLocaleString('it-IT')}/{(rounds.length * 5000).toLocaleString('it-IT')}
          {ultimo && (
            <div className="distance">
              {ultimo.skipped ? 'tempo scaduto' : formatDistance(ultimo.distanceM)} ·{' '}
              {ultimo.points.toLocaleString('it-IT')} punti
              {!ultimo.skipped && ultimo.quota < 1 && (
                <span className="quota-tempo"> (tempo {Math.round(ultimo.quota * 100)}%)</span>
              )}
            </div>
          )}
        </div>

        <div className="round-display">
          {roundIndex + 1}/{totalRounds}
        </div>

        <div className="game-controls">
          {!showResult && selectedPosition && (
            <button
              type="button"
              className="button"
              onClick={() => chiudiRound(selectedPosition, trascorsi)}
              title="Conferma la tua scelta"
            >
              Conferma
            </button>
          )}
          {showResult && (
            <button type="button" className="button" onClick={handleNext} title="Vai avanti">
              {roundIndex + 1 < totalRounds ? 'Prossimo' : 'Fine'}
            </button>
          )}
        </div>
      </div>

      <MapContainer center={HOME_VIEW.center} zoom={HOME_VIEW.zoom} className="map-container" bounds={SARDINIA_BOUNDS}>
        <MapClickHandler onClick={handleMapClick} />
        <TileLayer url={TILE_SOURCE.url} attribution={TILE_SOURCE.attribution} />

        {selectedPosition && <Marker position={selectedPosition} icon={MARKER_ICON} />}
        <ResetMapView trigger={resetTrigger} />

        {showResult && currentCity && (
          <>
            <Marker position={currentCity.coordinates} icon={MARKER_ICON} />
            <Circle
              center={currentCity.coordinates}
              radius={1000}
              pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.15 }}
            />
            <CenterCity coordinates={currentCity.coordinates} />
          </>
        )}
      </MapContainer>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Applicazione
// ---------------------------------------------------------------------------

function App() {
  const [gameState, setGameState] = useState('start');
  const [modalita, setModalita] = useState('daily');
  const [classificata, setClassificata] = useState(false);
  const [cities, setCities] = useState([]);
  const [resumeRounds, setResumeRounds] = useState([]);
  const [gameDateKey, setGameDateKey] = useState(() => todayKey());
  const [risultato, setRisultato] = useState(null);
  const [dailyResult, setDailyResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [vite, setVite] = useState(() => livesState(todayKey()));
  const [videoAttivo, setVideoAttivo] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [avviso, setAvviso] = useState(null);
  const { user } = useAuth();

  const dateKey = useDateKey();
  const countdownMs = useCountdown();
  const gruppi = useMemo(() => provinceGroups(), []);

  // La provincia si puo' ricevere dall'indirizzo (?provincia=SS) oppure sceglierla dalla home.
  const [province, setProvince] = useState(() => {
    const p = provinceFromSearch(window.location.search);
    if (!p) return null;
    const comuni = citiesByProvince(p.sigla);
    return comuni.length > 0 ? { ...p, comuni: comuni.length } : null;
  });

  useEffect(() => {
    initAnalytics();
    warnIfUnlicensedSource(TILE_SOURCE);
    loadAdsScript();
  }, []);

  useEffect(() => {
    setDailyResult(getDailyResult(dateKey));
    setStreak(effectiveStreak(dateKey));
    setVite(livesState(dateKey));
    const progress = getDailyProgress(dateKey);
    const done = progress?.rounds ? progress.rounds.length : 0;
    setInProgress(done > 0 && done < ROUNDS_PER_GAME);
  }, [dateKey]);

  const scegliProvincia = (sigla) => {
    if (!sigla) {
      setProvince(null);
      window.history.replaceState({}, '', '/');
      return;
    }
    const comuni = citiesByProvince(sigla);
    if (comuni.length === 0) return;
    setProvince({ ...PROVINCE[sigla], comuni: comuni.length });
    window.history.replaceState({}, '', `/?provincia=${sigla}`);
    track(EVENTS.PRACTICE_STARTED, { azione: 'scelta_provincia', provincia: sigla });
  };

  const beginGame = (prossimaModalita, prossimeCitta, initialRounds, eClassificata) => {
    setModalita(prossimaModalita);
    setCities(prossimeCitta);
    setResumeRounds(initialRounds);
    setClassificata(eClassificata);
    setGameDateKey(dateKey);
    setGameState('playing');
  };

  /** Consuma una vita. Restituisce false se non ce ne sono. */
  const prendiVita = () => {
    const ok = consumeLife(dateKey);
    setVite(livesState(dateKey));
    if (!ok) {
      setAvviso(
        'Hai esaurito le vite di oggi. Puoi allenarti quanto vuoi, oppure comprarne altre (in arrivo).'
      );
      track(EVENTS.DAILY_BLOCKED, { motivo: 'vite_esaurite' });
    }
    return ok;
  };

  const startDaily = () => {
    if (getDailyResult(dateKey)) {
      track(EVENTS.DAILY_BLOCKED, { motivo: 'gia_giocata' });
      return;
    }
    const progress = getDailyProgress(dateKey);
    const done = progress?.rounds ? progress.rounds.length : 0;
    const initialRounds = done > 0 && done < ROUNDS_PER_GAME ? progress.rounds : [];

    // Riprendere la stessa partita non costa una seconda vita.
    if (initialRounds.length === 0 && !prendiVita()) return;

    track(initialRounds.length ? EVENTS.DAILY_RESUMED : EVENTS.GAME_STARTED, {
      modalita: 'daily',
      round_gia_fatti: initialRounds.length,
    });
    setAvviso(null);
    beginGame('daily', pickDailyCities(dateKey), initialRounds, true);
  };

  const startRanked = () => {
    if (!prendiVita()) return;
    const sigla = province?.sigla || null;
    const insieme = sigla ? citiesByProvince(sigla) : null;
    track(EVENTS.GAME_STARTED, { modalita: 'ranked', provincia: sigla || 'tutte' });
    setAvviso(null);
    beginGame('ranked', insieme ? pickRandomFrom(insieme) : pickRandomCities(), [], true);
  };

  const startPractice = () => {
    const sigla = province?.sigla || null;
    const insieme = sigla ? citiesByProvince(sigla) : null;
    track(EVENTS.PRACTICE_STARTED, { provincia: sigla || 'tutte' });
    setAvviso(null);
    beginGame('practice', insieme ? pickRandomFrom(insieme) : pickRandomCities(), [], false);
  };

  const handleProgress = (progress) => {
    if (classificata) saveDailyProgress(gameDateKey, progress);
  };

  const endGame = async (finito) => {
    setRisultato(finito);
    setGameState('end');
    track(EVENTS.GAME_FINISHED, {
      modalita: finito.mode,
      punteggio: finito.score,
      durata_s: Math.round(finito.durationMs / 1000),
    });

    if (finito.mode === 'daily') {
      saveDailyResult(finito.dateKey, finito);
      clearDailyProgress(finito.dateKey);
      setDailyResult(finito);
      setStreak(registerDailyPlayed(finito.dateKey).current);
      setInProgress(false);
    }

    // Il video sta fra la fine della partita e il risultato: e' l'unico momento in cui
    // l'utente sta comunque aspettando qualcosa.
    if (adsActive()) setVideoAttivo(true);

    // Entrano in classifica SOLO le partite giocate con le vite.
    if (classificata) {
      if (!user) {
        setAvviso(
          'Punteggio non salvato: per entrare in classifica serve un accesso. Accedi e riprova.'
        );
      } else {
        const boardId = boardForRun({
          mode: finito.mode,
          provinceSigla: province?.sigla || null,
          dateKey: finito.dateKey,
        });
        if (boardId) {
          try {
            await saveRankedScore({
              uid: user.uid,
              username: user.displayName || 'Giocatore',
              boardId,
              score: finito.score,
            });
            setRefreshData((v) => !v);
          } catch (error) {
            console.error('Errore nel salvataggio del punteggio:', error);
          }
        }
      }
    }
  };

  const goHome = () => {
    setVideoAttivo(false);
    setGameState('start');
    setVite(livesState(dateKey));
  };

  return (
    <ErrorBoundary>
      {gameState === 'start' && (
        <StartPage
          onStartDaily={startDaily}
          onStartRanked={startRanked}
          onStartPractice={startPractice}
          dailyResult={dailyResult}
          inProgress={inProgress}
          streak={streak}
          countdownMs={countdownMs}
          dateKey={dateKey}
          province={province}
          onScegliProvincia={scegliProvincia}
          vite={vite}
          provinceGroups={gruppi}
        />
      )}

      {gameState === 'playing' && (
        <Game
          key={`${modalita}-${gameDateKey}-${resumeRounds.length}-${province?.sigla || 'tutte'}`}
          modalita={modalita}
          dateKey={gameDateKey}
          cities={cities}
          initialRounds={resumeRounds}
          onProgress={handleProgress}
          onGameEnd={endGame}
          classificata={classificata}
        />
      )}

      {gameState === 'end' && risultato && !videoAttivo && (
        <EndPage
          result={risultato}
          streak={streak}
          onRestart={goHome}
          onPractice={startPractice}
          refreshData={refreshData}
          classificata={classificata}
        />
      )}

      {gameState === 'end' && videoAttivo && (
        <VideoBreak attivo={videoAttivo} onFinito={() => setVideoAttivo(false)} />
      )}

      {avviso && (
        <div className="avviso" role="alert">
          <p>{avviso}</p>
          <button type="button" onClick={() => setAvviso(null)} title="Chiudi">
            Chiudi
          </button>
        </div>
      )}
    </ErrorBoundary>
  );
}

export default App;
