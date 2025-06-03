import api from './api';
import { Board } from './types';

export async function getBoards(workspaceId: string): Promise<Board[]> {
  const { data } = await api.get<Board[]>(`/boards?workspace_id=${workspaceId}`);
  return data;
}

export async function getBoard(id: string): Promise<Board> {
  const { data } = await api.get<Board>(`/boards/${id}`);
  return data;
}

export async function createBoard(workspaceId: string, name: string): Promise<Board> {
  const { data } = await api.post<Board>('/boards', { workspaceId, name });
  return data;
}

export async function updateBoard(id: string, updates: Partial<Board>): Promise<Board> {
  const { data } = await api.patch<Board>(`/boards/${id}`, updates);
  return data;
}

export async function deleteBoard(id: string): Promise<void> {
  await api.delete(`/boards/${id}`);
}
