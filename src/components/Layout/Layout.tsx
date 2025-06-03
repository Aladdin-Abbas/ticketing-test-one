import React, { useState } from 'react';
import { Menu, ChevronLeft, ChevronRight, Home, User, LogOut } from 'lucide-react';
import WorkspaceSidebar from './WorkspaceSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 280;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="text-lg font-bold">Workspaces</span>
          <button className="p-2 rounded hover:bg-muted">
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <WorkspaceSidebar />
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-primary text-white">
          <span className="text-xl font-bold">Collaborative Board</span>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Demo User</span>
            <button className="p-2 rounded-full hover:bg-primary/80">
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
