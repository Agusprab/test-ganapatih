'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface User {
  id: string;
  username: string;
  email: string;
}

interface SearchUserProps {
  onFollow: (userId: string) => Promise<void>;
  following: string[];
}

export const SearchUser = ({ onFollow, following }: SearchUserProps) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchUsers = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/search-users?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await onFollow(userId);
    } catch (err) {
      setError('Failed to follow user');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-4">Search Users</h3>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search by username or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      
        <Button onClick={searchUsers} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={() => handleFollow(user.id)}
              variant={following.includes(user.id) ? "secondary" : "primary"}
              className="text-sm px-4 py-2"
            >
              {following.includes(user.id) ? 'Following' : 'Follow'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};