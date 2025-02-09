// src/lib/registry/templateRegistry.ts

import { QuickNDATemplate } from '../templates/quick/QuickNDATemplate';
import { QuickServiceTemplate } from '../templates/quick/QuickServiceTemplate';
import { QuickEmploymentTemplate } from '../templates/quick/QuickEmploymentTemplate';

export const QUICK_TEMPLATE_REGISTRY = {
  'QUICK_NDA': QuickNDATemplate,
  'QUICK_SERVICE': QuickServiceTemplate,
  'QUICK_EMPLOYMENT': QuickEmploymentTemplate
};

export const getQuickTemplate = (type: string) => {
  const templateClass = QUICK_TEMPLATE_REGISTRY[type];
  if (!templateClass) {
    throw new Error(`Invalid template type: ${type}`);
  }
  return templateClass;
};