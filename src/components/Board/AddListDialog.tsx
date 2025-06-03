import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useBoardStore } from '../../stores/boardStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AddListDialogProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
}

const AddListDialog: React.FC<AddListDialogProps> = ({ open, onClose, boardId }) => {
  const { addList } = useBoardStore();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addList(boardId, title.trim());
      setTitle('');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Add New List
          </Dialog.Title>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">List Title</Label>
                <Input
                  id="title"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., To Do, In Progress, Done"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim()}
              >
                Add List
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddListDialog;
