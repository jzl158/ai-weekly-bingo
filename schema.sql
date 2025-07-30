-- AI Weekly Bingo - Supabase Database Schema

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Games table (one record per week)
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id TEXT UNIQUE NOT NULL,           -- e.g., "2025-W30"
  called_numbers TEXT[] DEFAULT '{}',     -- Array of called numbers like ["B5", "I19"]
  winner_user_id UUID REFERENCES auth.users(id),
  winner_timestamp TIMESTAMPTZ,
  last_called_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table (one record per player per game)
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  board JSONB NOT NULL,                   -- 5x5 bingo board array
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_games_week_id ON public.games(week_id);
CREATE INDEX idx_players_game_id ON public.players(game_id);
CREATE INDEX idx_players_user_id ON public.players(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Games table policies
-- Anyone can read games (for viewing current week's state)
CREATE POLICY "Games are viewable by everyone" ON public.games
  FOR SELECT USING (true);

-- Only authenticated users can insert games (for creating weekly games)
CREATE POLICY "Authenticated users can insert games" ON public.games
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update games (for calling numbers and declaring winners)
CREATE POLICY "Authenticated users can update games" ON public.games
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Players table policies
-- Users can view all players in any game (for transparency)
CREATE POLICY "Players are viewable by everyone" ON public.players
  FOR SELECT USING (true);

-- Users can only insert themselves as players
CREATE POLICY "Users can insert themselves as players" ON public.players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own player records
CREATE POLICY "Users can update own player records" ON public.players
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own player records
CREATE POLICY "Users can delete own player records" ON public.players
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON public.games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time subscriptions for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;