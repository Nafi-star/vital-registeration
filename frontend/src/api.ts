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
  BirthCreatePayload,
  DeathCreatePayload,
  MarriageCreatePayload,
  DivorceCreatePayload,
  BirthUpdatePayload,
  DeathUpdatePayload,
  MarriageUpdatePayload,
  DivorceUpdatePayload,
  StatsOverview,
  PersonMaster,
  AuditLogEntry,
} from './types';

const getBaseUrl = () => import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const TOKEN_KEY = 'vital_admin_token';
let authTokenMemory: string | null = null;

/** Call once on app load (e.g. from AuthProvider) to restore Bearer token from sessionStorage. */
export function initApiAuth() {
  try {
    authTokenMemory = sessionStorage.getItem(TOKEN_KEY);
  } catch {
    authTokenMemory = null;
  }
}

export function setApiAuthToken(token: string | null) {
  authTokenMemory = token;
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function getApiAuthToken() {
  return authTokenMemory;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
} & Omit<RequestInit, 'body' | 'method'>;

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const { method = 'GET', body, auth, ...rest } = options ?? {};
  if (auth && !authTokenMemory) {
    throw new Error('ADMIN_SESSION_REQUIRED');
  }
  const url = `${getBaseUrl()}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((rest.headers as Record<string, string> | undefined) ?? {}),
  };
  if (auth && authTokenMemory) {
    headers.Authorization = `Bearer ${authTokenMemory}`;
  }
  const res = await fetch(url, {
    method,
    headers,
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

export type AuthLoginResponse = {
  access_token: string;
  username: string;
  role: 'admin';
};

export const authApi = {
  login: (username: string, password: string) =>
    request<AuthLoginResponse>('/auth/login', { method: 'POST', body: { username, password } }),
  me: () => request<{ username: string; role: string }>('/auth/me', { method: 'GET', auth: true }),
};

// Births
export const birthsApi = {
  getAll: (status?: string) =>
    request<BirthRecord[]>(status ? `/births?status=${encodeURIComponent(status)}` : '/births', {
      auth: true,
    }).catch(() => []),
  getOne: (id: string) => request<BirthRecord>(`/births/${id}`, { auth: true }),
  create: (data: BirthCreatePayload) =>
    request<BirthRecord>('/births', { method: 'POST', body: data, auth: true }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<BirthRecord>(`/births/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  update: (id: string, data: BirthUpdatePayload) =>
    request<BirthRecord>(`/births/${id}`, { method: 'PATCH', body: data, auth: true }),
};

// Deaths
export const deathsApi = {
  getAll: (status?: string) =>
    request<DeathRecord[]>(
      status ? `/deaths?status=${encodeURIComponent(status)}` : '/deaths',
      { auth: true },
    ).catch(() => []),
  getOne: (id: string) => request<DeathRecord>(`/deaths/${id}`, { auth: true }),
  create: (data: DeathCreatePayload) =>
    request<DeathRecord>('/deaths', { method: 'POST', body: data, auth: true }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<DeathRecord>(`/deaths/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  update: (id: string, data: DeathUpdatePayload) =>
    request<DeathRecord>(`/deaths/${id}`, { method: 'PATCH', body: data, auth: true }),
};

// Marriages
export const marriagesApi = {
  getAll: (status?: string) =>
    request<MarriageRecord[]>(
      status ? `/marriages?status=${encodeURIComponent(status)}` : '/marriages',
      { auth: true },
    ).catch(() => []),
  getOne: (id: string) => request<MarriageRecord>(`/marriages/${id}`, { auth: true }),
  create: (data: MarriageCreatePayload) =>
    request<MarriageRecord>('/marriages', { method: 'POST', body: data, auth: true }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<MarriageRecord>(`/marriages/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  update: (id: string, data: MarriageUpdatePayload) =>
    request<MarriageRecord>(`/marriages/${id}`, { method: 'PATCH', body: data, auth: true }),
};

// Divorces
export const divorcesApi = {
  getAll: (status?: string) =>
    request<DivorceRecord[]>(
      status ? `/divorces?status=${encodeURIComponent(status)}` : '/divorces',
      { auth: true },
    ).catch(() => []),
  getOne: (id: string) => request<DivorceRecord>(`/divorces/${id}`, { auth: true }),
  create: (data: DivorceCreatePayload) =>
    request<DivorceRecord>('/divorces', { method: 'POST', body: data, auth: true }),
  updateStatus: (id: string, status: RecordStatus) =>
    request<DivorceRecord>(`/divorces/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  update: (id: string, data: DivorceUpdatePayload) =>
    request<DivorceRecord>(`/divorces/${id}`, { method: 'PATCH', body: data, auth: true }),
};

export const auditLogsApi = {
  list: (limit = 100) =>
    request<AuditLogEntry[]>(`/audit-logs?limit=${encodeURIComponent(String(limit))}`, {
      auth: true,
    }).catch(() => [] as AuditLogEntry[]),
};

export const statsApi = {
  overview: () =>
    request<StatsOverview>('/stats/overview', { auth: true }).catch(() => null as StatsOverview | null),
};

export const personsApi = {
  search: (q: string) =>
    request<PersonMaster[]>(`/persons/search?q=${encodeURIComponent(q)}`, { auth: true }).catch(
      () => [] as PersonMaster[],
    ),
  history: (personPublicId: string) =>
    request<unknown>(`/persons/${encodeURIComponent(personPublicId)}/history`, { auth: true }).catch(
      () => null,
    ),
};
