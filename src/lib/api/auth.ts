import api from './api';
import { User } from './types';

let token: string | null = null;

export function getAuthToken() {
  return token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
}

export function setAuthToken(newToken: string) {
  token = newToken;
  if (typeof window !== 'undefined') localStorage.setItem('token', newToken);
}

export function clearAuthToken() {
  token = null;
  if (typeof window !== 'undefined') localStorage.removeItem('token');
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<{ user: User }>('/auth/login', { email, password });
  return data.user;
}

export async function refresh(): Promise<User> {
  const { data } = await api.post<{ user: User }>('/auth/refresh');
  return data.user;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}
