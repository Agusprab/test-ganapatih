import { supabase } from '@/utils/supabase/server';
import { getUserFromToken } from '@/utils/auth';

export async function GET(request) {
  try {
    // Verify JWT token
    const user = getUserFromToken(request);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication failed (invalid token)' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username');

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Server error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
