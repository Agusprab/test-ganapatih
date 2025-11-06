'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';

const FindFriendsPage = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Decode token to get current user id
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = payload.id;

        // Fetch all users
        const usersResponse = await fetch('/api/get-user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        const usersData = await usersResponse.json();
        // Filter out current user
        const filteredUsers = usersData.users.filter(user => user.id !== currentUserId);
        setUsers(filteredUsers);

        // Fetch following
        const followingData = await api.getFollowing(token);
        if (followingData.error) {
          throw new Error(followingData.error);
        }
        setFollowing(followingData.following.map(f => f.id));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollow = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isFollowing = following.includes(userId);
    const result = isFollowing
      ? await api.unfollowUser(token, userId)
      : await api.followUser(token, userId);

    if (result.error) {
      setError(result.error);
      setToastMessage('Failed to update follow status');
      setToastType('error');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (isFollowing) {
      setFollowing(prev => prev.filter(id => id !== userId));
      setToastMessage('Successfully unfollowed');
      setToastType('success');
    } else {
      setFollowing(prev => [...prev, userId]);
      setToastMessage('Successfully followed');
      setToastType('success');
    }
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header onLogout={logout} onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main Content */}
          <main className="flex-1 max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header onLogout={logout} onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main Content */}
          <main className="flex-1 max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-red-600">Error: {error}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onLogout={logout} onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toastMessage}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-700">Find Friends</h1>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">All Users ({users.length})</h2>
            {users.length === 0 ? (
              <p className="text-gray-600">No users found.</p>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-700">{user.username}</span>
                    </div>
                    <Button
                      onClick={() => handleFollow(user.id)}
                      variant={following.includes(user.id) ? "secondary" : "primary"}
                      size="sm"
                    >
                      {following.includes(user.id) ? 'Unfollow' : 'Follow'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FindFriendsPage;
