import { useAuthStore } from '../stores/auth.store';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api/v1` : 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  code: string;
  fieldErrors?: Record<string, string[]>;
  status: number;

  constructor(message: string, code: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    throw new ApiError(
      'Unable to connect to the server. Please check your network connection.',
      'NETWORK_ERROR',
      0
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (data && data.success === false && data.error && data.error.message) {
      throw new ApiError(data.error.message, data.error.code, response.status, data.error.fieldErrors);
    }
    throw new ApiError('Something went wrong. Please try again.', 'UNKNOWN_ERROR', response.status);
  }

  return data?.data;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body?: any, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: (endpoint: string, body?: any, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
