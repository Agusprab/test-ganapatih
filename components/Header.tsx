'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Icon } from './Icon';

interface HeaderProps {
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

export const Header = ({ onLogout, onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">


      {/* Center - Logo */}
      <div className="flex-1 text-left">
        <h1 className="text-xl font-bold text-blue-500 hidden sm:block">SocialApp</h1>
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