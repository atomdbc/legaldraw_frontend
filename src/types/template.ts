// src/types/template.ts

export interface TemplateSection {
  title: string;
  content: string;
  variables: string[];
}

export interface TemplateVariable {
  name: string;
  type: string;
}

export interface Template {
  id: string;
  title: string;
  content: string;
  description?: string;
  metadata?: {
    sections?: TemplateSection[];
    variables?: TemplateVariable[];
  };
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateQueryParams {
  search?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
}

export interface TemplatesResponse {
  templates: Template[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}