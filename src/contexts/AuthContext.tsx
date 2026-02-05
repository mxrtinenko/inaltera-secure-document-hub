import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/api';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = getAuthToken();
    const savedUser = localStorage.getItem('inaltera_user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        removeAuthToken();
        localStorage.removeItem('inaltera_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, token: string) => {
    const newUser = { email, id: crypto.randomUUID() };
    setAuthToken(token);
    localStorage.setItem('inaltera_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('inaltera_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};