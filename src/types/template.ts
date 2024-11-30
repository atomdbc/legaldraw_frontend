// src/types/template.ts
export enum TemplateCategory {
    LEGAL = 'LEGAL',
    BUSINESS = 'BUSINESS',
    PERSONAL = 'PERSONAL',
    OTHER = 'OTHER'
  }
  
  export enum DocumentType {
    CONTRACT = 'CONTRACT',
    AGREEMENT = 'AGREEMENT',
    LETTER = 'LETTER',
    FORM = 'FORM',
    OTHER = 'OTHER'
  }
  
  export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'rich-text';
    required: boolean;
    defaultValue?: any;
    placeholder?: string;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      options?: { label: string; value: string }[];
    };
    description?: string;
  }
  
  export interface TemplateSection {
    id: string;
    title: string;
    order: number;
    content: string;
    fields: TemplateField[];
    isRequired: boolean;
  }
  
  export interface Template {
    id: string;
    title: string;
    description?: string;
    category: TemplateCategory;
    documentType: DocumentType;
    jurisdictions: string[];
    supportedLanguages: string[];
    sections: TemplateSection[];
    variables: {
      name: string;
      type: string;
      description: string;
      defaultValue?: any;
    }[];
    styles?: {
      fontFamily?: string;
      fontSize?: string;
      lineHeight?: string;
      margins?: {
        top: string;
        bottom: string;
        left: string;
        right: string;
      };
    };
    tags?: string[];
    settings?: {
      requireSignature?: boolean;
      allowCustomization?: boolean;
      allowSharing?: boolean;
      allowExport?: boolean;
      validityDuration?: number;
    };
    pricing?: {
      amount: number;
      currency: string;
      interval?: 'one_time' | 'monthly' | 'yearly';
    };
    isPublished?: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TemplateQueryParams {
    category?: TemplateCategory;
    documentType?: DocumentType;
    jurisdiction?: string;
    language?: string;
    search?: string;
    tags?: string[];
    isPublished?: boolean;
    page?: number;
    limit?: number;
  }
  
  export interface TemplatesResponse {
    status: string;
    data: {
      templates: Template[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }
    }
  }