# Skill Share Board

A simple MVP web app where users can share skills and others can browse them. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Authentication**: Email/password login with Supabase Auth
- **Post Skills**: Logged-in users can share their skills with title, description, category, and contact info
- **Browse Skills**: View all shared skills in a clean card layout
- **Filter by Category**: Filter skills by Web Dev, DSA, Design, or AI
- **My Posts**: Users can view and delete their own posts
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Supabase (Database + Authentication)
- **Deployment**: Ready for Vercel deployment

## Quick Setup

### 1. Clone and Install

```bash
cd skill-share-board
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to **Settings** > **API**
3. Copy your **Project URL** and **anon public** key

### 3. Create Database Table

In your Supabase dashboard, go to **SQL Editor** and run this query:

```sql
-- Create skills table
CREATE TABLE skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  contact TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Users can insert their own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON skills FOR DELETE USING (auth.uid() = user_id);
```

### 4. Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up**: Click "Sign Up" and create an account with email/password
2. **Sign In**: Use your credentials to log in
3. **Share a Skill**: Click "Share a Skill" button when logged in
4. **Browse Skills**: View all skills on the homepage
5. **Filter**: Use category buttons to filter skills
6. **My Posts**: View and manage your own posts via the "My Posts" link

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.js             # Homepage with skills feed
│   └── my-posts/
│       └── page.js         # User's posts page
├── components/
│   ├── Navbar.js           # Navigation with auth
│   ├── SkillCard.js        # Individual skill display
│   └── SkillForm.js        # Form to post new skills
└── lib/
    └── supabaseClient.js   # Supabase configuration
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Development Notes

- Uses Next.js App Router for modern React patterns
- Client-side components for interactivity
- Supabase handles all backend logic (auth + database)
- Row Level Security ensures users can only modify their own posts
- Simple prompt-based auth for MVP speed (can be enhanced later)

## Future Enhancements

- Better auth UI (modal forms instead of prompts)
- Image uploads for skills
- User profiles
- Skill ratings/reviews
- Search functionality
- Email notifications

## License

MIT License - feel free to use this as a starting point for your own projects!# skillshare
