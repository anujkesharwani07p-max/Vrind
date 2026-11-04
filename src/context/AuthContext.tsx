import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoAdmin: () => void;
  logout: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginWithGoogle: async () => {},
  loginAsDemoAdmin: () => {},
  logout: async () => {},
  authError: null,
});

const BOOTSTRAP_ADMIN_EMAIL = 'anujkesharwani07p@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if demo admin was stored in session
    const demoAdminSession = sessionStorage.getItem('vrind_demo_admin');
    if (demoAdminSession === 'true') {
      setIsAdmin(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        // Check if email matches bootstrap admin
        if (currentUser.email === BOOTSTRAP_ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          try {
            // Check admins table
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            if (adminDoc.exists()) {
              setIsAdmin(true);
            } else if (sessionStorage.getItem('vrind_demo_admin') === 'true') {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } catch (e) {
            console.warn('Could not verify admin doc in firestore:', e);
            if (sessionStorage.getItem('vrind_demo_admin') === 'true') {
              setIsAdmin(true);
            }
          }
        }
      } else {
        if (sessionStorage.getItem('vrind_demo_admin') !== 'true') {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      console.error('Google Sign-in error:', err);
      setAuthError(msg);
      throw err;
    }
  };

  const loginAsDemoAdmin = () => {
    sessionStorage.setItem('vrind_demo_admin', 'true');
    setIsAdmin(true);
  };

  const logout = async () => {
    sessionStorage.removeItem('vrind_demo_admin');
    setIsAdmin(false);
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithGoogle,
        loginAsDemoAdmin,
        logout,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
