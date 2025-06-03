import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { List } from '../../stores/boardStore';
import { Button } from '../ui/button';
import { Plus, GripVertical, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Card from './Card.tsx';
import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import DeleteListDialog from './DeleteListDialog';

interface ColumnProps {
  column: List;
  index: number;
  onAddCard?: (listId: string) => void;
  onEditList?: (listId: string, newTitle: string) => void;
  onDeleteList?: (listId: string) => void;
  children?: React.ReactNode;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  index, 
  onAddCard,
  onEditList,
  onDeleteList,
  children
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleSubmit = () => {
    if (title.trim() && title !== column.title) {
      onEditList?.(column.id, title);
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "w-72 flex-shrink-0",
        isDragging && "opacity-50"
      )}
    >
      <div
        className={cn(
          "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
          isDragging && "cursor-grabbing"
        )}
      >
        {/* Column Header with Drag Handle */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2 flex-1">
            <div {...attributes} {...listeners} className="cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            {isEditing ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyDown}
                className="h-7 px-2"
                autoFocus
              />
            ) : (
              <h3 className="font-medium">{column.title}</h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {column.cards.length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit List
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Column Content */}
        <div className="p-2 min-h-[100px] space-y-2">
          {children}

          {/* Add Card Button */}
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => onAddCard?.(column.id)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      {/* Delete List Dialog */}
      <DeleteListDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => onDeleteList?.(column.id)}
        listTitle={column.title}
      />
    </div>
  );
};

export default Column;
