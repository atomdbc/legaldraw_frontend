// src/types/download.ts

export interface DownloadRecord {
    document_id: string;
    document_name: string;
    document_type: string;
    downloaded_at: string;
    file_size?: number;
    status: 'started' | 'completed' | 'failed';
  }
  
  export interface PaginationInfo {
    skip: number;
    limit: number;
    has_more: boolean;
  }
  
  export interface DownloadHistoryResponse {
    downloads: DownloadRecord[];
    total: number;
    pagination: PaginationInfo;
  }
  
  export interface DownloadStats {
    total_downloads: number;
    downloads_by_type: Record<string, number>;
    downloads_by_period: {
      daily: number[];
      weekly: number[];
      monthly: number[];
    };
    average_file_size: number;
    total_bytes_downloaded: number;
  }
  
  export type DownloadStatsResponse = DownloadStats;
  
  export type DownloadPeriod = 'daily' | 'weekly' | 'monthly' | 'all';