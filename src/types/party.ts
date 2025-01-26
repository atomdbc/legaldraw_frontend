import { Building2, User, Shield, Users, FileCheck } from "lucide-react";

// Backend-aligned address interface
export interface AddressBackend {
  street: string;
  city: string;
  state: string;
  zip_code: string;  // Changed to match backend
  country: string;
}

// Frontend-friendly address interface
export interface AddressFrontend {
  street: string;
  city: string;
  state: string;
  zipCode: string;  // Kept for frontend components
  country: string;
}

// Backend-aligned party interface
export interface PartyBackend {
  name: string;
  type: string;
  email?: string | null;
  phone?: string | null;
  jurisdiction?: string | null;
  address: AddressBackend;
}

// Frontend party interface with additional UI-specific fields
export interface Party {
  id: string;            // Frontend-only field
  type: PartyType;
  name: string;
  email: string;
  phone?: string;
  jurisdiction: string;
  address: AddressFrontend;
}

export type PartyType =
  | 'corporation'
  | 'individual'
  | 'llc'
  | 'partnership'
  | 'trust';

export const PARTY_TYPES = [
  {
    id: 'corporation',
    label: 'Corporation',
    icon: Building2,
    description: 'A registered company or corporation'
  },
  {
    id: 'individual',
    label: 'Individual',
    icon: User,
    description: 'A single person'
  },
  {
    id: 'llc',
    label: 'Limited Liability Company',
    icon: Shield,
    description: 'A limited liability company'
  },
  {
    id: 'partnership',
    label: 'Partnership',
    icon: Users,
    description: 'A business partnership'
  },
  {
    id: 'trust',
    label: 'Trust',
    icon: FileCheck,
    description: 'A legal trust entity'
  },
] as const;

export const INITIAL_PARTY: Party = {
  id: crypto.randomUUID(),
  type: 'corporation',
  name: '',
  email: '',
  jurisdiction: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '', 
  },
};



// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  [key: string]: ValidationError;
}

// Extended type for the form props
export interface PartyFormData extends Partial<Party> {
  address?: Partial<AddressFrontend>;
}

// Utility functions to convert between frontend and backend formats
export const partyUtils = {
  updateParty(party: Party, updates: Partial<Party>): Party {
    return {
      ...party,
      ...updates,
      address: {
        ...party.address,
        ...(updates.address || {}),
      },
      jurisdiction: updates.jurisdiction || party.jurisdiction // Explicitly handle jurisdiction
    };
  },
  toBackendFormat(party: Party): PartyBackend {
    return {
      name: party.name,
      type: party.type.toLowerCase(),
      email: party.email || null,
      phone: party.phone || null,
      jurisdiction: party.jurisdiction || null,
      address: {
        street: party.address.street,
        city: party.address.city,
        state: party.address.state,
        zip_code: party.address.zipCode,  // Convert to snake_case
        country: party.address.country
      }
    };
  },

  toFrontendFormat(party: PartyBackend & { id?: string }): Party {
    return {
      id: party.id || crypto.randomUUID(),
      type: party.type as PartyType,
      name: party.name,
      email: party.email || '',
      phone: party.phone || undefined,
      jurisdiction: party.jurisdiction || '',
      address: {
        street: party.address.street,
        city: party.address.city,
        state: party.address.state,
        zipCode: party.address.zip_code,  // Convert to camelCase
        country: party.address.country
      }
    };
  },

  // Helper to create a new party with default values
  createNew(): Party {
    return {
      ...INITIAL_PARTY,
      id: crypto.randomUUID()
    };
  },

  // Helper to validate a party
  validate(party: Partial<Party>): ValidationErrors {
    const errors: ValidationErrors = {};
    
    if (!party.name) {
      errors.name = { field: 'name', message: 'Name is required' };
    }
    
    if (!party.type) {
      errors.type = { field: 'type', message: 'Party type is required' };
    }
    
    if (party.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(party.email)) {
      errors.email = { field: 'email', message: 'Invalid email address' };
    }
    
    if (party.type !== 'individual' && !party.jurisdiction) {
      errors.jurisdiction = { 
        field: 'jurisdiction', 
        message: 'Jurisdiction is required for organizations' 
      };
    }
    
    // Address validation
    if (party.address) {
      if (!party.address.street) {
        errors['address.street'] = { 
          field: 'address.street', 
          message: 'Street address is required' 
        };
      }
      
      if (!party.address.city) {
        errors['address.city'] = { 
          field: 'address.city', 
          message: 'City is required' 
        };
      }
      
      if (!party.address.state) {
        errors['address.state'] = { 
          field: 'address.state', 
          message: 'State is required' 
        };
      }
      
      if (!party.address.zipCode) {
        errors['address.zipCode'] = { 
          field: 'address.zipCode', 
          message: 'ZIP code is required' 
        };
      }
    }
    
    return errors;
  }
};