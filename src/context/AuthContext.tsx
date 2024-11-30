// src/context/AuthContext.tsx
"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';

interface User {
  id: string;
  email: string;
  fullName: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; organization: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    authApi.refreshToken()
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {/* Handle error */})
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.data.user);
  };

  const register = async (data: { email: string; password: string; fullName: string; organization: string }) => {
    const response = await authApi.register(data);
    setUser(response.data.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};