import { useState, useEffect } from 'react';
import { getLeaderboard, BOARD_GENERALE } from '../utils/db';
import { auth } from '../firebase';

/** Iniziali del giocatore, al posto della foto profilo. Evita di ripubblicare immagini di terzi. */
function initials(name) {
  const parts = String(name || '?')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Colore stabile a partire dal nome: lo stesso giocatore ha sempre lo stesso colore. */
function colorFor(name) {
  let h = 0;
  const s = String(name || '');
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 360;
  return `hsl(${h} 42% 42%)`;
}

/**
 * Classifica di un tabellone.
 *
 * `boardId` decide QUALE classifica: generale, giornaliera-AAAA-MM-GG, provincia-xx.
 * Sono tenute separate di proposito: un punteggio fatto su una sola provincia non e'
 * confrontabile con uno fatto su tutta la Sardegna.
 */
export default function Leaderboard({ boardId = BOARD_GENERALE, maxPlayers = 10, refreshData, titolo = 'Classifica' }) {
  const [righe, setRighe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let annullato = false;
    setLoading(true);
    setError(null);

    getLeaderboard(boardId, maxPlayers)
      .then((top) => {
        if (annullato) return;
        setRighe(top);
        setLoading(false);
      })
      .catch((err) => {
        if (annullato) return;
        setError('Errore nel caricamento della classifica');
        setLoading(false);
        console.error(err);
      });

    return () => {
      annullato = true;
    };
  }, [boardId, maxPlayers, refreshData]);

  const mioId = auth.currentUser?.uid;

  return (
    <div className="leaderboard">
      <h2>{titolo}</h2>

      {loading && <div className="loading-spinner">Caricamento...</div>}
      {!loading && error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="leaderboard-list">
          {righe.length === 0 ? (
            <p className="no-scores">Nessun punteggio ancora. Puoi essere il primo.</p>
          ) : (
            righe.map((player, index) => (
              <div
                key={player.id}
                className={`leaderboard-item ${player.id === mioId ? 'current-user' : ''}`}
              >
                <span className="rank">{index + 1}°</span>
                <div className="player-info">
                  <span
                    className="player-initials"
                    style={{ backgroundColor: colorFor(player.username) }}
                    aria-hidden="true"
                  >
                    {initials(player.username)}
                  </span>
                  <span className="player-name">{player.username}</span>
                </div>
                <span className="score">{(player.bestScore || 0).toLocaleString('it-IT')}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
