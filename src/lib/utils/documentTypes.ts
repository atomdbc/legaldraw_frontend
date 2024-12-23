// src/lib/utils/documentTypes.ts
export const DOCUMENT_TYPES = ['nda', 'service', 'employment'] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

// Make sure this function is properly exported
export function isValidDocumentType(type: unknown): type is DocumentType {
  return typeof type === 'string' && DOCUMENT_TYPES.includes(type as DocumentType);
}