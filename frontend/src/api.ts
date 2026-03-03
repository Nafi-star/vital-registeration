/**
 * API client for the Vital Registration backend (NestJS).
 * Set VITE_API_URL in .env or use default http://localhost:3000
 */

const getBaseUrl = () => import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function request<T>(
  path: string,
  options?: RequestInit & { method?: string; body?: object }
): Promise<T> {
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
    request<import('../types').BirthRecord[]>(
      status ? `/births?status=${encodeURIComponent(status)}` : '/births'
    ).catch(() => []),
  getOne: (id: string) => request<import('../types').BirthRecord>(`/births/${id}`),
  create: (data: Omit<import('../types').BirthRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<import('../types').BirthRecord>('/births', { method: 'POST', body: data }),
  updateStatus: (id: string, status: import('../types').RecordStatus) =>
    request<import('../types').BirthRecord>(`/births/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Deaths
export const deathsApi = {
  getAll: (status?: string) =>
    request<import('../types').DeathRecord[]>(
      status ? `/deaths?status=${encodeURIComponent(status)}` : '/deaths'
    ).catch(() => []),
  getOne: (id: string) => request<import('../types').DeathRecord>(`/deaths/${id}`),
  create: (data: Omit<import('../types').DeathRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<import('../types').DeathRecord>('/deaths', { method: 'POST', body: data }),
  updateStatus: (id: string, status: import('../types').RecordStatus) =>
    request<import('../types').DeathRecord>(`/deaths/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Marriages
export const marriagesApi = {
  getAll: (status?: string) =>
    request<import('../types').MarriageRecord[]>(
      status ? `/marriages?status=${encodeURIComponent(status)}` : '/marriages'
    ).catch(() => []),
  getOne: (id: string) => request<import('../types').MarriageRecord>(`/marriages/${id}`),
  create: (data: Omit<import('../types').MarriageRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<import('../types').MarriageRecord>('/marriages', { method: 'POST', body: data }),
  updateStatus: (id: string, status: import('../types').RecordStatus) =>
    request<import('../types').MarriageRecord>(`/marriages/${id}/status`, { method: 'PATCH', body: { status } }),
};

// Divorces
export const divorcesApi = {
  getAll: (status?: string) =>
    request<import('../types').DivorceRecord[]>(
      status ? `/divorces?status=${encodeURIComponent(status)}` : '/divorces'
    ).catch(() => []),
  getOne: (id: string) => request<import('../types').DivorceRecord>(`/divorces/${id}`),
  create: (data: Omit<import('../types').DivorceRecord, 'id' | 'status' | 'created_at' | 'updated_at'>) =>
    request<import('../types').DivorceRecord>('/divorces', { method: 'POST', body: data }),
  updateStatus: (id: string, status: import('../types').RecordStatus) =>
    request<import('../types').DivorceRecord>(`/divorces/${id}/status`, { method: 'PATCH', body: { status } }),
};
