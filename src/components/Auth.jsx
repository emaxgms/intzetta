import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import ProfileModal from './ProfileModal';

/**
 * Accesso e profilo.
 *
 * Due situazioni ben distinte:
 *  - senza accesso: un solo pulsante "ACCEDI" che apre le due possibilita' (Google o email);
 *  - con accesso: la propria immagine e il proprio nome. Toccandoli si apre il pannello del
 *    profilo, dove si cambia avatar e nome e si esce.
 *
 * Gli errori di accesso vengono mostrati all'utente, non solo scritti nella console: prima un
 * dominio non autorizzato falliva in silenzio ed era impossibile capire perche'.
 */
export default function Auth() {
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    logout,
    authError,
    clearAuthError,
    updateUserProfile,
  } = useAuth();

  const [menuAperto, setMenuAperto] = useState(false);
  const [loginAperto, setLoginAperto] = useState(false);
  const [profiloAperto, setprofiloAperto] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erroreEmail, setErroreEmail] = useState('');
  const contenitore = useRef(null);

  // Chiudendo il menu con un tocco fuori.
  useEffect(() => {
    const fuori = (event) => {
      if (contenitore.current && !contenitore.current.contains(event.target)) setMenuAperto(false);
    };
    document.addEventListener('mousedown', fuori);
    document.addEventListener('touchstart', fuori);
    return () => {
      document.removeEventListener('mousedown', fuori);
      document.removeEventListener('touchstart', fuori);
    };
  }, []);

  // Al primo accesso il nome non c'e': si apre il profilo per farlo scegliere subito.
  useEffect(() => {
    setMenuAperto(false);
    if (user && !user.displayName) setprofiloAperto(true);
  }, [user]);

  const handleLoginEmail = async (e) => {
    e.preventDefault();
    setErroreEmail('');
    const risultato = await signInWithEmail(email, password);
    if (risultato.success) {
      setLoginAperto(false);
      setEmail('');
      setPassword('');
    } else {
      setErroreEmail(risultato.message || 'Accesso non riuscito.');
    }
  };

  const apriLogin = () => {
    clearAuthError?.();
    setErroreEmail('');
    setLoginAperto(true);
    setMenuAperto(false);
  };

  return (
    <>
      <div className="auth-container" ref={contenitore}>
        {user ? (
          <button
            type="button"
            className="profilo-pulsante"
            onClick={() => setprofiloAperto(true)}
            title="Apri il tuo profilo: avatar, nome e uscita"
          >
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="user-avatar" />
            ) : (
              <span className="default-avatar" aria-hidden="true" />
            )}
            <span className="user-name">{user.displayName || 'Il tuo profilo'}</span>
          </button>
        ) : (
          <div className="login-btns">
            {!menuAperto ? (
              <button
                type="button"
                onClick={() => setMenuAperto(true)}
                className="sign-in-btn"
                title="Accedi o registrati"
              >
                ACCEDI
              </button>
            ) : (
              <div className="login-options">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="google-sign-in-btn"
                  title="Accedi con Google"
                >
                  Continua con Google
                </button>
                <button type="button" onClick={apriLogin} className="google-sign-in-btn" title="Accedi con email">
                  Continua con email
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Errore di accesso: visibile, non solo in console. */}
      {authError && !loginAperto && (
        <div className="auth-errore" role="alert">
          <p>{authError}</p>
          <button type="button" onClick={() => clearAuthError?.()} title="Chiudi il messaggio">
            Chiudi
          </button>
        </div>
      )}

      <Modal isOpen={loginAperto} onClose={() => setLoginAperto(false)}>
        <h2>Accedi con email</h2>
        <form onSubmit={handleLoginEmail} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            title="La tua email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            title="La tua password (almeno 6 caratteri)"
          />
          <button type="submit" className="profile-button" title="Accedi o registrati">
            Accedi
          </button>
          {(erroreEmail || authError) && (
            <p className="error-message">{erroreEmail || authError}</p>
          )}
          <p className="profilo-nota">
            Se non hai un account, viene creato adesso con questi dati.
          </p>
        </form>
      </Modal>

      <ProfileModal
        isOpen={profiloAperto}
        onClose={() => setprofiloAperto(false)}
        user={user}
        updateUserProfile={updateUserProfile}
        onLogout={logout}
      />
    </>
  );
}
