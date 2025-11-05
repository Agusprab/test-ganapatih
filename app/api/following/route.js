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

    // Check if user still exists in database
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get following
    const { data: following, error } = await supabase
      .from('follows')
      .select(`
        followee_id,
        users!follows_followee_id_fkey(username)
      `)
      .eq('follower_id', user.id);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch following' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format response
    const formattedFollowing = following.map(follow => ({
      id: follow.followee_id,
      username: follow.users.username,
    }));

    return new Response(JSON.stringify({ following: formattedFollowing }), {
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