import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../../stores/boardStore';
import { Button } from '../ui/button';
import { MoreHorizontal, Pencil, Trash2, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import DeleteCardDialog from './DeleteCardDialog';
import {
  Calendar,
  CheckCircle,
  User,
  MessageSquare,
} from 'lucide-react';

interface CardProps {
  card: CardType;
  index: number;
  onEdit?: (cardId: string, updates: Partial<CardType>) => void;
  onDelete?: (cardId: string) => void;
  onOpenModal?: (card: CardType) => void;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  index, 
  onEdit, 
  onDelete,
  onOpenModal 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedChecklist = card.checklist.filter(item => item.completed).length;
  const totalChecklist = card.checklist.length;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenModal?.(card);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-md border border-border bg-card p-3 shadow-sm",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab mt-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Card Content */}
        <div className="flex-1" onClick={handleCardClick}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm">{card.title}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal?.(card);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Card
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            {card.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                {card.description}
              </p>
            )}

            {/* Card Meta */}
            <div className="flex flex-wrap gap-2">
              {card.dueDate && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(card.dueDate).toLocaleDateString()}
                </div>
              )}
              
              {totalChecklist > 0 && (
                <div className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                  completedChecklist === totalChecklist
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                )}>
                  <CheckCircle className="h-3 w-3" />
                  {completedChecklist}/{totalChecklist}
                </div>
              )}

              {card.assignees.length > 0 && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                  <User className="h-3 w-3" />
                  {card.assignees.length}
                </div>
              )}

              {card.comments.length > 0 && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  {card.comments.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Card Dialog */}
      <DeleteCardDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => onDelete?.(card.id)}
        cardTitle={card.title}
      />
    </div>
  );
};

export default Card; 