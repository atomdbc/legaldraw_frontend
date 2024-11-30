// src/lib/validations/template.ts
import { z } from 'zod';
import { TemplateCategory, DocumentType } from '@/types/template';

const templateFieldValidation = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['text', 'number', 'date', 'select', 'boolean', 'rich-text']),
  required: z.boolean(),
  defaultValue: z.any().optional(),
  placeholder: z.string().optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    options: z.array(z.object({
      label: z.string(),
      value: z.string()
    })).optional()
  }).optional(),
  description: z.string().optional()
});

const templateSectionValidation = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title is required'),
  order: z.number().min(0),
  content: z.string(),
  fields: z.array(templateFieldValidation),
  isRequired: z.boolean()
});

export const createTemplateValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.nativeEnum(TemplateCategory),
  documentType: z.nativeEnum(DocumentType),
  jurisdictions: z.array(z.string()).min(1, 'At least one jurisdiction is required'),
  supportedLanguages: z.array(z.string()).min(1, 'At least one language is required'),
  sections: z.array(templateSectionValidation).min(1, 'At least one section is required'),
  variables: z.array(z.object({
    name: z.string().min(1, 'Variable name is required'),
    type: z.string().min(1, 'Variable type is required'),
    description: z.string(),
    defaultValue: z.any().optional()
  })),
  settings: z.object({
    requireSignature: z.boolean(),
    allowCustomization: z.boolean(),
    allowSharing: z.boolean(),
    allowExport: z.boolean(),
    validityDuration: z.number().optional()
  })
});