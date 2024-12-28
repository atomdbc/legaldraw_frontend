// src/lib/api/document.ts

import { authApi } from './auth';
import type {
  DocumentResponse,
  DocumentListResponse,
  GenerateDocumentRequest,
  DocumentDetailResponse,
  DocumentContentResponse,
  DocumentSearchParams,
  DocumentStats,
  DocumentHistory,
  DocumentUpdate,
  PartyUpdate,
  DocumentDraftResponse,
  DocumentDraftStatus
} from '@/types/document';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class DocumentApiError extends Error {
  constructor(public error: { status: number; message: string; code?: string }) {
    super(error.message);
    this.name = 'DocumentApiError';
    
    // Log the actual error details for debugging
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
        `${API_BASE_URL}/api/documents/?skip=${skip}&limit=${limit}`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
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

  async generateDocument(data: GenerateDocumentRequest): Promise<DocumentResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentResponse>(
        `${API_BASE_URL}/api/documents/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        }
      );
  
      return response;
    } catch (error: any) {
      // Log the raw error for debugging
      console.log('Raw generate document error:', error);
  
      if (error.status === 422) {
        // Handle validation errors
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
        message: error?.error?.message || error.message || 'Failed to generate document',
        code: error?.error?.code || 'GENERATE_DOCUMENT_ERROR'
      });
    }
  },

  async getDocument(documentId: string): Promise<DocumentContentResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentContentResponse>(
        `${API_BASE_URL}/api/documents/${documentId}`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      return response;
    } catch (error: any) {
      if (error?.error?.status === 404) {
        throw new DocumentApiError({
          status: 404,
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND'
        });
      }
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch document',
        code: 'GET_DOCUMENT_ERROR'
      });
    }
  },

  async getDocumentContent(documentId: string): Promise<DocumentContentResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentContentResponse>(
        `${API_BASE_URL}/api/documents/${documentId}/content`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      return response;
    } catch (error: any) {
      if (error?.error?.status === 404) {
        throw new DocumentApiError({
          status: 404,
          message: 'Document content not found',
          code: 'DOCUMENT_CONTENT_NOT_FOUND'
        });
      }
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch document content',
        code: 'GET_CONTENT_ERROR'
      });
    }
  },

  async updateDocument(documentId: string, data: DocumentUpdate): Promise<DocumentDetailResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentDetailResponse>(
        `${API_BASE_URL}/api/documents/${documentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      if (error?.error?.status === 404) {
        throw new DocumentApiError({
          status: 404,
          message: 'Document not found',
          code: 'DOCUMENT_NOT_FOUND'
        });
      }
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to update document',
        code: 'UPDATE_DOCUMENT_ERROR'
      });
    }
  },

  async updateParty(documentId: string, partyId: string, data: PartyUpdate): Promise<DocumentDetailResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentDetailResponse>(
        `${API_BASE_URL}/api/documents/${documentId}/parties/${partyId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      if (error?.error?.status === 404) {
        throw new DocumentApiError({
          status: 404,
          message: 'Party not found',
          code: 'PARTY_NOT_FOUND'
        });
      }
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to update party',
        code: 'UPDATE_PARTY_ERROR'
      });
    }
  },

  async getDocumentHistory(documentId: string): Promise<DocumentHistory> {
    try {
      const response = await authApi.authenticatedRequest<DocumentHistory>(
        `${API_BASE_URL}/api/documents/${documentId}/history`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      return response;
    } catch (error: any) {
      if (error?.error?.status === 404) {
        throw new DocumentApiError({
          status: 404,
          message: 'Document history not found',
          code: 'HISTORY_NOT_FOUND'
        });
      }
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to fetch document history',
        code: 'GET_HISTORY_ERROR'
      });
    }
  },

  async searchDocuments(
    params: DocumentSearchParams,
    skip: number = 0,
    limit: number = 100
  ): Promise<DocumentListResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentListResponse>(
        `${API_BASE_URL}/api/documents/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ ...params, skip, limit })
        }
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to search documents',
        code: 'SEARCH_DOCUMENTS_ERROR'
      });
    }
  },

  async getDocumentStats(): Promise<DocumentStats> {
    try {
      const response = await authApi.authenticatedRequest<DocumentStats>(
        `${API_BASE_URL}/api/documents/stats/overview`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
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

  async downloadDocument(documentId: string, format: string = 'pdf'): Promise<Blob> {
    try {
      const response = await authApi.authenticatedRequest<Blob>(
        `${API_BASE_URL}/api/documents/${documentId}/download?format=${format}`,
        {
          headers: {
            'Accept': 'application/octet-stream',
          }
        }
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to download document',
        code: 'DOWNLOAD_ERROR'
      });
    }
  },

  async saveDraft(documentId: string, data: {
    content: string;
    version: number;
    document_metadata: any;
  }): Promise<DocumentDraftResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentDraftResponse>(
        `${API_BASE_URL}/api/documents/${documentId}/draft`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to save draft',
        code: 'SAVE_DRAFT_ERROR'
      });
    }
  },
  
  async publishDraft(documentId: string): Promise<DocumentResponse> {
    try {
      const response = await authApi.authenticatedRequest<DocumentResponse>(
        `${API_BASE_URL}/api/documents/${documentId}/draft/publish`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          }
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
  },
  
  async discardDraft(documentId: string): Promise<void> {
    try {
      await authApi.authenticatedRequest(
        `${API_BASE_URL}/api/documents/${documentId}/draft`,
        {
          method: 'DELETE',
        }
      );
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to discard draft',
        code: 'DISCARD_DRAFT_ERROR'
      });
    }
  },
  
  async getDraftStatus(documentId: string): Promise<DocumentDraftStatus> {
    try {
      const response = await authApi.authenticatedRequest<DocumentDraftStatus>(
        `${API_BASE_URL}/api/documents/${documentId}/draft/status`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      return response;
    } catch (error: any) {
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to get draft status',
        code: 'GET_DRAFT_STATUS_ERROR'
      });
    }
  }
};