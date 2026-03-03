import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

interface User {
  id: number;
  email: string;
  nombre?: string;
  rol?: string;
  tipo?: 'cliente' | 'tecnico';
}

interface AuthContextType {
  user: User | null;
  type: 'cliente' | 'tecnico' | null;
  loginClient: (email: string, password: string) => Promise<void>;
  loginTech: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [type, setType] = useState<'cliente' | 'tecnico' | null>(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('type');
    setUser(null);
    setType(null);
  };

  const loginClient = async (email: string, password: string) => {
    const data = await api.post('/clientes/login', { email, password });
    const { token, user } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('type', 'cliente');
    setType('cliente');
    setUser(user);
  };

  const loginTech = async (email: string, password: string) => {
    const data = await api.post('/usuarios/login', { email, password });
    const { token, user } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('type', 'tecnico');
    setType('tecnico');
    setUser(user);
  };

  // initialize from storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const t = localStorage.getItem('type') as 'cliente' | 'tecnico' | null;
    if (token && t) {
      if (t === 'cliente') {
        // fetch user info for client
        api.get('/clientes/me')
          .then((u) => setUser(u))
          .catch(() => logout());
        setType('cliente');
      } else if (t === 'tecnico') {
        // fetch user info
        api.get('/usuarios/me')
          .then((u) => setUser(u))
          .catch(() => logout());
        setType('tecnico');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, type, loginClient, loginTech, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
