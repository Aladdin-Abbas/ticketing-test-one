import React from 'react';
import { Outlet } from 'react-router-dom';
import WorkspaceSidebar from './WorkspaceSidebar';
import { cn } from '../../lib/utils';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex-shrink-0">
        <WorkspaceSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 