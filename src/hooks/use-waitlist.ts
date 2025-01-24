import { useState, useCallback } from 'react';
import { waitlistApi, WaitlistEntry } from '@/lib/api/waitlist';
import { useToast } from '@/hooks/use-toast';

export const useWaitlist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const joinWaitlist = useCallback(async (data: WaitlistEntry) => {
    if (isLoading) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await waitlistApi.joinWaitlist(data);

      toast({
        title: "Success!",
        description: "You've been added to our waitlist. Check your email for confirmation.",
      });

      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to join waitlist';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  return {
    isLoading,
    error,
    joinWaitlist,
    clearError
  };
};