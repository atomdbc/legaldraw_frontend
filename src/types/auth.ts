// src/types/auth.ts
export interface LoginDto {
    email: string;
    password: string;
  }
  
  export interface RegisterDto {
    email: string;
    password: string;
    fullName: string;
    organization: string;
  }
  
  export interface AuthResponse {
    status: string;
    data: {
      token: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        fullName: string;
        organization: string;
      }
    }
  }