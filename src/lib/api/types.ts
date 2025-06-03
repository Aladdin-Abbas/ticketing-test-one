export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }
  
  export interface Workspace {
    id: string;
    name: string;
    ownerId: string;
    members: User[];
  }
  
  export interface Board {
    id: string;
    name: string;
    workspaceId: string;
    description?: string;
    lists: List[];
  }
  
  export interface List {
    id: string;
    name: string;
    boardId: string;
    position: number;
    cards: Card[];
  }
  
  export interface Card {
    id: string;
    title: string;
    description?: string;
    listId: string;
    position: number;
    assignees: User[];
    comments: Comment[];
    checklist: ChecklistItem[];
    dueDate?: string;
  }
  
  export interface Comment {
    id: string;
    cardId: string;
    author: User;
    text: string;
    createdAt: string;
    parentId?: string;
  }
  
  export interface ChecklistItem {
    id: string;
    cardId: string;
    text: string;
    completed: boolean;
  }