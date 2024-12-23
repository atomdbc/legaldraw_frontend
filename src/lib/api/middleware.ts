// src/lib/api/middleware.ts

import { authApi } from "./auth";

function getCookie(name: string) {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  }
  
  async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const accessToken = getCookie('accessToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    };
  
    let response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
  
    if (response.status === 401) {
      try {
        const refreshResult = await authApi.refreshToken();
        if (refreshResult.status === 'success') {
          const newToken = getCookie('accessToken');
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url, { 
            ...options, 
            headers, 
            credentials: 'include' 
          });
        }
      } catch (error) {
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/login';
      }
    }
  
    return response;
  }
  
  export { fetchWithAuth };