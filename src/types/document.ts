// src/types/document.ts

import { Jurisdiction, JURISDICTIONS } from '@/lib/config/jurisdictions';

export interface AddressBase {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface NDAVariables {
  purpose: string;
  confidential_info_types: string;
  industry_type: string;
  protection_requirements: string;
  permitted_uses: string;
  duration: string;
  governing_law: string;
  effective_date: string;
}

export interface ServiceVariables {
  service_description: string;
  service_description: string;
  service_category: string;
  payment_terms: string;
  delivery_timeline: string;
  termination_notice: string;
  service_level: string;
  term_duration: string;
  governing_law: string;
  effective_date: string;
}

export interface EmploymentVariables {
  employee_name: string;
  position_title: string;
  base_salary: string;
  employment_type: string;
  start_date: string;
  work_location: string;
  working_hours: string;
  vacation_days: string;
  notice_period: string;
  governing_law: string;
}

export type DocumentVariables = NDAVariables | ServiceVariables | EmploymentVariables;

export interface DocumentDraftStatus {
  version: number;
  has_unsaved_changes: boolean;
  last_edited?: string;
  editor?: string;
}

export interface DocumentDraftResponse {
  version: number;
  content: string;
  document_metadata: any;
  last_edited: string;
}

export interface BaseDocumentField {
  id: string;
  key: string;
  label: string;
  description: string;
  required: boolean;
  placeholder?: string;
  aiAssisted?: boolean;
}

export interface TextDocumentField extends BaseDocumentField {
  type: 'text';
}

export interface TextareaDocumentField extends BaseDocumentField {
  type: 'textarea';
}

export interface SelectDocumentField extends BaseDocumentField {
  type: 'select';
  options: string[];
}

export interface DateDocumentField extends BaseDocumentField {
  type: 'date';
}

export interface JurisdictionField extends BaseDocumentField {
  type: 'jurisdiction';
  allowCustomInput?: boolean;
}

export type DocumentField = 
  | TextDocumentField 
  | TextareaDocumentField 
  | SelectDocumentField 
  | DateDocumentField 
  | JurisdictionField;

export interface DocumentFieldsConfig {
  [key: string]: DocumentField[];
}

const governingLawField: JurisdictionField = {
  id: 'governing_law',
  key: 'governing_law',
  label: 'Governing Law',
  type: 'jurisdiction',
  description: 'Which jurisdiction\'s laws will govern this agreement?',
  required: true,
  allowCustomInput: true
};

export const DOCUMENT_FIELDS_CONFIG: DocumentFieldsConfig = {
  nda: [
    {
      id: 'purpose',
      key: 'purpose',
      label: 'Purpose of Agreement',
      type: 'textarea',
      description: 'Describe the purpose for sharing confidential information',
      required: true,
      placeholder: 'e.g., For the purpose of evaluating potential business opportunities...',
      aiAssisted: true
    } as TextareaDocumentField,
    {
      id: 'confidential_info_types',
      key: 'confidential_info_types',
      label: 'Types of Confidential Information',
      type: 'select',
      description: 'Specify the types of confidential information covered',
      required: true,
      options: [
        'Source code, algorithms, customer data, business processes',
        'Product specifications, designs, and technical documentation',
        'Financial data, business strategies, and trade secrets',
        'Marketing plans, customer lists, and pricing information'
      ],
      aiAssisted: true
    } as SelectDocumentField,
    {
      id: 'industry_type',
      key: 'industry_type',
      label: 'Industry Type',
      type: 'select',
      description: 'Select the primary industry sector',
      required: true,
      options: [
        'Software and Technology',
        'Financial Services',
        'Healthcare and Biotechnology',
        'Manufacturing and Engineering',
        'Professional Services'
      ]
    } as SelectDocumentField,
    {
      id: 'protection_requirements',
      key: 'protection_requirements',
      label: 'Protection Requirements',
      type: 'select',
      description: 'Specify security and protection measures',
      required: true,
      options: [
        'Encryption, secure storage, and access logging',
        'Physical and digital security measures',
        'Access restrictions and confidentiality agreements',
        'Data masking and secure transmission protocols'
      ],
      aiAssisted: true
    } as SelectDocumentField,
    {
      id: 'permitted_uses',
      key: 'permitted_uses',
      label: 'Permitted Uses',
      type: 'select',
      description: 'Define allowed uses of confidential information',
      required: true,
      options: [
        'Evaluation and development of joint project',
        'Assessment of potential business opportunity',
        'Research and development collaboration',
        'Due diligence and business analysis'
      ],
      aiAssisted: true
    } as SelectDocumentField,
    {
      id: 'duration',
      key: 'duration',
      label: 'Duration',
      type: 'select',
      description: 'How long will this agreement be in effect?',
      required: true,
      options: [
        'one (1) year',
        'two (2) years',
        'three (3) years',
        'five (5) years',
        'indefinite'
      ]
    } as SelectDocumentField,
    governingLawField,
    {
      id: 'effective_date',
      key: 'effective_date',
      label: 'Effective Date',
      type: 'date',
      description: 'When does this agreement take effect?',
      required: true
    } as DateDocumentField
  ],
  service: [
    {
      id: 'service_description',
      key: 'service_description',
      label: 'Service Description',
      type: 'textarea',
      description: 'Detailed description of services to be provided',
      required: true,
      placeholder: 'e.g., Development of custom software application...',
      aiAssisted: true
    } as TextareaDocumentField,
    {
      id: 'service_description',
      key: 'service_description',
      label: 'Scope of Services',
      type: 'select',
      description: 'Define the scope of services covered',
      required: true,
      options: [
        'Full service implementation and support',
        'Project-based deliverables',
        'Ongoing maintenance and support',
        'Consultation and advisory services'
      ]
    } as SelectDocumentField,
    {
      id: 'payment_terms',
      key: 'payment_terms',
      label: 'Payment Terms',
      type: 'select',
      description: 'Specify payment schedule and terms',
      required: true,
      options: [
        'Monthly retainer',
        'Milestone-based payments',
        'Hourly rate billing',
        'Fixed project fee'
      ]
    } as SelectDocumentField,
    {
      id: 'delivery_timeline',
      key: 'delivery_timeline',
      label: 'Delivery Timeline',
      type: 'select',
      description: 'Expected timeline for service delivery',
      required: true,
      options: [
        'One-time delivery',
        'Ongoing service',
        'Phased delivery',
        'Monthly deliverables'
      ]
    } as SelectDocumentField,
    {
      id: 'termination_notice',
      key: 'termination_notice',
      label: 'Termination Notice',
      type: 'select',
      description: 'Required notice period for termination',
      required: true,
      options: [
        '30 days notice',
        '60 days notice',
        '90 days notice',
        'Immediate upon breach'
      ]
    } as SelectDocumentField,
    {
      id: 'service_level',
      key: 'service_level',
      label: 'Service Level',
      type: 'select',
      description: 'Define service level expectations',
      required: true,
      options: [
        'Standard service level',
        'Premium support',
        'Enterprise level',
        'Basic support'
      ]
    } as SelectDocumentField,
    governingLawField,
    {
      id: 'effective_date',
      key: 'effective_date',
      label: 'Effective Date',
      type: 'date',
      description: 'When does this agreement take effect?',
      required: true
    } as DateDocumentField,
    {
      id: 'service_category',
      key: 'service_category',
      label: 'Service Category',
      type: 'select',
      description: 'Category of service being provided',
      required: true,
      options: [
        'consulting',
        'development',
        'maintenance',
        'support',
        'training',
        'managed services'
      ]
    } as SelectDocumentField,
    {
      id: 'term_duration',
      key: 'term_duration',
      label: 'Term Duration',
      type: 'select',
      description: 'Duration of the agreement',
      required: true,
      options: [
        'one (1) year',
        'two (2) years',
        'three (3) years',
        'five (5) years'
      ]
    } as SelectDocumentField,
  ],
  employment_agreement: [
    {
      id: 'employee_name',
      key: 'employee_name',
      label: 'Employee Name',
      type: 'text',
      description: 'Full legal name of the employee',
      required: true,
      placeholder: 'e.g., John Doe'
    },
    {
      id: 'position_title',
      key: 'position_title',
      label: 'Position Title',
      type: 'text',
      description: 'Job title for the position',
      required: true,
      placeholder: 'e.g., Software Engineer'
    },
    {
      id: 'base_salary',
      key: 'base_salary',
      label: 'Base Salary',
      type: 'text',
      description: 'Annual base salary',
      required: true,
      placeholder: 'e.g., $75,000'
    },
    {
      id: 'work_location',
      key: 'work_location',
      label: 'Work Location',
      type: 'text',
      description: 'Primary work location',
      required: true,
      placeholder: 'e.g., New York Office'
    },
    {
      id: 'working_hours',
      key: 'working_hours',
      label: 'Working Hours',
      type: 'text',
      description: 'Standard working hours',
      required: true,
      placeholder: 'e.g., 40 hours per week, 9 AM to 5 PM'
    },
    {
      id: 'vacation_days',
      key: 'vacation_days',
      label: 'Vacation Days',
      type: 'text',
      description: 'Annual vacation days',
      required: true,
      placeholder: 'e.g., 15 days per year'
    },
    {
      id: 'employment_type',
      key: 'employment_type',
      label: 'Employment Type',
      type: 'select',
      description: 'Type of employment',
      required: true,
      options: [
        'Full-time',
        'Part-time',
        'Contract',
        'Temporary'
      ]
    },
    {
      id: 'notice_period',
      key: 'notice_period',
      label: 'Notice Period',
      type: 'select',
      description: 'Required notice period for termination',
      required: true,
      options: [
        'Two weeks',
        'One month',
        'Three months',
        'Immediate'
      ]
    },
    {
      id: 'governing_law',
      key: 'governing_law',
      label: 'Governing Law',
      type: 'jurisdiction',
      description: 'Which jurisdiction\'s laws will govern this agreement?',
      required: true,
      allowCustomInput: true
    }
  ]
};

export const PREDEFINED_VALUES = {
  nda: {
    purpose: 'For the purpose of evaluating potential business opportunities and discussing possible collaboration.',
    confidential_info_types: 'Source code, algorithms, customer data, business processes',
    industry_type: 'Software and Technology',
    protection_requirements: 'Encryption, secure storage, and access logging',
    permitted_uses: 'Evaluation and development of joint project',
    duration: 'one (1) year',
    governing_law: 'us_delaware',
    effective_date: new Date().toISOString()
  },
  service: {
    service_description: 'Development and implementation of custom software solutions',
    service_description: 'Full service implementation and support',
    service_category: 'development',
    payment_terms: 'Monthly retainer',
    delivery_timeline: 'Phased delivery',
    termination_notice: '30 days notice',
    service_level: 'Standard service level',
    term_duration: 'one (1) year',
    governing_law: 'us_delaware',
    effective_date: new Date().toISOString()
  },
  employment_agreement: {
    position_title: 'Software Engineer',
    employment_type: 'Full-time',
    start_date: new Date().toISOString(),
    compensation: '$75,000 per year',
    benefits: 'Health insurance, 401(k), PTO...',
    termination_notice: 'Two weeks',
    governing_law: 'us_delaware'
  }
} as const;

export enum DocumentType {
  NDA = 'NDA',
  SERVICE_AGREEMENT = 'SERVICE',
  EMPLOYMENT_AGREEMENT = 'EMPLOYMENT_AGREEMENT',
  SOFTWARE_LICENSE = 'SOFTWARE_LICENSE'
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

export interface PublishDraftRequest {
  new_document_id: string;
  content: string;
  status: string;
  document_metadata: {
    published_at: string;
    published_by: string;
    original_document_id: string;
  }
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
  document_type: string;
  parties: any[];
  variables: Partial<DocumentVariables>;
  effective_date?: string;
  settings: {
    cover_page: {
      enabled: boolean;
      watermark: string;
      logo_enabled: boolean;
    };
    header_footer: {
      enabled: boolean;
      header_text: string;
      footer_text: string;
    };
    styling: {
      font_family: string;
      primary_color: string;
      secondary_color: string;
    };
  };
}

export const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  cover_page: {
    enabled: true,
    title: undefined,
    subtitle: undefined
  },
  watermark: {
    enabled: true,
    text: "CONFIDENTIAL",
    opacity: 0.1,
    color: "rgba(128, 128, 128, 0.05)",
    angle: -45
  }
};

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
  zip_code: string;
  country: string;
}

export interface DocumentSettings {
  cover_page: CoverPageSettings;
  watermark: WatermarkSettings;
}

export interface CoverPageSettings {
  enabled: boolean;
  title?: string;
  subtitle?: string;
}

export interface WatermarkSettings {
  enabled: boolean;
  text: string;
  opacity?: number;
  color?: string;
  angle?: number;
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

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