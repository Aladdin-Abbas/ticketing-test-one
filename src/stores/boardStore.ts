import { create } from 'zustand';

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  dueDate?: string;
  assignees: string[];
  checklist: ChecklistItem[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  workspaceId: string;
  lists: List[];
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  title: string;
  description?: string;
  members: string[];
  boards: Board[];
  createdAt: string;
}

interface BoardState {
  workspaces: Workspace[];
  currentBoard: Board | null;
  isLoading: boolean;
  
  // Actions
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentBoard: (board: Board | null) => void;
  createBoard: (workspaceId: string, boardData: { title: string; description?: string }) => Board;
  addCard: (listId: string, card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  moveCard: (cardId: string, newListId: string, newPosition: number) => void;
  addList: (boardId: string, title: string) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  moveList: (listId: string, newPosition: number) => void;
  deleteList: (listId: string) => void;
  deleteCard: (cardId: string) => void;
  getBoard: (boardId: string) => Board | undefined;
  updateColumnOrder: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
  updateCardOrder: (
    boardId: string,
    sourceListId: string,
    destinationListId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
}

// Mock data for demo
const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    title: 'Personal Projects',
    description: 'My personal development projects',
    members: ['1'],
    createdAt: new Date().toISOString(),
    boards: [
      {
        id: '1',
        title: 'Project Alpha',
        description: 'Main development board for Project Alpha',
        workspaceId: '1',
        members: ['1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lists: [
          {
            id: '1',
            title: 'To Do',
            boardId: '1',
            position: 0,
            cards: [
              {
                id: '1',
                title: 'Set up authentication system',
                description: 'Implement login and registration with Xano',
                listId: '1',
                position: 0,
                assignees: ['1'],
                checklist: [
                  { id: '1', text: 'Create login form', completed: true },
                  { id: '2', text: 'Create registration form', completed: false },
                  { id: '3', text: 'Connect to Xano API', completed: false },
                ],
                comments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: '2',
                title: 'Design board layout',
                description: 'Create responsive board layout with drag and drop',
                listId: '1',
                position: 1,
                assignees: [],
                checklist: [],
                comments: [
                  {
                    id: '1',
                    text: 'Should we use MUI or custom components?',
                    authorId: '1',
                    authorName: 'Demo User',
                    createdAt: new Date().toISOString(),
                  }
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: '2',
            title: 'In Progress',
            boardId: '1',
            position: 1,
            cards: [
              {
                id: '3',
                title: 'Implement drag and drop',
                description: 'Add dnd-kit for card and list reordering',
                listId: '2',
                position: 0,
                assignees: ['1'],
                checklist: [],
                comments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          {
            id: '3',
            title: 'Done',
            boardId: '1',
            position: 2,
            cards: [
              {
                id: '4',
                title: 'Project setup',
                description: 'Initialize React project with required dependencies',
                listId: '3',
                position: 0,
                assignees: ['1'],
                checklist: [
                  { id: '4', text: 'Install React and TypeScript', completed: true },
                  { id: '5', text: 'Configure MUI theme', completed: true },
                  { id: '6', text: 'Set up routing', completed: true },
                ],
                comments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
        ],
      },
    ],
  },
];

export const useBoardStore = create<BoardState>((set, get) => ({
  workspaces: mockWorkspaces,
  currentBoard: null,
  isLoading: false,

  setWorkspaces: (workspaces) => set({ workspaces }),
  
  setCurrentBoard: (board) => set({ currentBoard: board }),

  createBoard: (workspaceId, boardData) => {
    const { workspaces } = get();
    const newBoard: Board = {
      id: Date.now().toString(),
      title: boardData.title,
      description: boardData.description,
      workspaceId,
      members: ['1'], // Default to current user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lists: [
        {
          id: `${Date.now()}-1`,
          title: 'To Do',
          boardId: Date.now().toString(),
          position: 0,
          cards: [],
        },
        {
          id: `${Date.now()}-2`,
          title: 'In Progress',
          boardId: Date.now().toString(),
          position: 1,
          cards: [],
        },
        {
          id: `${Date.now()}-3`,
          title: 'Done',
          boardId: Date.now().toString(),
          position: 2,
          cards: [],
        },
      ],
    };

    const updatedWorkspaces = workspaces.map(workspace =>
      workspace.id === workspaceId
        ? { ...workspace, boards: [...workspace.boards, newBoard] }
        : workspace
    );

    set({ workspaces: updatedWorkspaces });
    return newBoard;
  },

  addCard: (listId, cardData) => {
    const { workspaces } = get();
    const newCard: Card = {
      ...cardData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedWorkspaces = workspaces.map(workspace => ({
      ...workspace,
      boards: workspace.boards.map(board => ({
        ...board,
        lists: board.lists.map(list =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        ),
      })),
    }));

    set({ workspaces: updatedWorkspaces });
  },

  updateCard: (cardId, updates) => {
    const { currentBoard } = get();
    if (!currentBoard) return;

    const updatedBoard = {
      ...currentBoard,
      lists: currentBoard.lists.map(list => ({
        ...list,
        cards: list.cards.map(card =>
          card.id === cardId
            ? { ...card, ...updates, updatedAt: new Date().toISOString() }
            : card
        ),
      })),
    };

    set({ currentBoard: updatedBoard });
  },

  moveCard: (cardId, newListId, newPosition) => {
    const { currentBoard } = get();
    if (!currentBoard) return;

    // Find and remove the card from its current list
    let cardToMove: Card | null = null;
    const listsWithoutCard = currentBoard.lists.map(list => ({
      ...list,
      cards: list.cards.filter(card => {
        if (card.id === cardId) {
          cardToMove = card;
          return false;
        }
        return true;
      }),
    }));

    if (!cardToMove) return;

    // Add the card to its new list at the specified position
    const updatedLists = listsWithoutCard.map(list => {
      if (list.id === newListId) {
        const newCards = [...list.cards];
        newCards.splice(newPosition, 0, { ...cardToMove!, listId: newListId });
        return { ...list, cards: newCards };
      }
      return list;
    });

    set({
      currentBoard: {
        ...currentBoard,
        lists: updatedLists,
      },
    });
  },

  addList: (boardId, title) => {
    const { currentBoard } = get();
    if (!currentBoard || currentBoard.id !== boardId) return;

    const newList: List = {
      id: `list-${Date.now()}`,
      title,
      boardId,
      position: currentBoard.lists.length,
      cards: [],
    };

    const updatedBoard = {
      ...currentBoard,
      lists: [...currentBoard.lists, newList],
    };

    const updatedWorkspaces = get().workspaces.map(workspace => ({
      ...workspace,
      boards: workspace.boards.map(board =>
        board.id === boardId ? updatedBoard : board
      ),
    }));

    set({
      currentBoard: updatedBoard,
      workspaces: updatedWorkspaces,
    });
  },

  updateList: (listId, updates) => {
    const { workspaces } = get();
    const updatedWorkspaces = workspaces.map(workspace => ({
      ...workspace,
      boards: workspace.boards.map(board => ({
        ...board,
        lists: board.lists.map(list =>
          list.id === listId
            ? { ...list, ...updates }
            : list
        ),
      })),
    }));

    set({ workspaces: updatedWorkspaces });
  },

  deleteList: (listId) => {
    const { workspaces } = get();
    const updatedWorkspaces = workspaces.map(workspace => ({
      ...workspace,
      boards: workspace.boards.map(board => ({
        ...board,
        lists: board.lists.filter(list => list.id !== listId),
      })),
    }));

    set({ workspaces: updatedWorkspaces });
  },

  moveList: (listId, newPosition) => {
    const { currentBoard } = get();
    if (!currentBoard) return;

    const lists = [...currentBoard.lists];
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) return;

    const [movedList] = lists.splice(listIndex, 1);
    lists.splice(newPosition, 0, movedList);

    set({
      currentBoard: {
        ...currentBoard,
        lists: lists.map((list, index) => ({ ...list, position: index })),
      },
    });
  },

  deleteCard: (cardId) => {
    const { currentBoard } = get();
    if (!currentBoard) return;

    const updatedBoard = {
      ...currentBoard,
      lists: currentBoard.lists.map(list => ({
        ...list,
        cards: list.cards.filter(card => card.id !== cardId),
      })),
    };

    set({ currentBoard: updatedBoard });
  },

  getBoard: (boardId) => {
    const { workspaces } = get();
    for (const workspace of workspaces) {
      const board = workspace.boards.find(b => b.id === boardId);
      if (board) return board;
    }
    return undefined;
  },

  updateColumnOrder: (boardId, sourceIndex, destinationIndex) => {
    const { workspaces } = get();
    const updatedWorkspaces = workspaces.map(workspace => {
      const board = workspace.boards.find(b => b.id === boardId);
      if (!board) return workspace;

      const updatedLists = [...board.lists];
      const [movedList] = updatedLists.splice(sourceIndex, 1);
      updatedLists.splice(destinationIndex, 0, movedList);

      // Update positions
      updatedLists.forEach((list, index) => {
        list.position = index;
      });

      return {
        ...workspace,
        boards: workspace.boards.map(b =>
          b.id === boardId
            ? { ...b, lists: updatedLists }
            : b
        ),
      };
    });

    set({ workspaces: updatedWorkspaces });
  },

  updateCardOrder: (boardId, sourceListId, destinationListId, sourceIndex, destinationIndex) => {
    const { workspaces } = get();
    const updatedWorkspaces = workspaces.map(workspace => {
      const board = workspace.boards.find(b => b.id === boardId);
      if (!board) return workspace;

      const sourceList = board.lists.find(l => l.id === sourceListId);
      const destinationList = board.lists.find(l => l.id === destinationListId);
      if (!sourceList || !destinationList) return workspace;

      const updatedSourceCards = [...sourceList.cards];
      const [movedCard] = updatedSourceCards.splice(sourceIndex, 1);

      if (sourceListId === destinationListId) {
        // Same list
        updatedSourceCards.splice(destinationIndex, 0, movedCard);
        updatedSourceCards.forEach((card, index) => {
          card.position = index;
        });

        return {
          ...workspace,
          boards: workspace.boards.map(b =>
            b.id === boardId
              ? {
                  ...b,
                  lists: b.lists.map(l =>
                    l.id === sourceListId
                      ? { ...l, cards: updatedSourceCards }
                      : l
                  ),
                }
              : b
          ),
        };
      } else {
        // Different lists
        const updatedDestinationCards = [...destinationList.cards];
        updatedDestinationCards.splice(destinationIndex, 0, {
          ...movedCard,
          listId: destinationListId,
        });

        // Update positions
        updatedSourceCards.forEach((card, index) => {
          card.position = index;
        });
        updatedDestinationCards.forEach((card, index) => {
          card.position = index;
        });

        return {
          ...workspace,
          boards: workspace.boards.map(b =>
            b.id === boardId
              ? {
                  ...b,
                  lists: b.lists.map(l => {
                    if (l.id === sourceListId) {
                      return { ...l, cards: updatedSourceCards };
                    }
                    if (l.id === destinationListId) {
                      return { ...l, cards: updatedDestinationCards };
                    }
                    return l;
                  }),
                }
              : b
          ),
        };
      }
    });

    set({ workspaces: updatedWorkspaces });
  },
}));
