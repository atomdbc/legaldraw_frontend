// src/lib/api/download.ts

import { authApi } from './auth';
import type { 
  DownloadHistoryResponse, 
  DownloadStatsResponse, 
  RemainingDownloadsResponse
} from '@/types/download';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class DownloadApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string }) {
    super(error.message);
    this.name = 'DownloadApiError';
  }

  toJSON() {
    return {
      name: this.name,
      error: this.error
    };
  }
}

export const downloadApi = {
  async getDownloadHistory(
    skip: number = 0,
    limit: number = 10,
    startDate?: string,
    endDate?: string
  ): Promise<DownloadHistoryResponse> {
    try {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString()
      });
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await authApi.authenticatedRequest<DownloadHistoryResponse>(
        `${API_BASE_URL}/api/downloads/history?${params.toString()}`
      );
      return response;
    } catch (error: any) {
      console.error('Download history error:', error);
      throw new DownloadApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch download history',
        code: 'GET_DOWNLOAD_HISTORY_ERROR'
      });
    }
  },

  async getDownloadStats(period: 'daily' | 'weekly' | 'monthly' | 'all' = 'all'): Promise<DownloadStatsResponse> {
    try {
      const response = await authApi.authenticatedRequest<DownloadStatsResponse>(
        `${API_BASE_URL}/api/downloads/stats?period=${period}`
      );
      return response;
    } catch (error: any) {
      console.error('Download stats error:', error);
      throw new DownloadApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch download statistics',
        code: 'GET_DOWNLOAD_STATS_ERROR'
      });
    }
  },

  async trackDownloadStart(documentId: string): Promise<void> {
    try {
      await authApi.authenticatedRequest(
        `${API_BASE_URL}/api/downloads/${documentId}/track/start`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error: any) {
      console.error('Track download start error:', error);
      throw new DownloadApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to track download start',
        code: 'TRACK_DOWNLOAD_START_ERROR'
      });
    }
  },

  async trackDownloadComplete(documentId: string, fileSize: number): Promise<void> {
    try {
      await authApi.authenticatedRequest(
        `${API_BASE_URL}/api/downloads/${documentId}/track/complete?file_size=${fileSize}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (error: any) {
      console.error('Track download complete error:', error);
      throw new DownloadApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to track download completion',
        code: 'TRACK_DOWNLOAD_COMPLETE_ERROR'
      });
    }
  },

  async trackFullDownload(documentId: string, fileSize: number): Promise<boolean> {
    try {
      await this.trackDownloadStart(documentId);
      await this.trackDownloadComplete(documentId, fileSize);
      return true;
    } catch (error: any) {
      console.error('Full download tracking error:', error);
      throw new DownloadApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to track download',
        code: 'TRACK_FULL_DOWNLOAD_ERROR'
      });
    }
  }
,

async getRemainingDownloads(): Promise<RemainingDownloadsResponse> {
  try {
    const response = await authApi.authenticatedRequest<RemainingDownloadsResponse>(
      `${API_BASE_URL}/api/downloads/remaining`
    );
    return response;
  } catch (error: any) {
    console.error('Remaining downloads error:', error);
    throw new DownloadApiError({
      status: error?.error?.status || 500,
      message: error.message || 'Failed to fetch remaining downloads',
      code: 'GET_REMAINING_DOWNLOADS_ERROR'
    });
  }
}
};