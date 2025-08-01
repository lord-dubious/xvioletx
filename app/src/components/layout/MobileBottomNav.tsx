import React from 'react';
import { Home, Search, Bell, MessageCircle, User } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileBottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeTab = 'home', 
  onTabChange 
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center justify-center h-full px-3 py-2 rounded-none hover:bg-gray-50 transition-colors ${
                isActive ? 'text-blue-500' : 'text-gray-500'
              }`}
              onClick={() => onTabChange?.(item.id)}
            >
              <Icon size={20} className="mb-0.5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
