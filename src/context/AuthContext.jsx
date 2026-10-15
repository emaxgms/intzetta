import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { createOrUpdateUserProfile, checkIfUserExists } from '../utils/db';

const AuthContext = createContext();

/** Messaggi comprensibili al posto dei codici di errore di Firebase. */
function friendlyError(error) {
  const code = error?.code || '';
  const map = {
    'auth/unauthorized-domain':
      'Questo indirizzo non è autorizzato per l\'accesso. Segnalalo: va aggiunto fra i domini autorizzati del progetto.',
    'auth/popup-blocked': 'Il browser ha bloccato la finestra di accesso. Riprova.',
    'auth/popup-closed-by-user': 'Accesso annullato.',
    'auth/cancelled-popup-request': 'Accesso annullato.',
    'auth/operation-not-allowed': 'L\'accesso con Google non è attivo su questo progetto.',
    'auth/network-request-failed': 'Connessione assente o instabile. Riprova.',
    'auth/too-many-requests': 'Troppi tentativi. Aspetta qualche minuto.',
    'auth/invalid-credential': 'Email o password non corretti.',
    'auth/wrong-password': 'Email o password non corretti.',
    'auth/user-not-found': 'Nessun account con questa email.',
    'auth/email-already-in-use': 'Esiste già un account con questa email.',
    'auth/weak-password': 'La password deve avere almeno 6 caratteri.',
    'auth/invalid-email': 'L\'indirizzo email non è valido.',
  };
  return map[code] || error?.message || 'Accesso non riuscito. Riprova.';
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  /** Crea il profilo al primo accesso, se non esiste. */
  const ensureProfile = useCallback(async (utente) => {
    if (!utente) return;
    try {
      const exists = await checkIfUserExists(utente.uid);
      if (!exists) {
        await createOrUpdateUserProfile(utente.uid, {
          username: utente.displayName || 'Giocatore',
          bestScore: 0,
          bestScoreDate: new Date(),
        });
      }
    } catch (error) {
      console.error('Errore nella creazione del profilo:', error);
    }
  }, []);

  useEffect(() => {
    // Chi arriva da un accesso con reindirizzamento (tipico su telefono) viene raccolto qui.
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) ensureProfile(result.user);
      })
      .catch((error) => {
        console.error('Errore al rientro dall\'accesso:', error);
        setAuthError(friendlyError(error));
        setLoading(false);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [ensureProfile]);

  /**
   * Accesso con Google.
   *
   * Prima si usava il flusso di Google Identity Services con un `login_uri` che puntava a un
   * dominio non piu' esistente: l'accesso falliva con errori di OAuth. Ora si usa il flusso
   * standard di Firebase, che funziona su qualunque dominio autorizzato del progetto.
   * Su telefono si va direttamente al reindirizzamento, perche' le finestre popup vengono
   * bloccate quasi sempre.
   */
  const signInWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      if (isMobile) {
        await signInWithRedirect(auth, googleProvider);
        return; // il risultato arriva al rientro, gestito da getRedirectResult
      }
      const result = await signInWithPopup(auth, googleProvider);
      await ensureProfile(result.user);
      setLoading(false);
    } catch (error) {
      // Se la finestra viene bloccata si ripiega sul reindirizzamento, invece di arrendersi.
      if (
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (secondo) {
          setAuthError(friendlyError(secondo));
          setLoading(false);
          return;
        }
      }
      console.error('Errore durante il login con Google:', error);
      setAuthError(friendlyError(error));
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      const credenziale = await signInWithEmailAndPassword(auth, email, password);
      await ensureProfile(credenziale.user);
      return { success: true, created: false };
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const credenziale = await createUserWithEmailAndPassword(auth, email, password);
          await createOrUpdateUserProfile(credenziale.user.uid, {
            username: email.split('@')[0],
            bestScore: 0,
            bestScoreDate: new Date(),
          });
          return { success: true, created: true };
        } catch (signupError) {
          return { success: false, message: friendlyError(signupError) };
        }
      }
      return { success: false, message: friendlyError(error) };
    }
  };

  const updateUserProfile = async (profileUpdates) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, profileUpdates);
      setUser((prev) => ({ ...prev, ...profileUpdates }));
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Errore durante l\'uscita:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithEmail,
        logout,
        loading,
        authError,
        clearAuthError: () => setAuthError(null),
        updateUserProfile,
      }}
    >
      {children}
      {loading && (
        <div className="overlay">
          <div className="spinner">Caricamento...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
