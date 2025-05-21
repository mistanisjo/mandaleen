import type React from 'react';
import { LogOut, Bot, Menu, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  user: {
    email?: string;
  } | null;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onToggleLeftSidebar,
  onToggleRightSidebar 
}) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            {user && (
              <button
                type="button"
                onClick={onToggleLeftSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                aria-label="Toggle conversation sidebar"
              >
                <Menu size={24} />
              </button>
            )}
            <div className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-1.5 rounded-md mr-2">
                <Bot size={20} />
              </div>
              <span className="text-xl font-semibold text-gray-900">Mandaleen</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              // Email and Sign Out button are removed from here
              <button
                type="button"
                onClick={onToggleRightSidebar}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                aria-label="Toggle agents sidebar"
              >
                <Users size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
