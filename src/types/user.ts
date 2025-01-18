// src/types/user.ts
export interface User {
    id: string;
    email: string;
    full_name: string;
    company?: string;
    phone_number?: string;
    is_active: boolean;
    is_verified: boolean;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface UserUpdateRequest {
    full_name?: string;
    company?: string;
    phone_number?: string;
    timezone?: string;
    language?: string;
  }