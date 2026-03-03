const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const type = localStorage.getItem('type');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    if (type === 'tecnico') {
      headers['Authorization'] = 'Bearer ' + token;
    } else if (type === 'cliente') {
      headers['x-session-token'] = token;
    }
  }
  return headers;
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string> || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const error = data?.error || res.statusText;
    throw new Error(error);
  }
  return data;
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body: any) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path: string) => request(path, { method: 'DELETE' }),
};
