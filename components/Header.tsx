'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Icon } from './Icon';

interface HeaderProps {
  onLogout: () => void;
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header = ({ onLogout, onSearch, onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Burger Icon for mobile */}
      {onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <Icon name="menu" className="text-xl" />
        </button>
      )}

      {/* Center - Logo */}
      <div className="flex-1 text-left">
        <h1 className="text-xl font-bold text-blue-500">SocialApp</h1>
      </div>

      {/* Right side - User actions */}
      <div className="flex-1 flex justify-end items-center space-x-4">
        <Button onClick={onLogout} variant="danger" className="text-sm">
          Logout
        </Button>
      </div>
    </header>
  );
};