import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoardStore } from '../../stores/boardStore';
import { useNavigate } from 'react-router-dom';

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWorkspaceId?: string;
}

const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({ 
  open, 
  onOpenChange,
  initialWorkspaceId 
}) => {
  const navigate = useNavigate();
  const { workspaces, createBoard } = useBoardStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workspaceId: initialWorkspaceId || workspaces[0]?.id || '',
  });

  useEffect(() => {
    if (initialWorkspaceId) {
      setFormData(prev => ({
        ...prev,
        workspaceId: initialWorkspaceId
      }));
    }
  }, [initialWorkspaceId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.workspaceId) {
      const newBoard = createBoard(formData.workspaceId, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        workspaceId: initialWorkspaceId || workspaces[0]?.id || '',
      });
      
      // Close dialog and navigate to new board
      onOpenChange(false);
      navigate(`/board/${newBoard.id}`);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      workspaceId: initialWorkspaceId || workspaces[0]?.id || '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Create a new board to organize your tasks and collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="board-title">Board Title</Label>
            <Input
              id="board-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Project Alpha, Marketing Campaign"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="board-description">Description (Optional)</Label>
            <Textarea
              id="board-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this board is for..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspace">Workspace</Label>
            <Select
              value={formData.workspaceId}
              onValueChange={(value) => setFormData({ ...formData, workspaceId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title.trim() || !formData.workspaceId}>
              Create Board
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardDialog;
