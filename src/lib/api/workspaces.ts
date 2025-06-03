import api from './api';
import { Workspace } from './types';

export async function getWorkspaces(): Promise<Workspace[]> {
  const { data } = await api.get<Workspace[]>('/workspaces');
  return data;
}

export async function createWorkspace(name: string): Promise<Workspace> {
  const { data } = await api.post<Workspace>('/workspaces', { name });
  return data;
}

export async function deleteWorkspace(id: string): Promise<void> {
  await api.delete(`/workspaces/${id}`);
}