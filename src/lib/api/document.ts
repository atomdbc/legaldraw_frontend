// src/lib/api/document.ts

import { authApi } from './auth';
import { v4 as uuidv4 } from 'uuid';
import type {
  DocumentResponse,
  DocumentListResponse,
  GenerateDocumentRequest,
  DocumentContentResponse,
  DocumentStats,
  PublishDraftRequest
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

  async publishDraft(
    documentId: string, 
    content: string, 
    version: string
  ): Promise<DocumentResponse> {
    try {
      const newDocumentId = uuidv4();
      
      const publishData: PublishDraftRequest = {
        new_document_id: newDocumentId,
        content: content,
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
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(publishData)
        }
      );
      return response;
    } catch (error: any) {
      console.error('Publish error:', error);
      throw new DocumentApiError({
        status: error?.error?.status || 500,
        message: error?.error?.message || error.message || 'Failed to publish draft',
        code: 'PUBLISH_DRAFT_ERROR'
      });
    }
  }

};

