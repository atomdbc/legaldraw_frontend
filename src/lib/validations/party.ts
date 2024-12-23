// src/lib/validations/party.ts

import { isValidEmail, isValidPhone, isValidZipCode } from '../utils/form';
import type { Party } from '@/types/document';

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationErrors = Record<string, ValidationError>;

// Validate a single party
export function validateParty(party: Party): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  if (!party.name) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!party.type) {
    errors.push({ field: 'type', message: 'Party type is required' });
  }

  // Email validation
  if (party.email && !isValidEmail(party.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  // Phone validation (optional)
  if (party.phone && !isValidPhone(party.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  // Address validation
  if (!party.address.street) {
    errors.push({ field: 'street', message: 'Street address is required' });
  }

  if (!party.address.city) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!party.address.state) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  if (!party.address.zipCode) {
    errors.push({ field: 'zipCode', message: 'ZIP code is required' });
  } else if (!isValidZipCode(party.address.zipCode, party.address.country)) {
    errors.push({ field: 'zipCode', message: 'Invalid ZIP code format' });
  }

  // Jurisdiction validation for organizations
  if (party.type !== 'individual' && !party.jurisdiction) {
    errors.push({ field: 'jurisdiction', message: 'Jurisdiction is required for organizations' });
  }

  return errors;
}

// Validate multiple parties and return errors by party ID
export function validateParties(parties: Party[]): ValidationErrors {
  const errors: ValidationErrors = {};

  // Check minimum number of parties
  if (parties.length < 2) {
    errors['general'] = {
      field: 'general',
      message: 'At least two parties are required'
    };
  }

  // Validate each party
  parties.forEach((party, index) => {
    const partyErrors = validateParty(party);
    
    // If party has errors, add them to the error object with prefixed field names
    if (partyErrors.length > 0) {
      partyErrors.forEach(error => {
        const errorKey = `${party.id}.${error.field}`;
        errors[errorKey] = {
          field: error.field,
          message: `Party ${index + 1}: ${error.message}`
        };
      });
    }
  });

  return errors;
}

// Helper function to check if parties are valid
export function arePartiesValid(parties: Party[]): boolean {
  const errors = validateParties(parties);
  return Object.keys(errors).length === 0;
}