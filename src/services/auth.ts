import { API_URL, APP_SOURCE, TokenPair, saveTokens, clearTokens, setMemTokens } from './api';

export interface RegisterParams { email: string; password: string; username?: string; }
export interface LoginParams    { email: string; password: string; }

async function authFetch(path: string, body: object): Promise<TokenPair> {
  const r = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, source: APP_SOURCE }),
  });

  if (!r.ok) {
    let msg = `HTTP ${r.status}`;
    try {
      const j = await r.json();
      const raw = Array.isArray(j.message) ? j.message.join(', ') : j.message;
      if (r.status === 409) msg = 'Email уже зарегистрирован. Войдите или используйте другой.';
      else if (r.status === 400) msg = raw || 'Проверьте введённые данные (пароль мин. 8 символов)';
      else msg = raw || msg;
    } catch {}
    throw new Error(msg);
  }

  return r.json();
}

export async function register(params: RegisterParams): Promise<TokenPair> {
  const body: Record<string, string> = { email: params.email, password: params.password };
  if (params.username) body.username = params.username;
  const t = await authFetch('/auth/register', body);
  await saveTokens(t);
  setMemTokens(t);
  return t;
}

export async function login(params: LoginParams): Promise<TokenPair> {
  const t = await authFetch('/auth/login', params);
  await saveTokens(t);
  setMemTokens(t);
  return t;
}

export async function logout() {
  await clearTokens();
  setMemTokens(null);
}
