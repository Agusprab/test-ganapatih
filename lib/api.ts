const API_BASE = '/api';

export const api = {
  register: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  login: async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  getFeed: async (token: string, page: number = 1, limit: number = 10) => {
    const res = await fetch(`${API_BASE}/feed?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  createPost: async (token: string, content: string) => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    return res.json();
  },

  followUser: async (token: string, userid: string) => {
    const res = await fetch(`${API_BASE}/follow/${userid}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  unfollowUser: async (token: string, userid: string) => {
    const res = await fetch(`${API_BASE}/follow/${userid}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  getFollowing: async (token: string) => {
    const res = await fetch(`${API_BASE}/following`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  searchUsers: async (token: string, query: string) => {
    const res = await fetch(`${API_BASE}/search-users?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};