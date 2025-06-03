import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Calendar,
  CheckCircle,
  User,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react';
import { Card, useBoardStore } from '../../stores/boardStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '../../lib/utils';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface CardModalProps {
  card: Card;
  onClose: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose }) => {
  const { updateCard, deleteCard } = useBoardStore();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [newComment, setNewComment] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleSave = () => {
    updateCard(card.id, {
      title,
      description,
    });
    onClose();
  };

  const handleDelete = () => {
    deleteCard(card.id);
    onClose();
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        authorId: '1', // TODO: Get from auth store
        authorName: 'Demo User',
        createdAt: new Date().toISOString(),
      };
      
      updateCard(card.id, {
        comments: [...card.comments, comment],
      });
      setNewComment('');
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const checklistItem = {
        id: Date.now().toString(),
        text: newChecklistItem,
        completed: false,
      };
      
      updateCard(card.id, {
        checklist: [...card.checklist, checklistItem],
      });
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    updateCard(card.id, {
      checklist: updatedChecklist,
    });
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedChecklist = card.checklist.filter(item => item.id !== itemId);
    updateCard(card.id, { checklist: updatedChecklist });
  };

  const completedChecklist = card.checklist.filter(item => item.completed).length;
  const totalChecklist = card.checklist.length;

  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Card Details
            </Dialog.Title>
            <div className="flex gap-2">
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                  <AlertDialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg w-full max-w-md">
                    <AlertDialog.Title className="text-lg font-semibold">
                      Delete Card
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
                      Are you sure you want to delete this card? This action cannot be undone.
                    </AlertDialog.Description>
                    <div className="mt-6 flex justify-end gap-2">
                      <AlertDialog.Cancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Card Info */}
            <div className="flex gap-2 flex-wrap">
              {card.dueDate && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(card.dueDate).toLocaleDateString()}
                </div>
              )}
              
              {card.assignees.length > 0 && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {card.assignees.map((assigneeId, index) => (
                      <Avatar key={assigneeId} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          U{index + 1}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <h3 className="font-medium">Checklist</h3>
                  {totalChecklist > 0 && (
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      completedChecklist === totalChecklist
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {completedChecklist}/{totalChecklist}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {card.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`checklist-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => handleToggleChecklistItem(item.id)}
                    />
                    <label
                      htmlFor={`checklist-${item.id}`}
                      className={cn(
                        "flex-grow text-sm",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.text}
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Add checklist item"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                />
                <Button
                  variant="outline"
                  onClick={handleAddChecklistItem}
                  disabled={!newChecklistItem.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                <h3 className="font-medium">
                  Comments ({card.comments.length})
                </h3>
              </div>

              <div className="space-y-4">
                {card.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comment.authorName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button
                  variant="outline"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CardModal;
