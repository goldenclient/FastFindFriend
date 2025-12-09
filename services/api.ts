
import { User } from '../types';

const BASE_URL = 'https://localhost:7203/api';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export const api = {
  getToken: () => localStorage.getItem('auth_token'),
  setToken: (token: string) => localStorage.setItem('auth_token', token),
  removeToken: () => localStorage.removeItem('auth_token'),

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = api.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
          api.removeToken();
          // Optional: Redirect to login
          // window.location.href = '/#/login';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
         return await response.json();
      } else {
         return {} as T;
      }
      
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  get<T>(endpoint: string) {
    return api.request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, body: any) {
    return api.request<T>(endpoint, { method: 'POST', body });
  },

  put<T>(endpoint: string, body: any) {
    return api.request<T>(endpoint, { method: 'PUT', body });
  },

  delete<T>(endpoint: string) {
    return api.request<T>(endpoint, { method: 'DELETE' });
  }
};
