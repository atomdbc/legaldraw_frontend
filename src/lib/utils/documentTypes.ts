// src/lib/utils/documentTypes.ts

// Base document types
export const DOCUMENT_TYPES = ['nda', 'service', 'employment'] as const;
export type DocumentTypeId = (typeof DOCUMENT_TYPES)[number];

// Include quick variants
export const QUICK_DOCUMENT_TYPES = ['QUICK_NDA', 'QUICK_SERVICE', 'QUICK_EMPLOYMENT'] as const;
export type QuickDocumentTypeId = (typeof QUICK_DOCUMENT_TYPES)[number];

// Combined type for all possible document types
export type AllDocumentTypes = DocumentTypeId | QuickDocumentTypeId;

// Mapping to match backend enum values exactly
export const BACKEND_DOCUMENT_TYPES = {
  // Standard types
  'nda': 'NDA',
  'service': 'SERVICE_AGREEMENT',
  'employment': 'EMPLOYMENT_AGREEMENT',
  // Quick types
  'QUICK_NDA': 'QUICK_NDA',
  'QUICK_SERVICE': 'QUICK_SERVICE_AGREEMENT',
  'QUICK_EMPLOYMENT': 'QUICK_EMPLOYMENT_AGREEMENT'
} as const;

// Type guard for standard document types
export function isValidDocumentType(type: unknown): type is DocumentTypeId {
  return typeof type === 'string' && DOCUMENT_TYPES.includes(type as DocumentTypeId);
}

// Type guard for quick document types
export function isValidQuickDocumentType(type: unknown): type is QuickDocumentTypeId {
  return typeof type === 'string' && QUICK_DOCUMENT_TYPES.includes(type as QuickDocumentTypeId);
}

// Get backend type for any document type
export function getBackendDocumentType(frontendType: AllDocumentTypes): string {
  return BACKEND_DOCUMENT_TYPES[frontendType] || frontendType;
}

// Convert standard type to quick type
export function getQuickDocumentType(standardType: DocumentTypeId): QuickDocumentTypeId {
  const quickTypeMap: Record<DocumentTypeId, QuickDocumentTypeId> = {
    'nda': 'QUICK_NDA',
    'service': 'QUICK_SERVICE',
    'employment': 'QUICK_EMPLOYMENT'
  };
  return quickTypeMap[standardType];
}

// Display names for UI
export function getDisplayName(type: AllDocumentTypes): string {
  const displayNames: Record<AllDocumentTypes, string> = {
    // Standard types
    'nda': 'NDA',
    'service': 'Service Agreement',
    'employment': 'Employment Agreement',
    // Quick types
    'QUICK_NDA': 'Quick NDA',
    'QUICK_SERVICE': 'Quick Service Agreement',
    'QUICK_EMPLOYMENT': 'Quick Employment Agreement'
  };
  return displayNames[type] || type;
}

// Get document category
export function getDocumentCategory(type: AllDocumentTypes): string {
  const categories: Record<AllDocumentTypes, string> = {
    'nda': 'Essential',
    'service': 'Essential',
    'employment': 'Essential',
    'QUICK_NDA': 'Essential',
    'QUICK_SERVICE': 'Essential',
    'QUICK_EMPLOYMENT': 'Essential'
  };
  return categories[type] || 'Other';
}