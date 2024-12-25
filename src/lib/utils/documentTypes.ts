// src/lib/utils/documentTypes.ts

// Document types must match backend exactly
export const DOCUMENT_TYPES = ['nda', 'service', 'employment'] as const;
export type DocumentTypeId = (typeof DOCUMENT_TYPES)[number];

// Mapping to match backend enum values exactly
export const BACKEND_DOCUMENT_TYPES = {
  'nda': 'NDA',
  'service': 'SERVICE_AGREEMENT',
  'employment': 'EMPLOYMENT_AGREEMENT'
} as const;

export function isValidDocumentType(type: unknown): type is DocumentTypeId {
  return typeof type === 'string' && DOCUMENT_TYPES.includes(type as DocumentTypeId);
}

export function getBackendDocumentType(frontendType: DocumentTypeId): string {
  return BACKEND_DOCUMENT_TYPES[frontendType];
}

// This is a utility function to display document types in UI
export function getDisplayName(type: DocumentTypeId): string {
  const displayNames = {
    'nda': 'NDA',
    'service': 'Service Agreement',
    'employment': 'Employment Agreement'
  };
  return displayNames[type] || type;
}