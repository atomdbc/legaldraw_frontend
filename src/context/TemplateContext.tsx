// src/context/TemplateContext.tsx'
"use client"
import { createContext, useContext, useState, useCallback } from 'react';
import { Template, TemplateQueryParams, TemplatesResponse } from '@/types/template';
import { templateApi } from '@/lib/api/template';

interface TemplateContextType {
  templates: Template[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  fetchTemplates: (params?: TemplateQueryParams) => Promise<void>;
  createTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Template>;
  deleteTemplate: (id: string) => Promise<void>;
  updateTemplate: (id: string, data: Partial<Template>) => Promise<Template>;
  getTemplate: (id: string) => Promise<{ data: Template }>;
  previewTemplate: (templateId: string, formData: Record<string, any>) => Promise<string>;
  getVersionHistory: (templateId: string) => Promise<any[]>;
  compareVersions: (templateId: string, version1: string, version2: string) => Promise<any>;
  previewVersion: (templateId: string, version: string) => Promise<Template>;
  createVersion: (templateId: string, changelog: string[], updates: any) => Promise<any>;
  deprecateVersion: (templateId: string, version: string, reason: string) => Promise<void>;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const getTemplate = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await templateApi.getTemplate(id);
      return response;
    } catch (err) {
      setError('Failed to fetch template');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchTemplates = useCallback(async (params?: TemplateQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await templateApi.getTemplates(params || {});
      setTemplates(response.data.templates);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await templateApi.createTemplate(template);
      await fetchTemplates(); // Refresh the list
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, [fetchTemplates]);

  const deleteTemplate = useCallback(async (id: string) => {
    try {
      await templateApi.deleteTemplate(id);
      setTemplates(current => current.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, data: Partial<Template>) => {
    try {
      const response = await templateApi.updateTemplate(id, data);
      setTemplates(current =>
        current.map(t => t.id === id ? response.data : t)
      );
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // New methods for preview and versions
  const previewTemplate = useCallback(async (templateId: string, formData: Record<string, any>) => {
    try {
      const response = await templateApi.previewTemplate(templateId, formData);
      return response.data.content;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const getVersionHistory = useCallback(async (templateId: string) => {
    try {
      const response = await templateApi.getVersionHistory(templateId);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const compareVersions = useCallback(async (templateId: string, version1: string, version2: string) => {
    try {
      const response = await templateApi.compareVersions(templateId, version1, version2);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const previewVersion = useCallback(async (templateId: string, version: string) => {
    try {
      const response = await templateApi.previewVersion(templateId, version);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const createVersion = useCallback(async (templateId: string, changelog: string[], updates: any) => {
    try {
      const response = await templateApi.createVersion(templateId, changelog, updates);
      return response.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const deprecateVersion = useCallback(async (templateId: string, version: string, reason: string) => {
    try {
      await templateApi.deprecateVersion(templateId, version, reason);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        loading,
        error,
        pagination,
        getTemplate,
        fetchTemplates,
        createTemplate,
        deleteTemplate,
        updateTemplate,
        previewTemplate,
        getVersionHistory,
        compareVersions,
        previewVersion,
        createVersion,
        deprecateVersion
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export const useTemplates = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
};