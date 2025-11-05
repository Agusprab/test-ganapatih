'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { FeedInput } from '@/components/FeedInput';

interface Post {
  id: string;
  userid: string;
  content: string;
  createdat: string;
  username?: string;
}

const DashboardPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchFeed(true);
        }
      },
      { threshold: 1.0 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loadingMore, loading]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;
 
  }, []);

  const fetchFeed = async (loadMore = false) => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await api.getFeed(storedToken, loadMore ? page + 1 : 1, 10);
      if (data.error === 'Authentication failed (invalid token)') {
        logout();
        return;
      }
      if (data.posts) {
        if (loadMore) {
          if (data.posts.length > 0) {
            setPosts(prev => [...prev, ...data.posts]);
            setPage(prev => prev + 1);
          } else {
            setHasMore(false);
          }
        } else {
          setPosts(data.posts);
          setPage(1);
          setHasMore(data.posts.length === 10);
        }
      } else {
        setError(data.error || 'Failed to fetch feed');
        if (loadMore) setHasMore(false);
      }
    } catch (err) {
      setError('Network error');
      if (loadMore) setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };



  const handleCreatePost = async (content: string) => {
    setIsPosting(true);
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsPosting(false);
      return;
    }

    const result = await api.createPost(storedToken, content);
    if (result.error) {
      setError(result.error);
      setToastMessage('Failed to create post');
      setToastType('error');
      setTimeout(() => setToastMessage(''), 3000);
    } else {
      // Refresh feed to show new post
      fetchFeed();
      setToastMessage('Post created successfully!');
      setToastType('success');
      setTimeout(() => setToastMessage(''), 3000);
    }
    setIsPosting(false);
  };

  const handleFollow = async (userId: string) => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    const isFollowing = following.includes(userId);
    const result = isFollowing
      ? await api.unfollowUser(storedToken, userId)
      : await api.followUser(storedToken, userId);

    if (result.error) {
      throw new Error(result.error);
    }

    // Update following state
    if (isFollowing) {
      setFollowing(prev => prev.filter(id => id !== userId));
    } else {
      setFollowing(prev => [...prev, userId]);
    }
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header onLogout={logout} />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your feed...</p>
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
      <Header onLogout={logout} />

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
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 max-w-2xl mx-auto p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Feed Input */}
          <FeedInput onSubmit={handleCreatePost} loading={isPosting} />

          {/* Feed */}
          <div className="space-y-4">
            {posts.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Be the first to share something with your followers!</p>
              </div>
            ) : (
              <>
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    ref={index === posts.length - 1 ? observerRef : null}
                  >
                    <PostCard
                      post={post}
                      onFollow={handleFollow}
                      isFollowing={following.includes(post.userid)}
                      onLike={handleLike}
                      isLiked={likedPosts.has(post.id)}
                      likesCount={likedPosts.has(post.id) ? 1 : 0}
                    />
                  </div>
                ))}
                {loadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Loading more posts...</span>
                  </div>
                )}
                {!hasMore && posts.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You&apos;ve reached the end of your feed!</p>
                  </div>
                )}
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;