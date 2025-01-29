import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { userApi } from '@/lib/api/user';
import { authApi } from '@/lib/api/auth';
import type { User, UserUpdateRequest } from '@/types/user';
import type { OTPVerificationData } from '@/types/auth';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const getProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await userApi.getProfile();
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UserUpdateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.updateProfile(data);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to update profile';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Update Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const uploadAvatar = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userApi.uploadAvatar(file);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated"
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to upload avatar';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const requestDeleteAccountOTP = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.requestDeleteAccountOTP();
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for the verification code"
      });
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to request verification code';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Request Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const deleteAccount = useCallback(async (data: OTPVerificationData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.deleteAccount(data);
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted"
      });
      router.push('/login');
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to delete account';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast, router]);

  return {
    isLoading,
    error,
    getProfile,
    updateProfile,
    uploadAvatar,
    requestDeleteAccountOTP,
    deleteAccount
  }};