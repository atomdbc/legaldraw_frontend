// src/hooks/useDownloads.ts

import { useState, useCallback } from 'react';
import { downloadApi } from '@/lib/api/download';
import { useToast } from '@/hooks/use-toast';
import type { 
  DownloadHistoryResponse, 
  DownloadStatsResponse,
  DownloadPeriod,
  RemainingDownloadsResponse
} from '@/types/download';

interface UseDownloadsReturn {
  isLoading: boolean;
  error: string | null;
  getDownloadHistory: (skip?: number, limit?: number, startDate?: string, endDate?: string) => Promise<DownloadHistoryResponse | null>;
  getDownloadStats: (period?: DownloadPeriod) => Promise<DownloadStatsResponse | null>;
  getRemainingDownloads: () => Promise<RemainingDownloadsResponse | null>;
  trackDownload: (documentId: string, fileSize: number) => Promise<boolean>;
  clearError: () => void;
}

export const useDownloads = (): UseDownloadsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => setError(null), []);

  const getDownloadHistory = useCallback(async (
    skip: number = 0,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<DownloadHistoryResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await downloadApi.getDownloadHistory(skip, limit, startDate, endDate);
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch download history';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Download History Error",
        description: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getDownloadStats = useCallback(async (
    period: DownloadPeriod = 'all'
  ): Promise<DownloadStatsResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await downloadApi.getDownloadStats(period);
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch download statistics';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Download Stats Error",
        description: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const trackDownload = useCallback(async (
    documentId: string,
    fileSize: number
  ): Promise<boolean> => {
    setError(null);
    try {
      return await downloadApi.trackFullDownload(documentId, fileSize);
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to track download';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Download Tracking Error",
        description: errorMessage
      });
      return false;
    }
  }, [toast]);

  const getRemainingDownloads = useCallback(async (): Promise<RemainingDownloadsResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await downloadApi.getRemainingDownloads();
      return response;
    } catch (err: any) {
      const errorMessage = err.error?.message || 'Failed to fetch remaining downloads';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Download Limit Error",
        description: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    error,
    getDownloadHistory,
    getDownloadStats,
    getRemainingDownloads,
    trackDownload,
    clearError
  }}