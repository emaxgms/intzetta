/**
 * Quale classifica riceve un punteggio.
 *
 * Sta in un file a parte, senza dipendenze da Firebase, per una ragione precisa: questa e' la
 * regola che decide dove finiscono i punteggi, e deve poter essere verificata dai test. Se
 * sbaglia, i punteggi finiscono nella classifica sbagliata e nessuno se ne accorge guardando
 * il gioco — si vede solo confrontando i numeri.
 *
 * I tabelloni sono sottocollezioni: leaderboards/{tabellone}/entries/{uid}
 *   generale                     tutti i comuni, partite classificate a caso
 *   giornaliera-AAAA-MM-GG       solo la sfida di quel giorno
 *   provincia-xx                 solo i comuni di quella provincia
 */

export const BOARD_GENERALE = 'generale';

/** Tabellone della sfida di un certo giorno. Cambia ogni giorno: si azzera da solo. */
export function dailyBoardId(dateKey) {
  return `giornaliera-${dateKey}`;
}

/** Tabellone di una provincia (sigla: CA, NU, OR, SS, SU). */
export function provinceBoardId(sigla) {
  return `provincia-${String(sigla).toLowerCase()}`;
}

/**
 * A quale classifica appartiene una partita. `null` per l'allenamento: non entra in classifica
 * e non consuma vite.
 *
 * La sfida del giorno va SEMPRE nella classifica del giorno, anche se sulla home e' selezionata
 * una provincia: e' una partita su tutta la Sardegna con gli stessi comuni per tutti, e deve
 * restare confrontabile solo con se stessa.
 */
export function boardForRun({ mode, provinceSigla, dateKey }) {
  if (mode === 'practice') return null;
  if (mode === 'daily') return dailyBoardId(dateKey);
  if (provinceSigla) return provinceBoardId(provinceSigla);
  return BOARD_GENERALE;
}
