import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getStoredUser, getStoredToken, storeAuth, clearAuth } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: 'student' | 'instructor' | 'admin') => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verify() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch {
          // Token expired or invalid
          clearAuth();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    }
    verify();
  }, [token]);

  const login = async (email: string, password: string = 'password123') => {
    const res = await api.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    storeAuth(res.token, res.user);
  };

  const register = async (name: string, email: string, password: string, role: string = 'student') => {
    const res = await api.register({ name, email, password, role });
    setUser(res.user);
    setToken(res.token);
    storeAuth(res.token, res.user);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  const quickDemoLogin = async (role: 'student' | 'instructor' | 'admin') => {
    let email = 'student@learnova.edu';
    if (role === 'instructor') email = 'sarah.chen@learnova.edu';
    if (role === 'admin') email = 'admin@learnova.edu';
    await login(email, 'password123');
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
