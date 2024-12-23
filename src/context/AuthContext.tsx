// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi, AuthError } from '@/lib/api/auth';
import { UserProfile, UserUpdateData } from '@/types/auth';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string, company?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserUpdateData) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/login', '/register', '/reset-password', '/verify-email'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  const refreshUser = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        setUser(null);
        return null;
      }
      const userData = await authApi.getProfile();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        
        if (isPublicPath && !accessToken) {
          setIsLoading(false);
          return;
        }

        if (accessToken) {
          await refreshUser();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [isPublicPath]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authApi.login(email, password);
      
      // Small delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await refreshUser();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    full_name: string,
    company?: string,
    role?: string
  ) => {
    try {
      setIsLoading(true);
      await authApi.register({
        email,
        password,
        full_name,
        company,
        role
      });
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UserUpdateData) => {
    try {
      setIsLoading(true);
      await authApi.updateProfile(data);
      await refreshUser();
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await authApi.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setIsLoading(true);
      await authApi.deleteAccount(password);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      await authApi.verifyEmail(token);
      await refreshUser();
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      setIsLoading(true);
      await authApi.resendVerification();
    } catch (error) {
      console.error('Verification email resend failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await authApi.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        await authApi.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout();
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    verifyEmail,
    resendVerification,
    resetPassword,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
