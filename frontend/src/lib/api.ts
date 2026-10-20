import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AUTH_TOKEN_KEY = 'nap:token';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token && config.url?.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (token && (config.url?.includes('/auth/me'))) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (err: AxiosError) => {
    const status = err.response?.status;
    if (status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  },
);

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export function extractApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { detail?: ApiError } | ApiError | undefined;
    if (data && typeof data === 'object') {
      if ('detail' in data && data.detail && typeof data.detail === 'object') {
        return data.detail as ApiError;
      }
      if ('code' in data) {
        return data as ApiError;
      }
    }
    return { code: 'network', message: err.message || 'Erro de rede' };
  }
  return { code: 'unknown', message: 'Erro inesperado' };
}
