// src/lib/api/template.ts
import axios from 'axios';
import { Template, TemplateQueryParams, TemplatesResponse } from '@/types/template';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const templateApi = {
  async createTemplate(data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await axios.post<{ status: string; data: Template }>(
      `${API_URL}/templates`,
      data,
      { withCredentials: true }
    );
    return response.data;
  },

  async getTemplates(params: TemplateQueryParams) {
    const response = await axios.get<TemplatesResponse>(
      `${API_URL}/templates`,
      {
        params,
        withCredentials: true
      }
    );
    return response.data;
  },

  async getTemplate(id: string) {
    const response = await axios.get<{ status: string; data: Template }>(
      `${API_URL}/templates/${id}`,
      { withCredentials: true }
    );
    return response.data;
  },

  async updateTemplate(
    id: string,
    data: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>
  ) {
    const response = await axios.put<{ status: string; data: Template }>(
      `${API_URL}/templates/${id}`,
      data,
      { withCredentials: true }
    );
    return response.data;
  },

  async deleteTemplate(id: string) {
    const response = await axios.delete<{ status: string; message: string }>(
      `${API_URL}/templates/${id}`,
      { withCredentials: true }
    );
    return response.data;
  },

  async cloneTemplate(id: string, modifications?: Partial<Template>) {
    const response = await axios.post<{ status: string; data: Template }>(
      `${API_URL}/templates/${id}/clone`,
      modifications,
      { withCredentials: true }
    );
    return response.data;
  },

  async publishTemplate(id: string) {
    const response = await axios.post<{ status: string; data: Template }>(
      `${API_URL}/templates/${id}/publish`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  async previewTemplate(templateId: string, formData: Record<string, any>) {
    const response = await axios.post<{ status: string; data: { content: string } }>(
      `${API_URL}/templates/${templateId}/preview`,
      formData,
      { withCredentials: true }
    );
    return response.data;
  },

  async getVersionHistory(templateId: string) {
    const response = await axios.get<{ status: string; data: any[] }>(
      `${API_URL}/templates/${templateId}/versions`,
      { withCredentials: true }
    );
    return response.data;
  },

  async compareVersions(templateId: string, version1: string, version2: string) {
    const response = await axios.get<{ status: string; data: any }>(
      `${API_URL}/templates/${templateId}/versions/compare`,
      {
        params: { version1, version2 },
        withCredentials: true
      }
    );
    return response.data;
  },

  async previewVersion(templateId: string, version: string) {
    const response = await axios.get<{ status: string; data: Template }>(
      `${API_URL}/templates/${templateId}/versions/${version}/preview`,
      { withCredentials: true }
    );
    return response.data;
  },

  async createVersion(templateId: string, changelog: string[], updates: any) {
    const response = await axios.post<{ 
      status: string; 
      data: {
        version: string;
        id: string;
        changelog: string[];
      }
    }>(
      `${API_URL}/templates/${templateId}/versions`,
      {
        changelog,
        updates
      },
      { withCredentials: true }
    );
    return response.data;
  },

  async deprecateVersion(templateId: string, version: string, reason: string) {
    const response = await axios.post<{ status: string; message: string }>(
      `${API_URL}/templates/${templateId}/versions/deprecate`,
      {
        version,
        reason
      },
      { withCredentials: true }
    );
    return response.data;
  }
};