# Full Stack Challenge - React + TypeScript + Supabase

A search and favorites application built with React, TypeScript, TanStack Query, and Supabase.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Copy `.env.example` to `.env.local`
   - Add your Supabase project URL and anon key to `.env.local`
   - Run the SQL script in `database.sql` in your Supabase SQL editor

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLIENT_ID=client_123456789
```

## Database Schema

The application uses two tables:

- **`items`**: Contains items with id, title, category, rating, and updated_at
- **`favorites`**: Tracks favorites per client_id with composite primary key

See `database.sql` for the complete schema and sample data.

## Features

- Search items by title (case-insensitive, debounced)
- Sort by rating or title (ascending/descending)
- Pagination (10 items per page)
- Optimistic favorites toggle
- Loading, error, and empty states
- Keyboard accessible controls
- TypeScript throughout

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: TanStack Query v5
- **Backend**: Supabase
- **Styling**: CSS (customizable)
