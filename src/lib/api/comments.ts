import api from './api';
import { Comment } from './types';

export async function getComments(cardId: string): Promise<Comment[]> {
  const { data } = await api.get<Comment[]>(`/cards/${cardId}/comments`);
  return data;
}

export async function addComment(cardId: string, text: string, parentId?: string): Promise<Comment> {
  const { data } = await api.post<Comment>(`/cards/${cardId}/comments`, { text, parentId });
  return data;
}

export async function deleteComment(cardId: string, commentId: string): Promise<void> {
  await api.delete(`/cards/${cardId}/comments/${commentId}`);
}
