'use client';

import { Button } from './Button';
import { Icon } from './Icon';
import { timeAgo } from '@/utils/dateUtils';

interface Post {
  id: string;
  userid: string;
  content: string;
  createdat: string;
  username?: string;
}

interface PostCardProps {   
  post: Post;
  onFollow?: (userId: string) => void;
  isFollowing?: boolean;
  onLike?: (postId: string) => void;
  isLiked?: boolean;
  likesCount?: number;
}

export const PostCard = ({
  post,
  onFollow,
  isFollowing,
  onLike,
  isLiked = false,
  likesCount = 0
}: PostCardProps) => {
  const handleLike = () => {
    onLike?.(post.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {post.username ? post.username.charAt(0).toUpperCase() : post.userid.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {post.username || `User ${post.userid.slice(0, 8)}`}
            </h3>
            <span className="text-gray-500 text-sm">
              {timeAgo(post.createdat)}
            </span>
            
          </div>

          <p className="text-gray-800 mb-3 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Action buttons */}
          <div className="flex items-center space-x-8">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-sm transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Icon name="heart" className="text-lg" />
              <span>{likesCount}</span>
            </button>

   
          </div>
        </div>
      </div>
    </div>
  );
};