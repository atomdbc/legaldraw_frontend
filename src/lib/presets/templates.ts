// src/lib/presets/templates.ts

import {
  FileText,
  Handshake,
  Shield,
  Building,
  UserPlus,
  Scale,
  Home,
  Briefcase,
  Factory,
  Users,
  ShoppingBag,
  Truck,
  FileSignature,
  Building2,
  User,
  UserCheck,
} from 'lucide-react';

export const documentRoles = {
  // Service Agreement Roles
  service_agreement: [
    {
      value: 'service_provider',
      label: 'Service Provider',
      icon: Briefcase,
      description: 'The party providing the services',
      suggestType: 'either',
      requiredFields: ['companyName', 'email', 'phone']
    },
    {
      value: 'client',
      label: 'Client',
      icon: Building2,
      description: 'The party receiving the services',
      suggestType: 'either',
      requiredFields: ['name', 'email', 'phone']
    }
  ],

  // NDA Roles
  nda: [
    {
      value: 'disclosing_party',
      label: 'Disclosing Party',
      icon: Shield,
      description: 'The party sharing confidential information',
      suggestType: 'either',
      requiredFields: ['name', 'email', 'address']
    },
    {
      value: 'receiving_party',
      label: 'Receiving Party',
      icon: User,
      description: 'The party receiving confidential information',
      suggestType: 'either',
      requiredFields: ['name', 'email', 'address']
    }
  ],

  // Employment Roles
  employment: [
    {
      value: 'employer',
      label: 'Employer',
      icon: Building2,
      description: 'The company or organization hiring',
      suggestType: 'company',
      requiredFields: ['companyName', 'address', 'email']
    },
    {
      value: 'employee',
      label: 'Employee',
      icon: User,
      description: 'The person being hired',
      suggestType: 'individual',
      requiredFields: ['name', 'email', 'phone', 'address']
    }
  ]
};

