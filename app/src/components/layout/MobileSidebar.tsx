import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

const MobileSidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col p-4 space-y-1 bg-cyber-black border-r border-cyber-purple-600">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
