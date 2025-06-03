import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoardStore } from '../../stores/boardStore';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import Column from './Column';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { cn } from '../../lib/utils';

const Board: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { getBoard, updateColumnOrder, updateCardOrder } = useBoardStore();
  const board = getBoard(boardId!);
  const [isDragging, setIsDragging] = useState(false);

  if (!board) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Board not found</h1>
          <p className="text-muted-foreground mt-2">
            The board you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === 'column') {
      updateColumnOrder(board.id, source.index, destination.index);
    } else if (type === 'card') {
      updateCardOrder(
        board.id,
        source.droppableId,
        destination.droppableId,
        source.index,
        destination.index
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold">{board.title}</h1>
          {board.description && (
            <p className="text-muted-foreground mt-1">
              {board.description}
            </p>
          )}
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto">
        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(result) => {
            setIsDragging(false);
            handleDragEnd(result);
          }}
        >
          <Droppable
            droppableId="board"
            type="column"
            direction="horizontal"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "flex gap-4 p-6 min-h-full",
                  isDragging && "cursor-grabbing"
                )}
              >
                {board.lists.map((column, index) => (
                  <Column
                    key={column.id}
                    column={column}
                    index={index}
                  />
                ))}
                {provided.placeholder}

                {/* Add Column Button */}
                <div className="w-72 flex-shrink-0">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-dashed"
                    onClick={() => {/* TODO: Implement add column */}}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Board; 