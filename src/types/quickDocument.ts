// src/types/quickDocument.ts

import { DocumentStatus } from './enums';

// Document Types
export type QuickDocumentType = 'QUICK_NDA' | 'QUICK_SERVICE' | 'QUICK_EMPLOYMENT';

// Party Interface
export interface QuickDocumentParty {
  name: string;
  type: string;
  email?: string;
  phone?: string;
  jurisdiction?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
}

// Settings Interface
export interface QuickDocumentSettings {
  language: string;
  format_version: string;
  include_headers: boolean;
  include_footers: boolean;
  page_numbers: boolean;
  formatting?: {
    font_size?: string;
    font_family?: string;
    margins?: string;
    line_spacing?: number;
  };
}

// Template-specific Variables
export interface QuickNDAVariables {
  party1_name: string;
  party2_name: string;
  effective_date: string;
  purpose: string;
  confidential_info_types: string;
  duration: string;
  governing_law: string;
  party1_title?: string;
  party2_title?: string;
  party1_address?: string;
  party2_address?: string;
}

export interface QuickServiceVariables {
  service_provider: string;
  client_name: string;
  service_description: string;
  start_date: string;
  end_date: string;
  compensation: string;
  payment_terms: string;
  governing_law: string;
  service_description?: string;
  compensation_terms?: string;
  service_duration?: string;
  deliverables?: string;
}

export interface QuickEmploymentVariables {
  employer_name: string;
  employee_name: string;
  position_title: string;
  employment_type: 'full-time' | 'part-time' | 'contract';
  start_date: string;
  salary: string;
  work_location: string;
  working_hours: string;
  benefits?: string;
  reporting_to?: string;
  governing_law: string;
}

// Template Constraints
export const TEMPLATE_CONSTRAINTS = {
  'QUICK_NDA': {
    requiredFields: [
      'effective_date',
      'purpose',
      'governing_law',
      'duration',
      'party1_name',
      'party2_name'
    ],
    minParties: 2
  },
  'QUICK_SERVICE': {
    requiredFields: [
      'service_description',
      'start_date',
      'end_date',
      'compensation',
      'payment_terms',
      'service_provider',
      'client_name',
      'governing_law'
    ],
    minParties: 2
  },
  'QUICK_EMPLOYMENT': {
    requiredFields: [
      'position_title',
      'employment_type',
      'start_date',
      'salary',
      'work_location',
      'working_hours',
      'employer_name',
      'employee_name',
      'governing_law'
    ],
    minParties: 2
  }
} as const;

// Template Metadata
export interface TemplateMetadata {
  version: string;
  type: QuickDocumentType;
  category: string;
  supports_countries: string[];
  required_fields: string[];
  optional_fields: string[];
}

// Document Request/Response
export interface QuickDocumentRequest {
  template_type: QuickDocumentType;
  variables: QuickNDAVariables | QuickServiceVariables | QuickEmploymentVariables;
  country_code: string;
  metadata?: Record<string, any>;
  parties: QuickDocumentParty[];
  effective_date?: string | Date;
  settings?: QuickDocumentSettings;
}

export interface QuickDocumentResponse {
  document_id: string;
  content?: string;
  document_type: QuickDocumentType;
  template_id: string;
  status: DocumentStatus;
  version: string;
  generated_at: string;
  document_metadata: Record<string, any>;
  parties?: QuickDocumentParty[];
}

export interface QuickDocumentListResponse {
  documents: QuickDocumentResponse[];
  total: number;
  skip: number;
  limit: number;
}

// Error and Validation
export interface QuickDocumentError {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, any>;
}

export type TemplateValidation = {
  [K in QuickDocumentType]: {
    requiredFields: string[];
    validateVariables: (variables: any) => boolean;
  }
};

export interface QuickDocumentVersionInfo {
  version_number: string;
  created_at: string;
  created_by: string;
  version_metadata: Record<string, any>;
}

export interface QuickDocumentStats {
  total_documents: number;
  documents_by_status: Record<DocumentStatus, number>;
  recent_activity: Array<{
    document_id: string;
    action: string;
    timestamp: string;
    user_id: string;
  }>;
}