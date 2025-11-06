'use client';

import { Button } from './Button';
import { Icon } from './Icon';
import { useAuth } from '@/hooks/useAuth';
import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onCreatePost?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}


export const Sidebar = ({ onCreatePost, isOpen = false, onClose }: SidebarProps) => {
  const { token } = useAuth();
  const pathname = usePathname();

  const userData = useMemo(() => {
    if (token) {
      try {
        // Decode JWT token to get user data
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          username: payload.username || 'User'
        };
      } catch (error) {
        console.error('Failed to decode token:', error);
        return { username: 'User' };
      }
    }
    return null;
  }, [token]);

  const menuItems = [
    { icon: 'home', label: 'Home', path: '/dashboard' },
    { icon: 'search', label: 'Find Friends', path: '/find-friends' },
    { icon: 'user', label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div className={`w-64 h-screen bg-white border-r border-gray-200 p-4 h-full fixed md:relative top-0 left-0 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:block`}>
        {/* Close button for mobile */}
        {isOpen && onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 z-10"
            aria-label="Close sidebar"
          >
            <Icon name="close" className="text-xl text-gray-500" />
          </button>
        )}

        {/* Logo */}
   

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.path}>
            <button
              className={`w-full flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon name={item.icon} className="text-xl" />
              <span>{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

  

      {/* User Profile Section */}
      <div className="border-t border-gray-200 pt-4" suppressHydrationWarning>
        {userData ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {userData.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{userData.username}</p>
              <p className="text-sm text-gray-500 truncate">@{userData.username.toLowerCase()}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
              ?
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};