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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (page < 1 || limit < 1 || limit > 100) { 
      return new Response(JSON.stringify({ error: 'Invalid page or limit' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const offset = (page - 1) * limit;

    // Get followee IDs
    const { data: follows } = await supabase
      .from('follows')
      .select('followee_id')
      .eq('follower_id', user.id);
    
    const followeeIds = follows?.map(f => f.followee_id) || [];

    // Optimized query: Get posts from followed users and self using JOIN
    // This reduces the number of database queries from 2 to 1
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id, user_id, content, created_at,
        users!inner(username)
      `)
      .or(`user_id.eq.${user.id},user_id.in.(${followeeIds.length > 0 ? followeeIds.join(',') : 'null'})`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch feed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format response
    const formattedPosts = posts.map(post => ({
      id: post.id,
      userid: post.user_id,
      content: post.content,
      createdat: post.created_at,
      username: post.users.username,
    }));

    return new Response(JSON.stringify({ page, posts: formattedPosts }), {
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