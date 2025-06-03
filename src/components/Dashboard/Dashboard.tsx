import React, { useState } from 'react';
import { useBoardStore } from '../../stores/boardStore';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import CreateBoardDialog from './CreateBoardDialog';
import { cn } from '../../lib/utils';

const Dashboard: React.FC = () => {
  const { workspaces } = useBoardStore();
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your workspaces and boards
          </p>
        </div>
        <Button onClick={() => setCreateBoardOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

      {/* Workspaces */}
      <div className="space-y-6">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">{workspace.title}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateBoardOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Board
              </Button>
            </div>

            {/* Boards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspace.boards.map((board) => (
                <div
                  key={board.id}
                  className={cn(
                    "group relative rounded-lg border border-border p-4 hover:border-primary/50 transition-colors",
                    "bg-card text-card-foreground shadow-sm"
                  )}
                >
                  <div className="space-y-2">
                    <h3 className="font-medium">{board.title}</h3>
                    {board.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {board.description}
                      </p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="absolute inset-0 rounded-lg bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.location.href = `/board/${board.id}`}
                      >
                        Open Board
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {workspace.boards.length === 0 && (
                <div className="col-span-full">
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <h3 className="text-lg font-medium">No boards yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create your first board to get started
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setCreateBoardOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Board
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {workspaces.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <h3 className="text-lg font-medium">No workspaces yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first workspace to get started
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setCreateBoardOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        )}
      </div>

      <CreateBoardDialog
        open={createBoardOpen}
        onOpenChange={setCreateBoardOpen}
      />
    </div>
  );
};

export default Dashboard; 