// src/lib/api/auth.ts
import axios from 'axios';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const authApi = {
  async login(data: LoginDto) {
    const response = await axios.post<AuthResponse>(`${API_URL}/users/login`, data, {
      withCredentials: true // Important for receiving cookies
    });
    return response.data;
  },

  async register(data: RegisterDto) {
    const response = await axios.post<AuthResponse>(`${API_URL}/users/register`, data, {
      withCredentials: true
    });
    return response.data;
  },

  async logout() {
    const response = await axios.post(`${API_URL}/users/logout`, {}, {
      withCredentials: true
    });
    return response.data;
  },

  async refreshToken() {
    const response = await axios.post<AuthResponse>(`${API_URL}/users/refresh-token`, {}, {
      withCredentials: true
    });
    return response.data;
  }
};