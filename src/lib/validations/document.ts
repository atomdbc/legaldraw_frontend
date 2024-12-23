// src/lib/validations/document.ts
import * as z from 'zod';

export const documentFormSchema = z.object({
  template: z.string().min(1, 'Template is required'),
  prompt: z.string().min(10, 'Please provide a detailed description'),
  parties: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      role: z.string().min(1, 'Role is required'),
      address: z.string().min(1, 'Address is required'),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      companyName: z.string().optional(),
      signatoryTitle: z.string().optional(),
    })
  ).min(1, 'At least one party is required'),
  context: z.object({
    jurisdiction: z.string().optional(),
    governingLaw: z.string().optional(),
    industry: z.string().optional(),
    term: z.string().optional(),
    value: z.number().optional(),
    effectiveDate: z.string().optional(),
    specialRequirements: z.array(z.string()).optional(),
  }).optional(),
});

export type DocumentFormData = z.infer<typeof documentFormSchema>;