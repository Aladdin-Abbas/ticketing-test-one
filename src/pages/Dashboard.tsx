import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '../stores/boardStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Kanban } from 'lucide-react';
import CreateBoardDialog from '../components/Dashboard/CreateBoardDialog';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { workspaces } = useBoardStore();
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');

  const allBoards = workspaces.flatMap(workspace => 
    workspace.boards.map(board => ({
      ...board,
      workspaceName: workspace.title,
    }))
  );

  const handleAddBoard = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setCreateBoardOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your projects and collaborate with your team
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recent Boards</h2>
          <Button className="rounded-lg" onClick={() => {
            setSelectedWorkspaceId(workspaces[0]?.id || '');
            setCreateBoardOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Board
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBoards.map((board) => (
            <Card
              key={board.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              onClick={() => navigate(`/board/${board.id}`)}
            >
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Kanban className="w-5 h-5 mr-2 text-primary" />
                  <CardTitle className="text-lg">{board.title}</CardTitle>
                </div>
                <Badge variant="outline" className="w-fit">
                  {board.workspaceName}
                </Badge>
                <CardDescription className="mt-2">
                  {board.description || 'No description available'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Kanban className="w-4 h-4" />
                    <span>{board.lists.length} lists</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{board.members.length} members</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {board.members.slice(0, 4).map((memberId, index) => (
                    <Avatar key={memberId} className="w-6 h-6 border-2 border-background">
                      <AvatarFallback className="text-xs">
                        U{index + 1}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {board.members.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{board.members.length - 4}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/board/${board.id}`);
                  }}
                >
                  Open Board
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Workspaces</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card key={workspace.id}>
              <CardHeader>
                <CardTitle>{workspace.title}</CardTitle>
                <CardDescription>
                  {workspace.description || 'No description available'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Kanban className="w-4 h-4" />
                    <span>{workspace.boards.length} boards</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{workspace.members.length} members</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="gap-2">
                <Button variant="outline" size="sm">
                  View Workspace
                </Button>
                <Button size="sm" onClick={() => handleAddBoard(workspace.id)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Board
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <CreateBoardDialog 
        open={createBoardOpen} 
        onOpenChange={setCreateBoardOpen}
        initialWorkspaceId={selectedWorkspaceId}
      />
    </div>
  );
};

export default Dashboard;
