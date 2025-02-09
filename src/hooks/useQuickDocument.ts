// src/hooks/useQuickDocument.ts

'use client';

import { useState, useCallback } from 'react';
import { quickDocumentApi, QuickDocumentApiError } from '@/lib/api/quickDocument';
import { useToast } from '@/hooks/use-toast';
import type {
  QuickDocumentResponse,
  QuickDocumentRequest,

} from '@/types/quickDocument';

export function useQuickDocument() {
  const [documents, setDocuments] = useState<QuickDocumentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentDocument, setCurrentDocument] = useState<QuickDocumentResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async (
    skip: number = 0, 
    limit: number = 100,
    status?: string
  ) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await quickDocumentApi.listDocuments(skip, limit, status);
      setDocuments(response.documents);
      setError(null);
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to fetch documents');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  const generateDocument = useCallback(async (data: QuickDocumentRequest) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await quickDocumentApi.generateDocument(data);
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

  const getDocument = useCallback(async (documentId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await quickDocumentApi.getDocument(documentId);
      setCurrentDocument(response);
      setError(null);
      return response;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error('Failed to fetch document');
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  const downloadDocument = useCallback(async (documentId: string) => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const blob = await quickDocumentApi.downloadDocument(documentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `document-${documentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error.message
      });
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, toast]);

  const updateStatus = useCallback(async (documentId: string, status: string) => {
    try {
      await quickDocumentApi.updateStatus(documentId, status);
      toast({
        title: "Success",
        description: "Document status updated successfully"
      });
      
      if (currentDocument?.document_id === documentId) {
        await getDocument(documentId);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  }, [currentDocument, getDocument, toast]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      await quickDocumentApi.deleteDocument(documentId);
      toast({
        title: "Success",
        description: "Document deleted successfully"
      });
      // Refresh documents list if needed
      fetchDocuments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  }, [fetchDocuments, toast]);

  return {
    // State
    documents,
    currentDocument,
    isLoading,
    isDownloading,
    error,
    
    // Actions
    fetchDocuments,
    generateDocument,
    getDocument,
    downloadDocument,
    updateStatus,
    deleteDocument,
    
    // Utilities
    clearError: () => setError(null),
  };
}