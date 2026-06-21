-- Skill Share Board Database Setup
-- Run this in your Supabase SQL Editor

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

-- Create policies for security
CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Users can insert their own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON skills FOR DELETE USING (auth.uid() = user_id);

-- Optional: Insert some sample data (remove user_id or replace with actual user ID after creating an account)
-- INSERT INTO skills (title, description, category, contact, user_id) VALUES
-- ('React Development', 'I can help you learn React hooks, state management, and component architecture', 'Web Dev', 'john@example.com', 'your-user-id-here'),
-- ('Algorithm Design', 'Teaching data structures and algorithms for coding interviews', 'DSA', 'alice@example.com', 'your-user-id-here'),
-- ('UI/UX Design', 'Figma, user research, and design systems', 'Design', 'bob@example.com', 'your-user-id-here');