export const documentTypes = [
  {
    id: 'service_agreement',
    name: 'Service Agreement',
    icon: Handshake,
    description: 'Create a professional service agreement',
    examples: ['Consulting Services', 'Development Work', 'Design Services'],
    colorClass: 'bg-blue-100 text-blue-700',
    defaultParties: [
      { role: 'service_provider', name: '', entityType: 'company' },
      { role: 'client', name: '', entityType: 'company' }
    ],
    suggestedPrompt: 'Create a service agreement for professional consulting services including scope of work, payment terms, and deliverables.',
    partyRoles: documentRoles.service_agreement,
    requiredRoles: ['service_provider', 'client'],
    additionalFields: [
      {
        name: 'service_description',
        label: 'Service Description',
        type: 'textarea',
        description: 'Detailed description of services to be provided',
        placeholder: 'Describe the services in detail...',
        required: true
      },
      {
        name: 'payment_terms',
        label: 'Payment Terms',
        type: 'text',
        description: 'Specify payment schedule and terms',
        placeholder: 'e.g., Monthly payments of $X',
        required: true
      }
    ]
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    icon: Shield,
    description: 'Protect confidential information',
    examples: ['Business Secrets', 'Project Details', 'Client Data'],
    colorClass: 'bg-purple-100 text-purple-700',
    defaultParties: [
      { role: 'disclosing_party', name: '', entityType: 'company' },
      { role: 'receiving_party', name: '', entityType: 'company' }
    ],
    suggestedPrompt: 'Generate a mutual NDA to protect confidential information exchanged during business discussions.',
    partyRoles: documentRoles.nda,
    requiredRoles: ['disclosing_party', 'receiving_party'],
    additionalFields: [
      {
        name: 'confidential_info',
        label: 'Confidential Information',
        type: 'textarea',
        description: 'Define what constitutes confidential information',
        placeholder: 'Describe the confidential information...',
        required: true
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'select',
        description: 'How long should the NDA remain in effect',
        options: [
          { label: '1 Year', value: '1_year' },
          { label: '2 Years', value: '2_years' },
          { label: '5 Years', value: '5_years' },
          { label: 'Indefinite', value: 'indefinite' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'employment',
    name: 'Employment Contract',
    icon: UserPlus,
    description: 'Hire new employees with clear terms',
    examples: ['Full-time Employment', 'Part-time Work', 'Contractor Agreement'],
    colorClass: 'bg-green-100 text-green-700',
    defaultParties: [
      { role: 'employer', name: '', entityType: 'company' },
      { role: 'employee', name: '', entityType: 'individual' }
    ],
    suggestedPrompt: 'Draft an employment agreement including role responsibilities, compensation, and benefits.',
    partyRoles: documentRoles.employment,
    requiredRoles: ['employer', 'employee'],
    additionalFields: [
      {
        name: 'position',
        label: 'Position Title',
        type: 'text',
        description: 'Job title and role',
        placeholder: 'e.g., Senior Software Engineer',
        required: true
      },
      {
        name: 'compensation',
        label: 'Compensation',
        type: 'text',
        description: 'Salary and benefits package',
        placeholder: 'e.g., $100,000 per year',
        required: true
      },
      {
        name: 'start_date',
        label: 'Start Date',
        type: 'date',
        description: 'Employment start date',
        required: true
      },
      {
        name: 'work_location',
        label: 'Work Location',
        type: 'text',
        description: 'Primary work location',
        placeholder: 'e.g., San Francisco, CA',
        required: true
      }
    ]
  }
];

export const documentStyles = {
  modern: {
    name: 'Modern',
    description: 'Clean and contemporary design',
    preview: 'modern-preview.png',
    colors: {
      primary: '#2563eb',
      secondary: '#4b5563',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1f2937',
      muted: '#9ca3af',
      border: '#e5e7eb'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: '16px',
      lineHeight: '1.6',
      headingSizes: {
        h1: '2.25rem',
        h2: '1.875rem',
        h3: '1.5rem',
        h4: '1.25rem'
      }
    },
    spacing: {
      margins: '2rem',
      padding: '1.5rem',
      sectionGap: '2rem',
      paragraphGap: '1rem'
    }
  },
  classic: {
    name: 'Classic',
    description: 'Traditional and professional',
    preview: 'classic-preview.png',
    colors: {
      primary: '#1e293b',
      secondary: '#475569',
      accent: '#0f172a',
      background: '#ffffff',
      text: '#334155',
      muted: '#64748b',
      border: '#cbd5e1'
    },
    typography: {
      headingFont: 'Libre Baskerville',
      bodyFont: 'Inter',
      fontSize: '16px',
      lineHeight: '1.8',
      headingSizes: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem'
      }
    },
    spacing: {
      margins: '2.5rem',
      padding: '2rem',
      sectionGap: '2.5rem',
      paragraphGap: '1.25rem'
    }
  }
};

export const jurisdictions = [
  {
    value: 'california',
    label: 'California, USA',
    requirements: ['governing_law', 'dispute_resolution'],
    description: 'Follows California state law',
    specialClauses: [
      'arbitration_clause',
      'confidentiality_requirements',
      'non_compete_limitations'
    ]
  },
  {
    value: 'new_york',
    label: 'New York, USA',
    requirements: ['governing_law', 'venue'],
    description: 'Subject to New York state law',
    specialClauses: [
      'choice_of_law',
      'forum_selection',
      'severability'
    ]
  },
  {
    value: 'delaware',
    label: 'Delaware, USA',
    requirements: ['governing_law'],
    description: 'Under Delaware state law',
    specialClauses: [
      'incorporation_clause',
      'business_registration',
      'tax_considerations'
    ]
  },
  {
    value: 'texas',
    label: 'Texas, USA',
    requirements: ['governing_law', 'venue', 'dispute_resolution'],
    description: 'Governed by Texas state law',
    specialClauses: [
      'venue_selection',
      'mediation_requirement',
      'attorney_fees'
    ]
  }
];

export const documentRequirements = {
  governing_law: {
    name: 'Governing Law',
    description: 'Specifies which jurisdiction\'s laws govern the agreement',
    required: true
  },
  venue: {
    name: 'Venue',
    description: 'Specifies where legal proceedings must take place',
    required: false
  },
  dispute_resolution: {
    name: 'Dispute Resolution',
    description: 'Defines how disputes will be handled',
    required: false
  },
  arbitration_clause: {
    name: 'Arbitration',
    description: 'Requires disputes to be resolved through arbitration',
    required: false
  }
};