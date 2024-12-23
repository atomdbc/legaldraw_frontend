'use client';

import { useCallback } from 'react';

type WizardStep = 'type' | 'parties' | 'details' | 'preview';

const STEP_ROUTES: Record<WizardStep, (documentType: string) => string> = {
  type: (documentType) => `/documents/create/${documentType}/parties`,
  parties: (documentType) => `/documents/create/${documentType}/details`,
  details: (documentType) => `/documents/create/${documentType}/preview`,
  preview: (documentType) => `/documents/create/${documentType}/preview`,
};

const BACK_ROUTES: Record<WizardStep, (documentType: string) => string> = {
  type: () => '/documents',
  parties: (documentType) => `/documents/create/${documentType}`,
  details: (documentType) => `/documents/create/${documentType}/parties`,
  preview: (documentType) => `/documents/create/${documentType}/details`,
};

export function useWizardNavigation(documentType: string) {
  const getNextRoute = useCallback(async (currentStep: WizardStep): Promise<string | null> => {
    try {
      const routeFunction = STEP_ROUTES[currentStep];
      return routeFunction(documentType);
    } catch (error) {
      console.error('Error getting next route:', error);
      return null;
    }
  }, [documentType]);

  const navigateNext = useCallback(async (currentStep: WizardStep): Promise<string | null> => {
    try {
      return await getNextRoute(currentStep);
    } catch (error) {
      console.error('Navigation error:', error);
      return null;
    }
  }, [getNextRoute]);

  const navigateBack = useCallback((currentStep: WizardStep): string => {
    const routeFunction = BACK_ROUTES[currentStep];
    return routeFunction(documentType);
  }, [documentType]);

  return {
    navigateNext,
    navigateBack,
    getNextRoute
  };
}