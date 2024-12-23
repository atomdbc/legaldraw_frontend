'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useToast } from '@/hooks/use-toast';
import { DocumentType } from '@/types/document';
import { Party } from '@/types/party';

const STORAGE_KEY_PREFIX = 'document_progress_';
const DEBOUNCE_MS = 500;

export interface DocumentProgressData {
  parties?: Party[];
  variables?: Record<string, any>;
  settings?: Record<string, any>;
  created_at?: string;
  type?: DocumentType;
}

interface DocumentProgress {
  type: DocumentType;
  step: number;
  data: DocumentProgressData;
  lastUpdated: string;
}

interface ProgressUpdate {
  type: DocumentType;
  step: number;
  data: DocumentProgressData;
}

export function useDocumentProgress() {
  const [data, setData] = useState<DocumentProgress | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const clearAllProgress = useCallback(() => {
    if (!isClient) return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      setData(null);
    } catch (error) {
      console.error('Error clearing all progress:', error);
    }
  }, [isClient]);

  const initializeProgress = useCallback(async (update: ProgressUpdate) => {
    if (!isClient) return false;

    try {
      setIsSaving(true);
      
      clearAllProgress();

      const progressData: DocumentProgress = {
        type: update.type,
        step: update.step,
        data: update.data,
        lastUpdated: new Date().toISOString()
      };

      const key = `${STORAGE_KEY_PREFIX}${update.type.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(progressData));
      
      setData(progressData);
      setIsSaving(false);

      return true;
    } catch (error) {
      console.error('Error initializing progress:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize document progress."
      });
      setIsSaving(false);
      return false;
    }
  }, [isClient, clearAllProgress, toast]);

  const loadProgress = useCallback(() => {
    if (!isClient) return;

    try {
      const entries = Object.entries(localStorage);
      const progressEntry = entries.find(([key]) => 
        key.startsWith(STORAGE_KEY_PREFIX)
      );

      if (progressEntry) {
        const [_, value] = progressEntry;
        const parsed = JSON.parse(value);
        setData(parsed);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      toast({
        variant: "destructive",
        title: "Error Loading Progress",
        description: "Unable to load your saved progress."
      });
    }
  }, [isClient, toast]);

  const debouncedSave = useDebouncedCallback((progressData: DocumentProgress) => {
    if (!isClient) return;

    try {
      const key = `${STORAGE_KEY_PREFIX}${progressData.type.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(progressData));
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        variant: "destructive",
        title: "Error Saving Progress",
        description: "Unable to save your progress. Please check your browser storage settings."
      });
      setIsSaving(false);
    }
  }, DEBOUNCE_MS);

  const updateProgress = useCallback(async (update: ProgressUpdate) => {
    if (!isClient) return;

    setIsSaving(true);

    const progressData: DocumentProgress = {
      type: update.type,
      step: update.step,
      data: {
        ...data?.data,
        ...update.data
      },
      lastUpdated: new Date().toISOString()
    };

    setData(progressData);
    debouncedSave(progressData);
  }, [isClient, data, debouncedSave]);

  const clearProgress = useCallback((type: DocumentType) => {
    if (!isClient) return;

    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${type.toLowerCase()}`);
      if (data?.type === type) {
        setData(null);
      }
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }, [isClient, data]);

  const hasExistingProgress = useCallback((type: DocumentType): boolean => {
    if (!isClient) return false;

    try {
      const key = `${STORAGE_KEY_PREFIX}${type.toLowerCase()}`;
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [isClient]);

  const getCurrentStep = useCallback((type: DocumentType): number => {
    if (!isClient || !data || data.type !== type) return 0;
    return data.step;
  }, [isClient, data]);

  const validateProgress = useCallback((type: DocumentType, step: number): boolean => {
    if (!isClient || !data || data.type !== type || data.step < step) {
      return false;
    }

    switch (step) {
      case 1: // Document Type
        return true;
      case 2: // Parties
        return data.data.parties?.length >= 2;
      case 3: // Details
        return Boolean(data.data.variables && Object.keys(data.data.variables).length > 0);
      case 4: // Preview
        return Boolean(data.data.parties?.length >= 2 && data.data.variables);
      default:
        return false;
    }
  }, [isClient, data]);

  useEffect(() => {
    if (isClient) {
      loadProgress();
    }
  }, [isClient, loadProgress]);

  return {
    data,
    isSaving,
    isClient,
    initializeProgress,
    updateProgress,
    clearProgress,
    clearAllProgress,
    hasExistingProgress,
    getCurrentStep,
    validateProgress
  };
}