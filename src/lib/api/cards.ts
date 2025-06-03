import api from './api';
import { Card, Comment, ChecklistItem } from './types';

// Cards
export async function getCards(listId: string): Promise<Card[]> {
  const { data } = await api.get<Card[]>(`/cards?list_id=${listId}`);
  return data;
}

export async function createCard(listId: string, title: string, position: number): Promise<Card> {
  const { data } = await api.post<Card>('/cards', { listId, title, position });
  return data;
}

export async function updateCard(id: string, updates: Partial<Card>): Promise<Card> {
  const { data } = await api.patch<Card>(`/cards/${id}`, updates);
  return data;
}

export async function deleteCard(id: string): Promise<void> {
  await api.delete(`/cards/${id}`);
}

// Comments
export async function addComment(cardId: string, text: string, parentId?: string): Promise<Comment> {
  const { data } = await api.post<Comment>(`/cards/${cardId}/comments`, { text, parentId });
  return data;
}

export async function getComments(cardId: string): Promise<Comment[]> {
  const { data } = await api.get<Comment[]>(`/cards/${cardId}/comments`);
  return data;
}

// Checklist
export async function addChecklistItem(cardId: string, text: string): Promise<ChecklistItem> {
  const { data } = await api.post<ChecklistItem>(`/cards/${cardId}/checklist`, { text });
  return data;
}

export async function updateChecklistItem(cardId: string, itemId: string, updates: Partial<ChecklistItem>): Promise<ChecklistItem> {
  const { data } = await api.patch<ChecklistItem>(`/cards/${cardId}/checklist/${itemId}`, updates);
  return data;
}

export async function deleteChecklistItem(cardId: string, itemId: string): Promise<void> {
  await api.delete(`/cards/${cardId}/checklist/${itemId}`);
}
