import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import './daily.css';
import L from 'leaflet';
import Auth from './components/Auth';
import { upsertBestScore } from './utils/db';
import { useAuth } from './context/AuthContext';
import Leaderboard from './components/Leaderboard';
import BestScore from './components/BestScore';
import {
  ROUNDS_PER_GAME,
  MAX_GAME_SCORE,
  todayKey,
  pickDailyCities,
  pickRandomCities,
  pickRandomFrom,
  calcScore,
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
import { initAnalytics, track, EVENTS } from './utils/analytics';
import { getTileSource, warnIfUnlicensedSource } from './utils/maptiles';
import { provinceFromSearch, citiesByProvince } from './utils/provinces';

// Icone dei segnaposto di Leaflet
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

// Sorgente delle immagini della mappa: configurabile, con avviso se non e' una sorgente autorizzata.
const TILE_SOURCE = getTileSource();

function MapClickHandler({ onClick }) {
  useMapEvents({ click: onClick });
  return null;
}

/**
 * Rete di sicurezza: se qualcosa va storto mentre si disegna la pagina (per esempio un dato
 * rovinato in memoria locale), l'utente vede un messaggio e un pulsante invece di una pagina bianca.
 * Su un gioco che verra' condiviso con sconosciuti, una pagina bianca e' un giocatore perso.
 */
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
          <p className="countdown">
            Si e' verificato un errore imprevisto. Ricaricare la pagina di solito risolve.
          </p>
          <button className="button" onClick={() => window.location.reload()} title="Ricarica la pagina">
            Ricarica
          </button>
        </div>
      </div>
    );
  }
}

/** Riporta la mappa all'inquadratura iniziale quando si passa al round successivo. */
function ResetMapView({ trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) map.setView(HOME_VIEW.center, HOME_VIEW.zoom);
  }, [trigger, map]);
  return null;
}

/** Dopo la conferma, inquadra il comune da indovinare. */
function CenterCity({ coordinates }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates) map.setView(coordinates);
  }, [coordinates, map]);
  return null;
}

/** Ricalcola il giorno corrente: se si gioca oltre la mezzanotte, la sfida deve cambiare. */
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

function ShareBox({ result }) {
  const text = useMemo(() => buildShareText(result), [result]);
  const [status, setStatus] = useState(null);

  const handleShare = async () => {
    track(EVENTS.SHARE_CLICKED, { modalita: result.mode, punteggio: result.score });
    const outcome = await shareResult(text);
    setStatus(outcome);
  };

  return (
    <div className="share-box">
      <button className="button share" onClick={handleShare} title="Condividi il risultato su WhatsApp o altrove">
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
          <span className="round-distance">{formatDistance(r.distanceM)}</span>
          <span className="round-points">{r.points.toLocaleString('it-IT')}</span>
        </li>
      ))}
    </ul>
  );
}

