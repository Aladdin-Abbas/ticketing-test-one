import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType, useBoardStore } from '../../stores/boardStore';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckCircle, Calendar, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface CardItemProps {
  card: CardType;
  onClick: () => void;
  isDragging?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick, isDragging = false }) => {
  const { deleteCard } = useBoardStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteCard(card.id);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('button')) {
      onClick();
    }
  };

  const completedChecklist = card.checklist.filter(item => item.completed).length;
  const totalChecklist = card.checklist.length;
  const checklistProgress = totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0;

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const isDueSoon = card.dueDate && new Date(card.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div className="relative">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className={cn(
          "bg-card text-card-foreground rounded-lg border shadow-sm",
          "cursor-grab active:cursor-grabbing",
          "hover:shadow-md transition-shadow",
          isDragging && "bg-muted"
        )}
      >
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-medium flex-grow">{card.title}</h3>
            <div className="flex gap-1 relative z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                onMouseDown={(e) => e.stopPropagation()}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                onMouseDown={(e) => e.stopPropagation()}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {card.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {card.description}
            </p>
          )}

          {/* Due Date */}
          {card.dueDate && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mb-2",
              isOverdue ? "bg-destructive/10 text-destructive" :
              isDueSoon ? "bg-warning/10 text-warning" :
              "bg-muted text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              {new Date(card.dueDate).toLocaleDateString()}
            </div>
          )}

          {/* Checklist Progress */}
          {totalChecklist > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">
                  {completedChecklist}/{totalChecklist}
                </span>
              </div>
              <Progress value={checklistProgress} className="h-1" />
            </div>
          )}

          {/* Card Footer */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {card.comments.length > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {card.comments.length}
                  </span>
                </div>
              )}
            </div>

            {/* Assignees */}
            {card.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {card.assignees.map((assigneeId, index) => (
                  <Avatar key={assigneeId} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      U{index + 1}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold">
              Delete Card
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this card? This action cannot be undone.
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default CardItem;
