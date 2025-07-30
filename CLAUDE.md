# AI Weekly Bingo Game

## Project Overview
A weekly online bingo game where numbers are automatically called each day and players compete to get BINGO first.

## Core Features
- **Weekly Reset**: New game each week with unique ID format (YYYY-Wnn)
- **Daily Number Calling**: Automatic number calling based on day of week (1 on Monday, 2 by Tuesday, etc.)
- **Multiplayer**: Players can share User IDs to play together
- **Real-time Updates**: Supabase real-time subscriptions for live synchronization
- **Random Bingo Cards**: Each player gets unique 5x5 card when joining
- **Winner Detection**: First BINGO wins the week

## Technical Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Styling**: Tailwind CSS (via CDN)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Anonymous Auth
- **Font**: Inter (Google Fonts)

## File Structure
```
/bingo/
├── index.html        # Main HTML file for the web application
├── schema.sql        # Supabase database schema and setup
├── Bingo.md          # Original file (legacy)
├── CLAUDE.md         # This project documentation
└── [future files]    # Additional components as needed
```

## Game States
1. **Loading**: Connecting to Supabase
2. **Play State**: Join button for current week's game
3. **Active Game**: Show bingo card, called numbers, progress
4. **Game Over**: Display winner information

## Supabase Database Schema
```sql
-- Games table (one record per week)
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id TEXT UNIQUE NOT NULL,           -- e.g., "2025-W30"
  called_numbers TEXT[] DEFAULT '{}',     -- Array of called numbers like ["B5", "I19"]
  winner_user_id UUID,                    -- References auth.users.id
  winner_timestamp TIMESTAMPTZ,
  last_called_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table (one record per player per game)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  board JSONB NOT NULL,                   -- 5x5 bingo board array
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_games_week_id ON games(week_id);
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_players_user_id ON players(user_id);
```

## Key Functions
- `getWeekId()`: Generate week identifier (YYYY-Wnn format)
- `generateBingoBoard()`: Create random valid bingo card
- `checkWin()`: Verify if player has BINGO
- `runDailyNumberCall()`: Automatic number calling logic
- `renderBoard()`: Display player's card with marked numbers
- `renderCalledNumbers()`: Show all called numbers

## Development Notes
- Main web application: `index.html` (complete HTML file)
- Uses Supabase JavaScript client via CDN
- Responsive design with mobile support
- Game resets automatically each Monday
- Numbers called deterministically based on day of week

## Environment Setup
- Requires Supabase project with:
  - Anonymous authentication enabled
  - Row Level Security (RLS) policies configured
  - Real-time subscriptions enabled for games and players tables

## Supabase Configuration
```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```