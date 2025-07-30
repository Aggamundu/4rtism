'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { supabaseClient } from '../../utils/supabaseClient';

interface AuthContextType {
  user: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getInitialUser();

    // Single auth listener for the entire app
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
} 