# AI Weekly Bingo Game

A weekly online bingo game where numbers are automatically called each day and players compete to get BINGO first.

## Features

- **Weekly Reset**: New game each week with unique ID format (YYYY-Wnn)
- **Daily Number Calling**: Automatic number calling based on day of week
- **Multiplayer**: Players can share User IDs to play together
- **Real-time Updates**: Live synchronization via Supabase
- **Random Bingo Cards**: Each player gets unique 5x5 card when joining
- **Winner Detection**: First BINGO wins the week

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Styling**: Tailwind CSS (via CDN)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Anonymous Auth
- **Deployment**: Vercel

## Setup

### 1. Supabase Configuration

1. Create a new Supabase project
2. Run the SQL commands in `schema.sql` to set up the database
3. Enable anonymous authentication in your Supabase dashboard
4. Copy your project URL and anon key

### 2. Local Development

1. Clone this repository
2. Copy `.env.example` to `.env`
3. Fill in your Supabase credentials in `.env`
4. Open `index.html` in a web server (not directly in browser due to CORS)

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
4. Deploy!

The app will automatically load configuration from the `/api/config` endpoint in production.

## Security

- Supabase credentials are served via a secure API endpoint (`/api/config.js`)
- Environment variables are only accessible server-side
- No sensitive data is exposed in the client-side code
- Anonymous authentication prevents user data exposure

## Game Rules

- New games start every Monday
- Numbers are called automatically each day (1 on Monday, 2 by Tuesday, etc.)
- First player to get BINGO wins the week
- Games reset automatically for the next week