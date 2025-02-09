// src/lib/api/quickDocument.ts

import { authApi } from './auth';
import {
  QuickDocumentResponse,
  QuickDocumentListResponse,
  QuickDocumentRequest,
  QuickDocumentType,
  QuickServiceVariables,
  TEMPLATE_CONSTRAINTS,
} from '@/types/quickDocument';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Service-specific validation helper
const validateServiceDocument = (variables: QuickServiceVariables) => {
  const requiredFields = TEMPLATE_CONSTRAINTS['QUICK_SERVICE'].requiredFields;
  const missingFields = requiredFields.filter(field => !variables[field]);

  if (missingFields.length > 0) {
    throw new QuickDocumentApiError({
      status: 400,
      message: `Missing required service agreement fields: ${missingFields.join(', ')}`,
      code: 'MISSING_SERVICE_FIELDS'
    });
  }

  // Validate dates
  const start = new Date(variables.start_date);
  const end = new Date(variables.end_date);
  if (end <= start) {
    throw new QuickDocumentApiError({
      status: 400,
      message: 'End date must be after start date',
      code: 'INVALID_DATE_RANGE'
    });
  }
};

export class QuickDocumentApiError extends Error {
  constructor(public error: { 
    status: number; 
    message: string; 
    code?: string; 
    detail?: any 
  }) {
    super(error.message);
    this.name = 'QuickDocumentApiError';
  }
}

const validateDocumentRequest = (data: QuickDocumentRequest) => {
  // Validate document type
  if (data.template_type !== 'QUICK_SERVICE') {
    throw new QuickDocumentApiError({
      status: 400,
      message: 'Invalid template type for service agreement',
      code: 'INVALID_TEMPLATE_TYPE'
    });
  }

  // Validate service-specific fields
  validateServiceDocument(data.variables as QuickServiceVariables);

  // Validate parties
  if (!data.parties || data.parties.length < 2) {
    throw new QuickDocumentApiError({
      status: 400,
      message: 'Service agreement requires at least two parties',
      code: 'INSUFFICIENT_PARTIES'
    });
  }

  // Validate addresses
  const invalidParty = data.parties.find(party => 
    !party.address?.street || 
    !party.address?.city || 
    !party.address?.state || 
    !party.address?.zip_code
  );

  if (invalidParty) {
    throw new QuickDocumentApiError({
      status: 400,
      message: 'All parties must have complete address information',
      code: 'INVALID_PARTY_ADDRESS'
    });
  }
};

export const quickDocumentApi = {
  async generateDocument(data: QuickDocumentRequest): Promise<QuickDocumentResponse> {
    try {
      const response = await authApi.authenticatedRequest<QuickDocumentResponse>(
        `${API_BASE_URL}/api/quick-documents/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );
      return response;
    } catch (error: any) {
      if (error?.error?.status === 403 && error?.error?.detail?.includes('Monthly generation limit reached')) {
        throw new QuickDocumentApiError({
          status: 403,
          message: 'You have reached your monthly document generation limit',
          code: 'MONTHLY_LIMIT_REACHED',
          detail: error.error.detail
        });
      }

      if (error?.error?.status === 401) {
        throw new QuickDocumentApiError({
          status: 401,
          message: 'Please log in to generate documents',
          code: 'NOT_AUTHENTICATED',
          detail: error.error
        });
      }

      throw new QuickDocumentApiError({
        status: error?.error?.status || 500,
        message: error?.message || 'Failed to generate document',
        code: 'DOCUMENT_GENERATION_ERROR',
        detail: error
      });
    }
  },

  async listDocuments(
    skip: number = 0,
    limit: number = 100,
    status?: string
  ): Promise<QuickDocumentListResponse> {
    try {
      const queryParams = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });

      const response = await authApi.authenticatedRequest<QuickDocumentListResponse>(
        `${API_BASE_URL}/api/quick-documents/?${queryParams}`
      );
      return response;
    } catch (error: any) {
      throw new QuickDocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to list documents',
        code: 'LIST_DOCUMENTS_ERROR'
      });
    }
  },

  async getDocument(documentId: string): Promise<QuickDocumentResponse> {
    try {
      const response = await authApi.authenticatedRequest<QuickDocumentResponse>(
        `${API_BASE_URL}/api/quick-documents/${documentId}`
      );
      return response;
    } catch (error: any) {
      throw new QuickDocumentApiError({
        status: error?.error?.status === 404 ? 404 : 500,
        message: error?.error?.status === 404 ? 'Document not found' : 'Failed to fetch document',
        code: error?.error?.status === 404 ? 'DOCUMENT_NOT_FOUND' : 'GET_DOCUMENT_ERROR'
      });
    }
  },

  async updateStatus(documentId: string, status: string): Promise<{ status: string; document_status: string }> {
    try {
      const response = await authApi.authenticatedRequest(
        `${API_BASE_URL}/api/quick-documents/${documentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );
      return response;
    } catch (error: any) {
      throw new QuickDocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to update document status',
        code: 'UPDATE_STATUS_ERROR'
      });
    }
  },

  async downloadDocument(documentId: string): Promise<Blob> {
    try {
      const response = await authApi.authenticatedRequest<Blob>(
        `${API_BASE_URL}/api/quick-documents/${documentId}/download`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf'
          }
        },
        true
      );
      return response;
    } catch (error: any) {
      throw new QuickDocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to download document',
        code: 'DOWNLOAD_ERROR'
      });
    }
  },

  async deleteDocument(documentId: string): Promise<{ status: string; message: string }> {
    try {
      const response = await authApi.authenticatedRequest(
        `${API_BASE_URL}/api/quick-documents/${documentId}`,
        {
          method: 'DELETE'
        }
      );
      return response;
    } catch (error: any) {
      throw new QuickDocumentApiError({
        status: error?.error?.status || 500,
        message: error.message || 'Failed to delete document',
        code: 'DELETE_ERROR'
      });
    }
  }
};