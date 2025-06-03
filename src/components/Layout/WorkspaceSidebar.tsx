import React, { useState } from 'react';
import {
  LayoutDashboard,
  Folder,
  Kanban,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBoardStore } from '../../stores/boardStore';
import CreateBoardDialog from '../Dashboard/CreateBoardDialog';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import * as Collapsible from '@radix-ui/react-collapsible';

const WorkspaceSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspaces } = useBoardStore();
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set(['1']));
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');

  const toggleWorkspace = (workspaceId: string) => {
    const newExpanded = new Set(expandedWorkspaces);
    if (newExpanded.has(workspaceId)) {
      newExpanded.delete(workspaceId);
    } else {
      newExpanded.add(workspaceId);
    }
    setExpandedWorkspaces(newExpanded);
  };

  const handleAddBoard = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setCreateBoardOpen(true);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-full overflow-auto">
      <div className="h-16 flex items-center px-4">
        <h2 className="text-lg font-semibold">
          Workspaces
        </h2>
      </div>
      <div className="h-px bg-border" />
      
      <nav className="p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2",
            isActive('/') && "bg-accent"
          )}
          onClick={() => navigate('/')}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Button>
      </nav>

      <div className="h-px bg-border" />

      <nav className="p-2">
        {workspaces.map((workspace) => (
          <div key={workspace.id}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => toggleWorkspace(workspace.id)}
            >
              <Folder className="h-4 w-4" />
              <span className="text-sm font-medium flex-grow text-left">
                {workspace.title}
              </span>
              {expandedWorkspaces.has(workspace.id) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            <Collapsible.Root
              open={expandedWorkspaces.has(workspace.id)}
              className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
            >
              <Collapsible.Content className="overflow-hidden">
                <div className="pl-4 space-y-1">
                  {workspace.boards.map((board) => (
                    <Button
                      key={board.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive(`/board/${board.id}`) && "bg-accent"
                      )}
                      onClick={() => navigate(`/board/${board.id}`)}
                    >
                      <Kanban className="h-4 w-4" />
                      <span className="text-sm">
                        {board.title}
                      </span>
                    </Button>
                  ))}
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground italic"
                    onClick={() => handleAddBoard(workspace.id)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">
                      Add Board
                    </span>
                  </Button>
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        ))}
      </nav>

      <CreateBoardDialog 
        open={createBoardOpen} 
        onOpenChange={setCreateBoardOpen}
        initialWorkspaceId={selectedWorkspaceId}
      />
    </div>
  );
};

export default WorkspaceSidebar;
