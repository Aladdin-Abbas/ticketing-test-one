import api from './api';
import { List } from './types';

export async function getLists(boardId: string): Promise<List[]> {
  const { data } = await api.get<List[]>(`/lists?board_id=${boardId}`);
  return data;
}

export async function createList(boardId: string, name: string, position: number): Promise<List> {
  const { data } = await api.post<List>('/lists', { boardId, name, position });
  return data;
}

export async function updateList(id: string, updates: Partial<List>): Promise<List> {
  const { data } = await api.patch<List>(`/lists/${id}`, updates);
  return data;
}

export async function deleteList(id: string): Promise<void> {
  await api.delete(`/lists/${id}`);
}