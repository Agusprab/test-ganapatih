# Ganapatih Social Media App

A full-stack social media application built with Next.js, TypeScript, Supabase, and Tailwind CSS. Features include user authentication, real-time feed, follow/unfollow system, and infinite scroll.

## 🚀 Features

- **User Authentication**: JWT-based login/register with auto-redirect
- **Real-time Feed**: Infinite scroll with posts from followed users
- **Social Interactions**: Follow/unfollow users, like posts
- **Profile Management**: View followers, following, and user profiles
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Hooks** - Custom hooks for reusable logic

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database with real-time features
- **JWT** - JSON Web Tokens for authentication

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ganapatih-social-app.git
cd ganapatih-social-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup

Run the migration scripts in Supabase:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create follows table
CREATE TABLE follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  followee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, followee_id)
);

-- Create indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_followee_id ON follows(followee_id);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 API Documentation

### Authentication Endpoints

#### POST /api/register
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "string"
}
```

#### POST /api/login
Login user.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token"
}
```

### Feed Endpoints

#### GET /api/feed?page=1&limit=10
Get paginated feed posts.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "page": 1,
  "posts": [
    {
      "id": "uuid",
      "userid": "uuid",
      "content": "string",
      "createdat": "timestamp",
      "username": "string"
    }
  ]
}
```

#### POST /api/posts
Create a new post.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "string"
}
```

### Social Endpoints

#### POST /api/follow/[userid]
Follow a user.

#### DELETE /api/follow/[userid]
Unfollow a user.

#### GET /api/get-followers
Get user's followers.

#### GET /api/following
Get users that user follows.

#### GET /api/get-user
Get all users.

## 🧪 Testing

### Test Cases

See `TEST_CASES.md` for detailed test scenarios that have been tested.


## 🎨 Design Notes

### UI/UX Principles
- **Minimalist Design**: Clean, distraction-free interface
- **Responsive**: Works on all device sizes
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Fast**: Optimized loading with infinite scroll

### Component Architecture
- **Reusable Components**: Button, Input, Icon components
- **Custom Hooks**: useAuth, useInfiniteScroll
- **State Management**: Redux for global state, local state for UI

### Performance Optimizations
- **Infinite Scroll**: Load posts on demand
- **Lazy Loading**: Components loaded as needed
- **Caching**: API responses cached where appropriate
- **Database Optimization**: Efficient queries with JOINs and proper indexing
- **Query Optimization**: Single query for feed data using OR conditions instead of multiple queries

### Database Query Optimization

The feed API uses optimized queries to minimize database calls:

```sql
-- Optimized feed query (single query instead of two)
SELECT p.id, p.user_id, p.content, p.created_at, u.username
FROM posts p
INNER JOIN users u ON p.user_id = u.id
WHERE p.user_id = $1 OR p.user_id IN (
  SELECT followee_id FROM follows WHERE follower_id = $1
)
ORDER BY p.created_at DESC
LIMIT $2 OFFSET $3;
```

**Indexes created for optimal performance:**
- `idx_posts_user_id` on posts(user_id)
- `idx_posts_created_at` on posts(created_at DESC)
- `idx_follows_follower_id` on follows(follower_id)
- `idx_follows_followee_id` on follows(followee_id)

## 🚀 Deployment

### CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

#### Automated CI/CD Features:
- **Automated Testing**: Runs on every push and pull request
- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Linting & Type Checking**: Ensures code quality
- **Build Verification**: Verifies application builds successfully
- **Auto-deployment**: Deploys to Vercel on main branch pushes



