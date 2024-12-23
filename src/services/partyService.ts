// src/services/partyService.ts

import { 
    Building,
    User,
    Briefcase,
    UserCheck,
    Building2,
    Users,
    Handshake,
    Scale,
    FileText 
  } from 'lucide-react';
  
  export interface Party {
    id: string;
    role: string;
    name: string;
    companyName?: string;
    title?: string;
    email: string;
    phone: string;
    address: string;
    entityType: 'company' | 'individual';
  }
  
  export interface ValidationState {
    isValid: boolean[];
    errors: string[][];
  }
  
  export const roleConfig = {
    'employer': { icon: Building, suggestType: 'company' },
    'employee': { icon: User, suggestType: 'individual' },
    'contractor': { icon: Briefcase, suggestType: 'individual' },
    'client': { icon: UserCheck, suggestType: 'either' },
    'vendor': { icon: Building2, suggestType: 'company' },
    'lessor': { icon: Building, suggestType: 'company' },
    'lessee': { icon: Users, suggestType: 'either' },
    'partner': { icon: Handshake, suggestType: 'either' },
    'investor': { icon: Scale, suggestType: 'either' },
    'consultant': { icon: Briefcase, suggestType: 'either' },
    'default': { icon: FileText, suggestType: 'either' }
  } as const;
  
  export const validateParty = (party: Party, usedRoles: string[]): string[] => {
    const errors: string[] = [];
  
    if (!party.role) {
      errors.push("Role is required");
    } else if (usedRoles.filter(r => r === party.role).length > 1) {
      errors.push("This role is already assigned to another party");
    }
  
    if (!party.name) errors.push("Name is required");
    if (party.entityType === 'company' && !party.companyName) {
      errors.push("Company name is required");
    }
    if (!party.email) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(party.email)) {
      errors.push("Invalid email format");
    }
    if (!party.phone) {
      errors.push("Phone is required");
    } else if (!/^[\d\s-+()]{10,}$/.test(party.phone)) {
      errors.push("Invalid phone format");
    }
    if (!party.address) errors.push("Address is required");
  
    return errors;
  };
  
  export const generatePartyId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  export const createNewParty = (): Party => {
    return {
      id: generatePartyId(),
      role: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      entityType: 'company'
    };
  };
  
  export const detectPartyType = (text: string): 'company' | 'individual' => {
    const companyIndicators = ['Inc', 'LLC', 'Ltd', 'Corp', 'Limited', 'Company'];
    return companyIndicators.some(indicator => text.includes(indicator)) ? 'company' : 'individual';
  };
  
  export const parseClipboardText = (text: string): Partial<Party> => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const updates: Partial<Party> = {};
  
    if (lines.length >= 2) {
      const partyType = detectPartyType(lines[0]);
      updates.entityType = partyType;
  
      if (partyType === 'company') {
        updates.companyName = lines[0];
        updates.name = lines[1];
      } else {
        updates.name = lines[0];
      }
  
      const emailLine = lines.find(line => line.includes('@'));
      const phoneLine = lines.find(line => /[\d-+()]{10,}/.test(line));
      
      if (emailLine) updates.email = emailLine;
      if (phoneLine) updates.phone = phoneLine;
  
      const addressLines = lines.filter(line => 
        line !== emailLine && 
        line !== phoneLine && 
        line !== updates.companyName &&
        line !== updates.name
      );
  
      if (addressLines.length) {
        updates.address = addressLines.join(', ');
      }
    }
  
    return updates;
  };