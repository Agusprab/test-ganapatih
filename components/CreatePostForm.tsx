'use client';

import { useState } from 'react';
import { Button } from './Button';

interface CreatePostFormProps {
  onSubmit: (content: string) => Promise<void>;
  onClose: () => void;
}

export const CreatePostForm = ({ onSubmit, onClose }: CreatePostFormProps) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit(content.trim());
      setContent('');
      onClose();
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Create New Post</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              maxLength={200}
            />
            <div className="text-sm text-gray-500 mt-2 mb-4">
              {content.length}/200 characters
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-end space-x-3">
              <Button onClick={onClose} variant="secondary" type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !content.trim()}>
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};