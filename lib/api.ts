import { API_BASE_URL } from './constants';
import type { IRefugio, CreateRefugioData, UpdateRefugioData } from './types';

class ApiError extends Error {
  status: number;
  details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let details: string[] = [];
    try {
      const body = await res.json();
      if (body.details) details = body.details;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(
      `Error ${res.status}: ${res.statusText}`,
      res.status,
      details,
    );
  }

  if (res.status === 204) return undefined as T;

  const json = await res.json();

  // The API wraps list/single responses in { success, data [, count] }
  if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
    return json.data as T;
  }

  return json as T;
}

export function getAllRefugios(filters?: {
  estado?: string;
  tipo?: string;
  activo?: string;
}): Promise<IRefugio[]> {
  const params = new URLSearchParams();
  if (filters?.estado) params.set('estado', filters.estado);
  if (filters?.tipo) params.set('tipo', filters.tipo);
  if (filters?.activo) params.set('activo', filters.activo);

  const qs = params.toString();
  return request<IRefugio[]>(`/refugios${qs ? `?${qs}` : ''}`);
}

export function getRefugioById(id: string): Promise<IRefugio> {
  return request<IRefugio>(`/refugios/${encodeURIComponent(id)}`);
}

export function createRefugio(data: CreateRefugioData): Promise<IRefugio> {
  return request<IRefugio>('/refugios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateRefugio(
  id: string,
  data: UpdateRefugioData,
): Promise<IRefugio> {
  return request<IRefugio>(`/refugios/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function replaceRefugio(
  id: string,
  data: CreateRefugioData,
): Promise<IRefugio> {
  return request<IRefugio>(`/refugios/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
