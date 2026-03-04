/**
 * API client for the Vital Registration backend (NestJS).
 * Set VITE_API_URL in .env or use default http://localhost:3000
 */
import type {
  BirthRecord,
  DeathRecord,
  MarriageRecord,
  DivorceRecord,
  RecordStatus,
} from './types';

const getBaseUrl = () => import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type RequestOptions = {
  method?: string;
  body?: any;
} & Omit<RequestInit, 'body' | 'method'>;

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const { method = 'GET', body, ...rest } = options ?? {};
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...rest.headers,
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
    ...rest,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return res.json();
}

// Births
export const birthsApi = {
  getAll: (status?: string) =>
    request<BirthRecord[]>(status ? `/births?status=${encodeURIComponent(status)}` : '/births').catch(
      () => [],
    ),
  getOne: (id: string) => request<BirthRecord>(`/births/${id}`),
  create: (data: Omit<BirthRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<BirthRecord>('/births', { method: 'POST', body: data }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<BirthRecord>(`/births/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Deaths
export const deathsApi = {
  getAll: (status?: string) =>
    request<DeathRecord[]>(
      status ? `/deaths?status=${encodeURIComponent(status)}` : '/deaths',
    ).catch(() => []),
  getOne: (id: string) => request<DeathRecord>(`/deaths/${id}`),
  create: (data: Omit<DeathRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<DeathRecord>('/deaths', { method: 'POST', body: data }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<DeathRecord>(`/deaths/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Marriages
export const marriagesApi = {
  getAll: (status?: string) =>
    request<MarriageRecord[]>(
      status ? `/marriages?status=${encodeURIComponent(status)}` : '/marriages',
    ).catch(() => []),
  getOne: (id: string) => request<MarriageRecord>(`/marriages/${id}`),
  create: (data: Omit<MarriageRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<MarriageRecord>('/marriages', { method: 'POST', body: data }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<MarriageRecord>(`/marriages/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Divorces
export const divorcesApi = {
  getAll: (status?: string) =>
    request<DivorceRecord[]>(
      status ? `/divorces?status=${encodeURIComponent(status)}` : '/divorces',
    ).catch(() => []),
  getOne: (id: string) => request<DivorceRecord>(`/divorces/${id}`),
  create: (data: Omit<DivorceRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<DivorceRecord>('/divorces', { method: 'POST', body: data }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<DivorceRecord>(`/divorces/${id}/status`, { method: 'PATCH', body: { status } }),
};
