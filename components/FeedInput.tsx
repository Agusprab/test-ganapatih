'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';

interface FeedInputProps {
  onSubmit: (content: string) => void;
  loading?: boolean;
}

export const FeedInput = ({ onSubmit, loading = false }: FeedInputProps) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What's happening?"
              className="w-full border-none resize-none focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
              rows={isExpanded ? 3 : 1}
              maxLength={200}
            />
            {isExpanded && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  {content.length}/200
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setContent('');
                      setIsExpanded(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!content.trim() || loading}
                  >
                    {loading ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};