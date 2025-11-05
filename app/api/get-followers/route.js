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

    // Get followers
    const { data: followers, error } = await supabase
      .from('follows')
      .select(`
        follower_id,
        users!follows_follower_id_fkey(username)
      `)
      .eq('followee_id', user.id);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch followers' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format response
    const formattedFollowers = followers.map(follower => ({
      id: follower.follower_id,
      username: follower.users.username,
    }));

    return new Response(JSON.stringify({ followers: formattedFollowers }), {
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
