import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  IconButton,
  Button,
  Dialog,
  CircularProgress,
} from '@mui/material';
import { Add, MoreHoriz } from '@mui/icons-material';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
  DragMoveEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBoardStore, Card as CardType } from '../stores/boardStore';
import Column from '../components/Board/Column';
import Card from '../components/Board/Card';
import CardItem from '../components/Board/CardItem';
import CardModal from '../components/Board/CardModal';
import AddListDialog from '../components/Board/AddListDialog';
import AddCardDialog from '../components/Board/AddCardDialog';
import * as RadixDialog from '@radix-ui/react-dialog';

const BoardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { workspaces, currentBoard, setCurrentBoard } = useBoardStore();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDraggingList, setIsDraggingList] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced for more precise activation
        delay: 0, // No delay for immediate response
        tolerance: 2, // Reduced tolerance for more precise movement
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (id) {
      // Find the board across all workspaces
      let boardFound = null;
      for (const workspace of workspaces) {
        console.log(workspace,"workspace");
        const board = workspace.boards.find(b => b.id === id);
        if (board) {
          boardFound = board;
          break;
        }
      }
      setCurrentBoard(boardFound);
    }
  }, [id, workspaces, setCurrentBoard]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
    
    // Check if we're dragging a list
    if (currentBoard) {
      const isList = currentBoard.lists.some(list => list.id === active.id.toString());
      setIsDraggingList(isList);

      // If it's a card, find and set it
      if (!isList) {
        for (const list of currentBoard.lists) {
          const card = list.cards.find(c => c.id === active.id.toString());
          if (card) {
            setActiveCard(card);
            break;
          }
        }
      }
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;
    if (!over || !currentBoard) return;

    // If dragging a list, only allow horizontal movement
    if (isDraggingList) {
      const activeElement = document.getElementById(active.id.toString());
      if (activeElement) {
        const transform = activeElement.style.transform;
        const match = transform.match(/translate3d\(([^,]+),([^,]+),([^)]+)\)/);
        if (match) {
          const [, x] = match;
          // Lock to horizontal movement only
          activeElement.style.transform = `translate3d(${x},0px,0)`;
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !currentBoard) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // If dragging a list, only allow dropping on other lists
    if (isDraggingList) {
      const overList = currentBoard.lists.find(list => list.id === overId);
      if (!overList) return;

      // Add visual indicator for list reordering
      const overElement = document.getElementById(overId);
      if (overElement) {
        const rect = overElement.getBoundingClientRect();
        const activeRect = document.getElementById(activeId)?.getBoundingClientRect();
        
        if (activeRect) {
          const isAfter = activeRect.left < rect.left;
          overElement.style.borderLeft = isAfter ? '2px solid #3b82f6' : 'none';
          overElement.style.borderRight = !isAfter ? '2px solid #3b82f6' : 'none';
        }
      }
    }

    // Find the source and destination lists
    const sourceList = currentBoard.lists.find(list => 
      list.cards.some(card => card.id === activeId)
    );
    const destinationList = currentBoard.lists.find(list => 
      list.id === overId || list.cards.some(card => card.id === overId)
    );

    if (!sourceList || !destinationList) return;

    // If dragging over a different list, add a visual indicator
    if (sourceList.id !== destinationList.id) {
      const overElement = document.getElementById(overId);
      if (overElement) {
        overElement.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveId(null);
    setIsDraggingList(false);

    if (!over || !currentBoard) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Handle list dragging
    if (isDraggingList) {
      const activeList = currentBoard.lists.find(list => list.id === activeId);
      const overList = currentBoard.lists.find(list => list.id === overId);
      if (activeList && overList) {
        const newIndex = currentBoard.lists.findIndex(list => list.id === overId);
        const activeRect = document.getElementById(activeId)?.getBoundingClientRect();
        const overRect = document.getElementById(overId)?.getBoundingClientRect();
        
        if (activeRect && overRect) {
          const isAfter = activeRect.left < overRect.left;
          useBoardStore.getState().moveList(activeId, isAfter ? newIndex + 1 : newIndex);
        } else {
          useBoardStore.getState().moveList(activeId, newIndex);
        }
      }
    }

    // Handle card dragging
    const sourceList = currentBoard.lists.find(list => 
      list.cards.some(card => card.id === activeId)
    );
    const destinationList = currentBoard.lists.find(list => 
      list.id === overId || list.cards.some(card => card.id === overId)
    );

    if (!sourceList || !destinationList) return;

    // Find the card being moved
    const cardToMove = sourceList.cards.find(card => card.id === activeId);
    if (!cardToMove) return;

    // Calculate the new position
    let newPosition = 0;
    if (overId === destinationList.id) {
      // Dropping on the list itself (at the end)
      newPosition = destinationList.cards.length;
    } else {
      // Dropping on another card
      const overCardIndex = destinationList.cards.findIndex(card => card.id === overId);
      newPosition = overCardIndex;
    }

    // Move the card
    useBoardStore.getState().moveCard(activeId, destinationList.id, newPosition);

    // Reset any visual indicators
    const overElement = document.getElementById(overId);
    if (overElement) {
      overElement.style.borderLeft = '';
      overElement.style.borderRight = '';
      overElement.style.backgroundColor = '';
    }
  };

  const openCardModal = (card: CardType) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const closeCardModal = () => {
    setIsCardModalOpen(false);
    setSelectedCard(null);
  };

  const handleAddCard = (listId: string) => {
    setSelectedListId(listId);
    setIsAddCardOpen(true);
  };

  const handleCardAdd = (cardData: { title: string; description: string }) => {
    if (!currentBoard || !selectedListId) return;
    
    const newCard = {
      ...cardData,
      listId: selectedListId,
      position: currentBoard.lists.find(list => list.id === selectedListId)?.cards.length || 0,
      assignees: [],
      checklist: [],
      comments: [],
    };
    
    useBoardStore.getState().addCard(selectedListId, newCard);
  };

  const handleEditList = (listId: string, newTitle: string) => {
    if (!currentBoard) return;
    useBoardStore.getState().updateList(listId, { title: newTitle });
  };

  const handleDeleteList = (listId: string) => {
    if (!currentBoard) return;
    useBoardStore.getState().deleteList(listId);
  };

  const handleEditCard = (cardId: string, updates: Partial<CardType>) => {
    if (!currentBoard) return;
    useBoardStore.getState().updateCard(cardId, updates);
  };

  const handleDeleteCard = (cardId: string) => {
    if (!currentBoard) return;
    useBoardStore.getState().deleteCard(cardId);
  };

  if (!currentBoard) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading board...
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      {/* Board Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom={false}>
              {currentBoard.title}
            </Typography>
            {currentBoard.description && (
              <Typography variant="body2" color="text.secondary">
                {currentBoard.description}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsAddListOpen(true)}
            >
              Add List
            </Button>
            <IconButton>
              <MoreHoriz />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Board Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
          display: 'flex',
          gap: 3,
          minHeight: 'calc(100vh - 64px - 80px)', // AppBar + Header
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentBoard.lists.map(list => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            {currentBoard.lists.map((list,index) => 
             {
              console.log(list,"list");
              return <Column
                key={list.id}
                column={list}
                index={index}
                onAddCard={handleAddCard}
                onEditList={handleEditList}
                onDeleteList={handleDeleteList}
              >
                {list.cards.map((card, cardIndex) => (
                  <Card
                    key={card.id}
                    card={card}
                    index={cardIndex}
                    onEdit={handleEditCard}
                    onDelete={handleDeleteCard}
                    onOpenModal={openCardModal}
                  />
                ))}
              </Column>}
            )}
          </SortableContext>

          <DragOverlay>
            {activeCard ? (
              <CardItem
                card={activeCard}
                onClick={() => {}}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add List Placeholder */}
        <Box
          sx={{
            minWidth: 300,
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 2,
            p: 2,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: 'grey.300',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.08)',
              borderColor: 'primary.main',
            },
          }}
          onClick={() => setIsAddListOpen(true)}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Add sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Add another list
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Card Edit Modal (using Radix UI Dialog) */}
            {selectedCard && isCardModalOpen && (
              <CardModal
                card={selectedCard}
                onClose={closeCardModal} // Still use this to update local state if needed
              />
            )}


      {/* Add List Dialog */}
      <AddListDialog
        open={isAddListOpen}
        onClose={() => setIsAddListOpen(false)}
        boardId={currentBoard?.id || ''}
      />

      {/* Add Card Dialog (using Radix UI Dialog) */}
      <AddCardDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
        onAdd={handleCardAdd}
      />
    </Box>
  );
};

export default BoardPage;
