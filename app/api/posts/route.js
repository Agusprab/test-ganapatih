import { supabase } from '@/utils/supabase/server';
import { getUserFromToken } from '@/utils/auth';

export async function POST(request) {
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

    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'Incomplete or invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (content.length > 200) {
      return new Response(JSON.stringify({ error: 'Incorrect input format (e.g., post > 200 characters)' }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Insert post into Supabase 'posts' table
    const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id: user.id, content }])
      .select('id, user_id, content, created_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create post' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Format response
    const response = {
      id: data.id,
      userid: data.user_id,
      content: data.content,
      createdat: data.created_at,
      username: user.username,
    };

    return new Response(JSON.stringify(response), {
      status: 201,
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