import { useState, useEffect } from 'react';
import Modal from './Modal';
import { createOrUpdateUserProfile } from '../utils/db';
import avatars from '../data/avatars.json';

/**
 * Pannello del profilo.
 *
 * Prima si poteva cambiare avatar solo al primo accesso, e per il nome bisognava indovinare che
 * il proprio nome in alto fosse cliccabile. Ora si apre cliccando la propria immagine (o il nome)
 * in qualunque momento, ed e' tutto nello stesso posto: avatar, nome, uscita.
 *
 * Gli avatar arrivano da DiceBear (software libero). Il "seme" e' un numero: cambiandolo si
 * ottengono nove Avatar diversi, cosi' la scelta non e' limitata a nove in tutto.
 */

/** Costruisce l'indirizzo di un avatar a partire dal seme e dalla variante. */
function avatarUrl(seme, id) {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${seme}${id}`;
}

export default function ProfileModal({ isOpen, onClose, user, updateUserProfile, onLogout }) {
  const [seme, setSeme] = useState(() => Date.now());
  const [scelto, setScelto] = useState(null);
  const [nome, setNome] = useState('');
  const [salvato, setSalvato] = useState(null);
  const [errore, setErrore] = useState(null);

  // Ogni volta che si apre, si riparte da quello che l'utente ha adesso.
  useEffect(() => {
    if (!isOpen || !user) return;
    setNome(user.displayName || '');
    setScelto(null);
    setSalvato(null);
    setErrore(null);
  }, [isOpen, user]);

  if (!user) return null;

  const avatarAttuale = user.photoURL || avatarUrl(seme, avatars[0].id);

  const salvaAvatar = async () => {
    if (!scelto) return;
    setErrore(null);
    try {
      await updateUserProfile({ photoURL: scelto });
      await createOrUpdateUserProfile(user.uid, { photoURL: scelto });
      setSalvato('Avatar aggiornato');
      setScelto(null);
    } catch (err) {
      console.error(err);
      setErrore('Non è stato possibile salvare l\'avatar. Riprova.');
    }
  };

  const salvaNome = async () => {
    const pulito = nome.trim();
    if (pulito.length < 2) {
      setErrore('Il nome deve avere almeno 2 caratteri.');
      return;
    }
    setErrore(null);
    try {
      await updateUserProfile({ displayName: pulito });
      await createOrUpdateUserProfile(user.uid, { username: pulito });
      setSalvato('Nome aggiornato');
    } catch (err) {
      console.error(err);
      setErrore('Non è stato possibile salvare il nome. Riprova.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="profilo">
        <h2>Il tuo profilo</h2>

        <div className="profilo-anteprima">
          <img src={avatarAttuale} alt="Il tuo avatar" className="profilo-avatar-grande" />
          <p className="profilo-nome">{user.displayName || 'Senza nome'}</p>
        </div>

        {salvato && <p className="profilo-ok">{salvato}</p>}
        {errore && <p className="error-message">{errore}</p>}

        <h3>Scegli un avatar</h3>
        <div className="avatar-griglia">
          {avatars.map((a) => {
            const url = avatarUrl(seme, a.id);
            return (
              <button
                key={a.id}
                type="button"
                className={`avatar-scelta ${scelto === url ? 'selezionato' : ''} ${
                  user.photoURL === url ? 'attuale' : ''
                }`}
                onClick={() => setScelto(url)}
                title="Scegli questo avatar"
                aria-label="Scegli questo avatar"
              >
                <img src={url} alt="" loading="lazy" width="64" height="64" />
              </button>
            );
          })}
        </div>

        <div className="profilo-azioni">
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setSeme(Date.now());
              setScelto(null);
            }}
            title="Mostra altri nove avatar"
          >
            Altre 9
          </button>
          <button
            type="button"
            className="button"
            onClick={salvaAvatar}
            disabled={!scelto}
            title="Conferma l'avatar scelto"
          >
            Usa questo
          </button>
        </div>

        <h3>Il tuo nome in classifica</h3>
        <div className="profilo-nome-riga">
          <input
            type="text"
            value={nome}
            maxLength={24}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Come vuoi comparire"
            title="Il nome che vedono gli altri in classifica"
          />
          <button type="button" className="button" onClick={salvaNome} title="Salva il nome">
            Salva
          </button>
        </div>
        <p className="profilo-nota">
          In classifica gli altri vedono il tuo nome e le tue iniziali, non la tua immagine.
        </p>

        <div className="profilo-uscita">
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              onClose();
              onLogout?.();
            }}
            title="Esci dal tuo account"
          >
            Esci dall'account
          </button>
        </div>
      </div>
    </Modal>
  );
}
