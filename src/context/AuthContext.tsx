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
  requestLoginOTP: (email: string) => Promise<any>;
  verifyLoginOTP: (email: string, otp: string) => Promise<void>;
  register: (email: string, full_name: string, company?: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UserUpdateData) => Promise<void>;
  requestEmailVerificationOTP: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  requestDeleteAccountOTP: () => Promise<void>;
  deleteAccount: (email: string, otp: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ['/login', '/register'];

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

  const requestLoginOTP = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.requestLoginOTP(email);
      return response;
    } catch (error) {
      console.error('Login OTP request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLoginOTP = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      await authApi.verifyLoginOTP(email, otp);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await refreshUser();
      router.push('/dashboard');
    } catch (error) {
      console.error('Login verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string, full_name: string, company: string }) => {
    try {
      setIsLoading(true);
      const response = await authApi.register(userData);
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
};

  const verifyEmail = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      await authApi.verifyEmail({ email, otp });
      // After verification, log the user in
      await authApi.verifyLoginOTP(email, otp);
      await refreshUser();
      router.push('/dashboard');
    } catch (error) {
      console.error('Email verification failed:', error);
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

  const requestEmailVerificationOTP = async () => {
    try {
      setIsLoading(true);
      await authApi.requestEmailVerificationOTP();
    } catch (error) {
      console.error('Email verification OTP request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  const requestDeleteAccountOTP = async () => {
    try {
      setIsLoading(true);
      await authApi.requestDeleteAccountOTP();
    } catch (error) {
      console.error('Delete account OTP request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      await authApi.deleteAccount({ email, otp });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Account deletion failed:', error);
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
    requestLoginOTP,
    verifyLoginOTP,
    register,
    logout,
    updateProfile,
    requestEmailVerificationOTP,
    verifyEmail,
    requestDeleteAccountOTP,
    deleteAccount,
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