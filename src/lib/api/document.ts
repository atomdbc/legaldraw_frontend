// src/lib/api/document.ts

import { authApi } from './auth';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import type {
  DocumentResponse,
  DocumentListResponse,
  GenerateDocumentRequest,
  DocumentContentResponse,
  DocumentStats,
  PublishDraftRequest
} from '@/types/document';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.59.116.14';

export class DocumentApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string; detail?: any }) {
    super(error.message);
    this.name = 'DocumentApiError';
    console.log('DocumentApiError Details:', {
      status: error.status,
      message: error.message,
      code: error.code
    });
  }

  toJSON() {
    return {
      name: this.name,
      error: this.error
    };
  }
}

export const documentApi = {
  async listDocuments(skip: number = 0, limit: number = 100): Promise<DocumentListResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentListResponse>(
        `${API_BASE_URL}/api/documents/?skip=${skip}&limit=${limit}`
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to list documents',
        code: 'LIST_DOCUMENTS_ERROR'
      });
    }
  },

  async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/download`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${Cookies.get('accessToken')}`
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new DocumentApiError({
          status: response.status,
          message: errorData.message || 'Failed to download document',
          code: 'DOWNLOAD_ERROR',
          detail: errorData // Include the full error response
        });
      }
  
      return await response.blob();
    } catch (error: any) {
      if (error instanceof DocumentApiError) {
        throw error;
      }
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to download document',
        code: 'DOWNLOAD_ERROR'
      });
    }
  },

  async getDocument(documentId: string): Promise<DocumentContentResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentContentResponse>(
        `${API_BASE_URL}/api/documents/${documentId}`
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status === 404 ? 404 : 500,
        message: error?.error?.status === 404 ? 'Document not found' : 'Failed to fetch document',
        code: error?.error?.status === 404 ? 'DOCUMENT_NOT_FOUND' : 'GET_DOCUMENT_ERROR'
      });
    }
  },

  async getDocumentContent(documentId: string): Promise<DocumentContentResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentContentResponse>(
        `${API_BASE_URL}/api/documents/${documentId}/content`
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status === 404 ? 404 : 500,
        message: error?.error?.status === 404 ? 'Document content not found' : 'Failed to fetch content',
        code: error?.error?.status === 404 ? 'DOCUMENT_CONTENT_NOT_FOUND' : 'GET_CONTENT_ERROR'
      });
    }
  },

  async getDocumentStats(): Promise<DocumentStats> {
    try {
      const response = await authApi.authenticatedRequest<DocumentStats>(
        `${API_BASE_URL}/api/documents/stats/overview`
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch document stats',
        code: 'GET_STATS_ERROR'
      });
    }
  },

  async generateDocument(data: GenerateDocumentRequest): Promise<DocumentResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentResponse>(
        `${API_BASE_URL}/api/documents/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      if (error.status === 422) {
        const validationErrors = await error.json?.() || {};
        throw new DocumentApiError({
          status: 422,
          message: validationErrors.detail || 'Invalid document data',
          code: 'VALIDATION_ERROR',
          errors: validationErrors
        });
      }
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to generate document',
        code: 'GENERATE_DOCUMENT_ERROR'
      });
    }
  },
  
 


  async publishDraft(
    documentId: string, 
    content: string, 
    version: string
  ): Promise<DocumentResponse> {
    try {
      const publishData: PublishDraftRequest = {
        new_document_id: uuidv4(),
        content,
        status: "COMPLETED",
        document_metadata: {
          published_at: new Date().toISOString(),
          published_by: documentId,
          original_document_id: documentId,
        }
      };

      const response = await authApi.authenticatedRequest<DocumentResponse>(
        `${API_BASE_URL}/api/documents/${documentId}/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(publishData)
        }
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to publish draft',
        code: 'PUBLISH_DRAFT_ERROR'
      });
    }
  }
};