function StartPage({
  onStartDaily,
  onStartPractice,
  onStartProvince,
  province,
  dailyResult,
  inProgress,
  streak,
  countdownMs,
  dateKey,
}) {
  return (
    <div className="start-page">
      <header>
        <div className="logo">
          <img src="/logo-t.png" alt="Logo" />
        </div>
        <Auth />
      </header>

      <section className="intro">
        <h1>{province ? province.nome.toUpperCase() : 'SCOPRI LA SARDEGNA!'}</h1>
        <h2>
          Da Bitti a Teulada, trova ogni paese sulla mappa.
          <br />
          Gioca ora e scopri quante ne Intzetti!
        </h2>

        {streak > 0 && (
          <p className="streak" title="Giorni consecutivi in cui hai giocato la sfida">
            🔥 {streak} {streak === 1 ? 'giorno di fila' : 'giorni di fila'}
          </p>
        )}

        {province && (
          <div className="daily-panel province-panel">
            <h3>
              {province.comuni} comuni in questa provincia
            </h3>
            <button
              className="play"
              onClick={() => onStartProvince(province.sigla)}
              title={`Gioca con i ${province.comuni} comuni della ${province.nome}`}
            >
              GIOCA SU QUESTI COMUNI
            </button>
            <p className="countdown">
              La sfida del giorno invece comprende tutta la Sardegna.{' '}
              <a href="/">Gioca con tutti i 377 comuni</a>
            </p>
          </div>
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
            <button
              className="button secondary"
              onClick={onStartPractice}
              title="Gioca quanto vuoi, con comuni estratti a caso"
            >
              Allenati
            </button>
          </div>
        ) : (
          <div className="daily-panel">
            <button className="play" onClick={onStartDaily} title="La sfida di oggi: gli stessi comuni per tutti">
              {inProgress ? 'RIPRENDI LA SFIDA' : 'SFIDA DEL GIORNO'}
            </button>
            <p className="countdown">
              Sfida #{dailyNumber(dateKey)} · cambia fra {formatCountdown(countdownMs)}
            </p>
            <p className="countdown">
              Non ricordi dove sono? <a href="/comuni-sardegna.html">Guarda l'elenco dei 377 comuni</a>
            </p>
            <button
              className="button secondary"
              onClick={onStartPractice}
              title="Gioca quanto vuoi, con comuni estratti a caso"
            >
              Allenamento libero
            </button>
          </div>
        )}
      </section>

      <section className="stats">
        <Leaderboard maxPlayers={5} />
        <BestScore />
      </section>

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

function EndPage({ result, streak, onRestart, onPractice, refreshData }) {
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
        {score > 30000 && score < 40000 && <h1>Bravu Meda!</h1>}
        {score === 40000 && <h1>Ses un Intzettadori!</h1>}
      </div>

      <h2>
        {mode === 'daily' ? `Sfida #${dailyNumber(result.dateKey)} — ` : ''}
        Intzettati: {score.toLocaleString('it-IT')}/{MAX_GAME_SCORE.toLocaleString('it-IT')}
      </h2>

      {streak > 0 && mode === 'daily' && (
        <p className="streak">🔥 {streak} {streak === 1 ? 'giorno' : 'giorni'} di fila</p>
      )}

      <RoundList rounds={rounds} />
      <ShareBox result={result} />

      <div className="end-actions">
        <button className="button" onClick={onRestart} title="Torna alla pagina iniziale">
          Torra a Giogai
        </button>
        <button className="button secondary" onClick={onPractice} title="Nuova partita con comuni estratti a caso">
          Allenamento
        </button>
      </div>

      <section className="stats">
        <Leaderboard maxPlayers={10} refreshData={refreshData} />
        <BestScore score={score} />
      </section>
    </div>
  );
}

function Game({ mode, dateKey, cities, initialRounds = [], onProgress, onGameEnd }) {
  const [roundIndex, setRoundIndex] = useState(initialRounds.length);
  const [rounds, setRounds] = useState(initialRounds);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [distance, setDistance] = useState(null);
  const [lastPoints, setLastPoints] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const startedAtRef = useRef(Date.now());

  const totalRounds = cities.length;
  const currentCity = cities[roundIndex] || null;
  const score = rounds.reduce((sum, r) => sum + r.points, 0);

  const handleMapClick = (e) => {
    if (!showResult) setSelectedPosition(e.latlng);
  };

  const handleConfirm = () => {
    if (!selectedPosition || !currentCity || showResult) return;

    const from = turf.point([selectedPosition.lng, selectedPosition.lat]);
    const to = turf.point([currentCity.coordinates[1], currentCity.coordinates[0]]);
    const distanceInKm = turf.distance(from, to);
    const distanceM = distanceInKm * 1000;
    const points = calcScore(distanceM);

    const nextRounds = [...rounds, { name: currentCity.name, distanceM, points }];
    setDistance(distanceInKm);
    setLastPoints(points);
    setRounds(nextRounds);
    setShowResult(true);

    track(EVENTS.ROUND_SCORED, { modalita: mode, round: nextRounds.length, punti: points });
    if (mode === 'daily') onProgress?.({ rounds: nextRounds });
  };

  const finish = (finalRounds) => {
    onGameEnd({
      mode,
      dateKey,
      score: finalRounds.reduce((sum, r) => sum + r.points, 0),
      rounds: finalRounds,
      durationMs: Date.now() - startedAtRef.current,
    });
  };

  const handleNext = () => {
    const nextIndex = roundIndex + 1;
    if (nextIndex < totalRounds) {
      setRoundIndex(nextIndex);
      setSelectedPosition(null);
      setShowResult(false);
      setDistance(null);
      setLastPoints(0);
      setResetTrigger((n) => n + 1);
    } else {
      finish(rounds);
    }
  };

  // La barra spaziatrice conferma la scelta o passa al round successivo.
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (!showResult && selectedPosition) handleConfirm();
      else if (showResult) handleNext();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  return (
    <section className="game-page">
      <div className="game-overlay">
        <div className="city-prompt">{currentCity ? currentCity.name : 'Caricando...'}</div>

        <div className="score-display">
          {score.toLocaleString('it-IT')}/{(rounds.length * 5000).toLocaleString('it-IT')}
          {distance !== null && (
            <div className="distance">
              {formatDistance(distance * 1000)} · {lastPoints.toLocaleString('it-IT')} punti
            </div>
          )}
        </div>

        <div className="round-display">
          {roundIndex + 1}/{totalRounds}
        </div>

        <div className="game-controls">
          {!showResult && selectedPosition && (
            <button className="button" onClick={handleConfirm} title="Conferma la tua scelta">
              Conferma
            </button>
          )}
          {showResult && (
            <button className="button" onClick={handleNext} title="Vai avanti">
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

function App() {
  const [gameState, setGameState] = useState('start');
  const [mode, setMode] = useState('daily');
  const [cities, setCities] = useState([]);
  const [resumeRounds, setResumeRounds] = useState([]);
  const [gameDateKey, setGameDateKey] = useState(() => todayKey());
  const [result, setResult] = useState(null);
  const [dailyResult, setDailyResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const { user } = useAuth();
  const [refreshData, setRefreshData] = useState(false);

  const dateKey = useDateKey();
  const countdownMs = useCountdown();

  // Provincia richiesta nell'indirizzo (?provincia=SS): arriva dalle pagine di contenuto.
  // Si legge una volta sola, all'avvio: e' un parametro di ingresso, non uno stato che cambia.
  const [province, setProvince] = useState(() => {
    const p = provinceFromSearch(window.location.search);
    if (!p) return null;
    const comuni = citiesByProvince(p.sigla);
    return comuni.length > 0 ? { ...p, comuni: comuni.length, pool: comuni } : null;
  });

  useEffect(() => {
    initAnalytics();
    warnIfUnlicensedSource(TILE_SOURCE);
  }, []);

  // Quando cambia il giorno cambia la sfida: risultato, serie e partita in corso vanno riletti.
  useEffect(() => {
    setDailyResult(getDailyResult(dateKey));
    setStreak(effectiveStreak(dateKey));
    const progress = getDailyProgress(dateKey);
    const done = progress && progress.rounds ? progress.rounds.length : 0;
    setInProgress(done > 0 && done < ROUNDS_PER_GAME);
  }, [dateKey]);

  const beginGame = (nextMode, nextCities, initialRounds) => {
    setMode(nextMode);
    setCities(nextCities);
    setResumeRounds(initialRounds);
    setGameDateKey(dateKey);
    setGameState('playing');
  };

  const startDaily = () => {
    if (getDailyResult(dateKey)) {
      // Qui non dovrebbe arrivarsi (il pulsante cambia), ma la sfida non si rigioca:
      // e' proprio il fatto di poterla fare una volta sola a renderla un appuntamento.
      track(EVENTS.DAILY_BLOCKED, {});
      return;
    }
    const progress = getDailyProgress(dateKey);
    const done = progress && progress.rounds ? progress.rounds.length : 0;
    const initialRounds = done > 0 && done < ROUNDS_PER_GAME ? progress.rounds : [];

    track(initialRounds.length ? EVENTS.DAILY_RESUMED : EVENTS.GAME_STARTED, {
      modalita: 'daily',
      round_gia_fatti: initialRounds.length,
    });
    beginGame('daily', pickDailyCities(dateKey), initialRounds);
  };

  const startPractice = () => {
    track(EVENTS.PRACTICE_STARTED, { provincia: province?.sigla || 'tutte' });
    beginGame('practice', pickRandomCities(), []);
  };

  /** Partita di allenamento limitata ai comuni di una provincia. */
  const startProvince = (sigla) => {
    const comuni = citiesByProvince(sigla);
    if (comuni.length === 0) return;
    track(EVENTS.PRACTICE_STARTED, { provincia: sigla, comuni: comuni.length });
    beginGame('practice', pickRandomFrom(comuni), []);
  };

  const handleProgress = (progress) => {
    if (mode === 'daily') saveDailyProgress(gameDateKey, progress);
  };

  const endGame = async (finished) => {
    setResult(finished);
    setGameState('end');
    track(EVENTS.GAME_FINISHED, {
      modalita: finished.mode,
      punteggio: finished.score,
      durata_s: Math.round(finished.durationMs / 1000),
    });

    if (finished.mode === 'daily') {
      // Risultato del giorno salvato, partita in corso archiviata, serie aggiornata.
      saveDailyResult(finished.dateKey, finished);
      clearDailyProgress(finished.dateKey);
      setDailyResult(finished);
      setStreak(registerDailyPlayed(finished.dateKey).current);
      setInProgress(false);
    }

    if (user) {
      try {
        await upsertBestScore(user.uid, finished.score);
        setRefreshData((prev) => !prev);
      } catch (error) {
        console.error('Errore durante il salvataggio del punteggio:', error);
      }
    }
  };

  const goHome = () => setGameState('start');

  return (
    <ErrorBoundary>
      {gameState === 'start' && (
        <StartPage
          onStartDaily={startDaily}
          onStartPractice={startPractice}
          onStartProvince={startProvince}
          province={province}
          dailyResult={dailyResult}
          inProgress={inProgress}
          streak={streak}
          countdownMs={countdownMs}
          dateKey={dateKey}
        />
      )}
      {gameState === 'playing' && (
        <Game
          key={`${mode}-${gameDateKey}-${resumeRounds.length}`}
          mode={mode}
          dateKey={gameDateKey}
          cities={cities}
          initialRounds={resumeRounds}
          onProgress={handleProgress}
          onGameEnd={endGame}
        />
      )}
      {gameState === 'end' && result && (
        <EndPage
          result={result}
          streak={streak}
          onRestart={goHome}
          onPractice={startPractice}
          refreshData={refreshData}
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
