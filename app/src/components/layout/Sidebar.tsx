import React from 'react';
import { Button } from '../ui/button';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex md:flex-col md:border-r md:border-cyber-purple-600 md:w-64 bg-cyber-black">
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col p-4 space-y-1">
          <Button variant="ghost" className="justify-start font-mono text-sm">
            Home
          </Button>
          <Button variant="ghost" className="justify-start font-mono text-sm">
            Tasks
          </Button>
          <Button variant="ghost" className="justify-start font-mono text-sm">
            Agents
          </Button>
          <Button variant="ghost" className="justify-start font-mono text-sm">
            Analytics
          </Button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
