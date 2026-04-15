import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://trx-api-test.d4f.tech';
export const APP_SOURCE = 'debtnet-mobile';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  user_id: string;
}

// ── Token storage ──────────────────────────────
const TOKEN_KEY = 'dn_jwt';

export async function saveTokens(t: TokenPair) {
  await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(t));
}

export async function loadTokens(): Promise<TokenPair | null> {
  const raw = await AsyncStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function clearTokens() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// ── Core fetch with JWT + auto-refresh ─────────
let _tokens: TokenPair | null = null;

export async function getTokens(): Promise<TokenPair | null> {
  if (_tokens) return _tokens;
  _tokens = await loadTokens();
  return _tokens;
}

export function setMemTokens(t: TokenPair | null) {
  _tokens = t;
}

async function refreshAccessToken(): Promise<TokenPair | null> {
  const t = await getTokens();
  if (!t?.refresh_token) return null;
  try {
    const r = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: t.refresh_token }),
    });
    if (!r.ok) return null;
    const newT: TokenPair = await r.json();
    await saveTokens(newT);
    _tokens = newT;
    return newT;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

export async function apiReq<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  _retry = false,
): Promise<T> {
  const t = await getTokens();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (t?.access_token) headers['Authorization'] = `Bearer ${t.access_token}`;

  const r = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh on 401
  if (r.status === 401 && !_retry) {
    const newT = await refreshAccessToken();
    if (newT) return apiReq<T>(method, path, body, true);
    await clearTokens();
    _tokens = null;
    throw new ApiError(401, 'Сессия истекла. Войдите снова.');
  }

  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try {
      const j = await r.json();
      const raw = Array.isArray(j.message) ? j.message.join(', ') : j.message;
      if (r.status === 409) msg = 'Email уже зарегистрирован';
      else if (r.status === 400) msg = raw || 'Проверьте введённые данные';
      else msg = raw || msg;
    } catch {}
    throw new ApiError(r.status, msg);
  }

  // 204 No Content
  if (r.status === 204) return {} as T;

  const ct = r.headers.get('content-type') || '';
  if (ct.includes('application/json')) return r.json() as Promise<T>;
  return {} as T;
}

export const api = {
  get:    <T>(path: string)              => apiReq<T>('GET',    path),
  post:   <T>(path: string, body?: unknown) => apiReq<T>('POST',   path, body),
  patch:  <T>(path: string, body?: unknown) => apiReq<T>('PATCH',  path, body),
  delete: <T>(path: string)              => apiReq<T>('DELETE', path),
};
