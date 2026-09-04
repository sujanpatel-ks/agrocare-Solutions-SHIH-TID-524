import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signInWithCustomToken, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { DEMO_UID } from './firebase';

const DEMO_MODE_KEY = 'agrocare_demo_mode';
const DEMO_USER = {
  uid: DEMO_UID,
  email: 'demo@agrocare.ai',
  displayName: 'Demo User',
  isAnonymous: true,
} as User;

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  isAuthenticating: boolean;
  isDemoUser: boolean;
  signIn: () => Promise<void>;
  demoLogin: () => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  isAuthenticating: false,
  isDemoUser: false,
  signIn: async () => {},
  demoLogin: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(() => localStorage.getItem(DEMO_MODE_KEY) === 'true');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(localStorage.getItem(DEMO_MODE_KEY) === 'true' ? DEMO_USER : user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    if (isAuthenticating) return;
    localStorage.removeItem(DEMO_MODE_KEY);
    setIsDemoUser(false);
    setIsAuthenticating(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in:', error);
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        // You could use a toast library here if you wanted, but logging is fine
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const demoLogin = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    try {
      const response = await fetch('/api/demo-session', { method: 'POST' });
      if (response.ok) {
        const data = await response.json() as { token?: string };
        if (data.token) await signInWithCustomToken(auth, data.token);
      } else if (import.meta.env.DEV) {
        // Local fallback only: this fixed identity can access demo-scoped data, never real users.
        setUser(DEMO_USER);
      } else {
        throw new Error('Demo session is unavailable.');
      }
      localStorage.setItem(DEMO_MODE_KEY, 'true');
      setIsDemoUser(true);
      setUser(DEMO_USER);
    } catch (error) {
      console.error('Error entering demo mode:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOutUser = async () => {
    try {
      localStorage.removeItem(DEMO_MODE_KEY);
      setIsDemoUser(false);
      if (auth.currentUser) await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticating, isDemoUser, signIn, demoLogin, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
