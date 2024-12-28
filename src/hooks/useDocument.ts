'use client';

import { useState, useCallback, useRef } from 'react';
import { documentApi } from '@/lib/api/document';
import { useToast } from '@/hooks/use-toast';
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
} from '@/types/document';

export function useDocument() {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentDetailResponse | null>(null);
  const [documentContent, setDocumentContent] = useState<DocumentContentResponse | null>(null);
  const [documentStats, setDocumentStats] = useState<DocumentStats | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [draftVersion, setDraftVersion] = useState<number>(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Simple rate limiting
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 60000; // 1 minute

  // List Documents
  const fetchDocuments = useCallback(async (skip: number = 0, limit: number = 100) => {
    const now = Date.now();
    if (now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.listDocuments(skip, limit);
      
      if (response && response.documents) {
        setDocuments(response.documents);
        setTotal(response.total);
      } else {
        setDocuments([]);
        setTotal(0);
      }
      
      setError(null);
      lastFetchTime.current = now;
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to fetch documents');
      setError(err);
      setDocuments([]); // Reset to empty array on error
      setTotal(0);
      
      if (error?.error?.status !== 429 || !documents.length) {
        toast({
          variant: "destructive",
          title: error?.error?.status === 429 ? "Rate Limit" : "Error",
          description: error?.error?.status === 429 
            ? "Please wait a moment before refreshing"
            : err.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, documents.length, toast]);

  // Generate Document
  const generateDocument = useCallback(async (data: GenerateDocumentRequest) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.generateDocument(data);
      setError(null);
      toast({
        title: "Success",
        description: "Document generated successfully"
      });
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to generate document');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  // Get Document Details
  const getDocument = useCallback(async (documentId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.getDocument(documentId);
      setCurrentDocument(response);
      setError(null);
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to fetch document details');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  // Get Document Content
  const getDocumentContent = useCallback(async (documentId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.getDocumentContent(documentId);
      setDocumentContent(response);
      setError(null);
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to fetch document content');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  const saveDraft = useCallback(async (documentId: string, content: string) => {
    setIsLoading(true);
    try {
      const response = await documentApi.saveDraft(documentId, {
        content,
        version: draftVersion + 1,
        document_metadata: {
          last_edited: new Date().toISOString(),
          has_cover_page: hasCoverPage,
          watermark_settings: {
            enabled: hasWatermark,
            text: watermarkText
          }
        }
      });

      setDraftVersion(response.version);
      setHasUnsavedChanges(false);
      return response;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save draft"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [draftVersion, toast]);


  // Update Document
  const updateDocument = useCallback(async (documentId: string, data: DocumentUpdate) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.updateDocument(documentId, data);
      setCurrentDocument(response);
      setError(null);
      toast({
        title: "Success",
        description: "Document updated successfully"
      });
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to update document');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  // Get Document History
  const getDocumentHistory = useCallback(async (documentId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.getDocumentHistory(documentId);
      setError(null);
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to fetch document history');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  const publishDraft = useCallback(async (documentId: string) => {
    setIsLoading(true);
    try {
      const response = await documentApi.publishDraft(documentId);
      setDraftVersion(0); // Reset draft version
      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Changes published successfully"
      });
      return response;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish changes"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // For discarding draft
  const discardDraft = useCallback(async (documentId: string) => {
    setIsLoading(true);
    try {
      await documentApi.discardDraft(documentId);
      setDraftVersion(0);
      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Draft discarded"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to discard draft"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  // For getting draft status
  const getDraftStatus = useCallback(async (documentId: string) => {
    try {
      const response = await documentApi.getDraftStatus(documentId);
      setDraftVersion(response.version);
      setHasUnsavedChanges(response.has_unsaved_changes);
      return response;
    } catch (error: any) {
      console.error("Failed to get draft status:", error);
    }
  }, []);

  // Search Documents
  const searchDocuments = useCallback(async (
    params: DocumentSearchParams,
    skip: number = 0,
    limit: number = 100
  ) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.searchDocuments(params, skip, limit);
      setDocuments(response.documents);
      setError(null);
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to search documents');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  // Get Document Stats
  const getStats = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await documentApi.getDocumentStats();
      setDocumentStats(response);
      setError(null);
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to fetch document statistics');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  return {
    // State
    documents,
    currentDocument,
    documentContent,
    documentStats,
    isLoading,
    error,
    
    // Actions
    fetchDocuments,
    generateDocument,
    getDocument,
    getDocumentContent,
    updateDocument,
    getDocumentHistory,
    searchDocuments,
    getStats,
    saveDraft,
    draftVersion,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    publishDraft,
  discardDraft,
  getDraftStatus,
  };
}

export default useDocument;