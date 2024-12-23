// src/types/document.ts

export interface AddressBase {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface NDAVariables {
  purpose: string;
  duration: string;
  governing_law: string;
  effective_date: string;
  confidential_info_types?: string;
  industry_type?: string;
  protection_requirements?: string;
  permitted_uses?: string;
}


export function isNDAVariables(variables: any): variables is NDAVariables {
  return (
    typeof variables === 'object' &&
    'purpose' in variables &&
    'confidential_info_types' in variables &&
    'industry_type' in variables &&
    'protection_requirements' in variables &&
    'permitted_uses' in variables &&
    'duration' in variables &&
    'governing_law' in variables
  );
}

export interface Party {
  id?: string;
  document_id?: string;
  name: string;
  type: string;
  email: string;
  jurisdiction: string;
  address: AddressBase;
  signing_status?: string;
  signed_at?: string | null;
  party_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentResponse {
  document_id: string;
  document_type: string;
  template_id: string;
  status: string;
  generated_at: string;
  content: string | null;
  version: string;
  document_metadata?: Record<string, any>;
}

export interface DocumentListResponse {
  documents: DocumentResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface DocumentDetailResponse extends DocumentResponse {
  user_id: string;
  parties?: Party[];
  updated_at?: string;
  created_at: string;
}

export interface DocumentContentResponse extends DocumentDetailResponse {
  content: string;
}

export interface DocumentSearchParams {
  document_type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  search_term?: string;
}

export interface DocumentStats {
  total_documents: number;
  documents_by_type: Record<string, number>;
  documents_by_status: Record<string, number>;
  recent_activity: {
    date: string;
    count: number;
  }[];
}

export interface DocumentHistory {
  document_id: string;
  versions: {
    version_number: string;
    created_at: string;
    created_by: string;
    version_metadata?: Record<string, any>;
  }[];
}

export interface DocumentUpdate {
  status?: string;
  document_metadata?: Record<string, any>;
}

export interface PartyUpdate {
  signing_status?: string;
  party_metadata?: Record<string, any>;
}

export interface GenerateDocumentRequest {
  template_id: string;
  document_type: DocumentType;
  parties: PartyBackend[];
  variables: NDAVariables;
  effective_date?: string;
}

export interface PartyBackend {
  name: string;
  type: string;
  email?: string | null;
  phone?: string | null;
  jurisdiction?: string | null;
  address: AddressBackend;
}

export interface AddressBackend {
  street: string;
  city: string;
  state: string;
  zip_code: string;  // Changed to match backend
  country: string;
}

// Constants
export enum DocumentType {
  NDA = 'NDA',
  CONTRACT = 'CONTRACT',
  AGREEMENT = 'AGREEMENT',
  OTHER = 'OTHER'
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// Utility object for document type operations
export const documentTypeUtils = {
  toDisplayName(type: DocumentType): string {
    return type.toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  fromString(value: string): DocumentType {
    const normalizedValue = value.toUpperCase().replace(/ /g, '_') as keyof typeof DocumentType;
    if (normalizedValue in DocumentType) {
      return DocumentType[normalizedValue];
    }
    throw new Error(`Invalid document type: ${value}`);
  },

  toBackendFormat(type: DocumentType): string {
    return type.toUpperCase();
  },

  isValid(type: string): type is DocumentType {
    return Object.values(DocumentType).includes(type as DocumentType);
  }
};

// Document progress types
export interface DocumentProgressData {
  parties?: Party[];
  variables?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface DocumentProgress {
  type: DocumentType;
  step: number;
  data: DocumentProgressData;
  lastUpdated: string;
}

// Document template types
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  document_type: DocumentType;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface DocumentVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  label: string;
  description?: string;
  required: boolean;
  default?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

