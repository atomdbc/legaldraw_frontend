'use client';

import { useState, useCallback, useRef } from 'react';
import { documentApi } from '@/lib/api/document';
import { useToast } from '@/hooks/use-toast';
import type {
  DocumentResponse,
  GenerateDocumentRequest,
  DocumentDetailResponse,
  DocumentContentResponse,
  DocumentStats,
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
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');

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

  // In useDocument hook
const publishDraft = useCallback(async (documentId: string, content: string, version: string) => {
  if (publishStatus === 'publishing') return;
  
  setPublishStatus('publishing');
  try {
      // Call API with simpler structure
      const response = await documentApi.publishDraft(documentId, content, version);
      setPublishStatus('success');
      setHasUnsavedChanges(false);
      
      toast({ 
          title: "Published Successfully", 
          description: "Document has been published with a new version" 
      });

      return response;
  } catch (error: any) {
      setPublishStatus('error');
      console.error('Publish error details:', error);
      
      toast({
          variant: "destructive",
          title: "Publishing Failed",
          description: error.message || 'Failed to publish document'
      });
      throw error;
  }
}, [publishStatus, toast]);


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
    getStats,
    draftVersion,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    publishStatus,
  publishDraft,

  };
}

export default useDocument;