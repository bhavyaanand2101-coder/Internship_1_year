import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .catch((err) => {
        console.error("Failed to set auth persistence:", err);
      })
      .finally(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
          setUser(u);
          setLoading(false);
        });
        return () => unsub();
      });
  }, []);

  const login = (e, p) =>
    setPersistence(auth, browserLocalPersistence).then(() =>
      signInWithEmailAndPassword(auth, e, p)
    );
  const signup = (e, p) =>
    setPersistence(auth, browserLocalPersistence).then(() =>
      createUserWithEmailAndPassword(auth, e, p)
    );
  const logout = () => signOut(auth);
  const googleLogin = () =>
    setPersistence(auth, browserLocalPersistence).then(() =>
      signInWithPopup(auth, googleProvider)
    );

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, googleLogin, loading }}>
      {!loading ? children : <div className="loader">Verifying Session...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);