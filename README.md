# Musiq - Premium Music Streaming Web App

A modern, professional music streaming application built with Next.js 14, featuring a Spotify-inspired UI with dark mode, client-side playback, and temporary localStorage-based data persistence.

## Features

### 🎵 Core Functionality
- **Demo Authentication**: Fake authentication with localStorage session management
- **Music Playback Engine**: Full-featured HTML5 audio player with:
  - Play/pause, next/previous track
  - Seek bar with time display
  - Volume control
  - Shuffle and repeat modes (off/all/one)
  - Persistent playback across page navigation
- **Music Library**: Browse and stream sample tracks
- **Search & Discovery**: Real-time search by song, artist, album, or genre
- **Playlists**: Create, edit, and manage playlists (client-side only)
- **Liked Songs**: Like/unlike tracks with heart icon
- **Listening History**: Track recently played songs with timestamps

### 🎨 UI/UX
- **Dark Mode First**: Premium dark theme with gradient accents
- **Glassmorphism Effects**: Modern glass-style UI components
- **Smooth Animations**: Micro-animations and transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Sticky Audio Player**: Fixed bottom player accessible from all pages
- **Grid & List Views**: Toggle between different viewing modes

### 📱 Pages
1. **Landing Page**: Marketing page with features and CTA
2. **Login/Register**: Demo authentication pages
3. **Dashboard**: Personalized home with:
   - Recently played tracks
   - Featured content
   - Trending music
   - Genre browser
4. **Search**: Search tracks with real-time filtering
5. **Library**: View all tracks, playlists, and stats
6. **Liked Songs**: Collection of favorited tracks
7. **History**: Recently played tracks with timestamps
8. **Playlist Details**: View and manage individual playlists
9. **Create Playlist**: Form to create new playlists

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Storage**: localStorage (temporary)
- **Audio**: HTML5 Audio API

## Project Structure

```
musiq/
├── app/
│   ├── (public routes)
│   │   ├── page.tsx          # Landing page
│   │   ├── login/
│   │   └── register/
│   ├── app/                   # Authenticated app routes
│   │   ├── layout.tsx         # App shell with sidebar + player
│   │   ├── page.tsx           # Dashboard
│   │   ├── search/
│   │   ├── library/
│   │   │   ├── page.tsx
│   │   │   ├── liked/
│   │   │   └── history/
│   │   └── playlist/
│   │       ├── new/
│   │       └── [id]/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── AudioPlayer.tsx        # Global audio player
│   ├── Sidebar.tsx            # Navigation sidebar
│   └── TrackCard.tsx          # Track grid/list components
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── storage.ts             # localStorage wrapper
│   ├── store.ts               # Zustand state management
│   └── sampleData.ts          # Sample tracks
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Data Models

### User
```typescript
{
  id: string
  name: string
  email: string
  avatar: string
  createdAt: string
}
```

### Track
```typescript
{
  id: string
  title: string
  artist: string
  album: string
  genre: string
  duration: number
  audioUrl: string
  coverUrl: string
  playCount: number
  isLiked: boolean
}
```

### Playlist
```typescript
{
  id: string
  name: string
  description: string
  trackIds: string[]
  coverUrl: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Usage

1. **Landing Page**: Visit the app and click "Get Started" or "Log in"
2. **Demo Login**: Enter any email/password (demo mode - all credentials work)
3. **Browse Music**: Explore the dashboard with featured and trending tracks
4. **Play Music**: Click any track to start playback
5. **Search**: Use the search page to find specific songs
6. **Create Playlist**: Go to Library → Create Playlist
7. **Like Songs**: Click the heart icon on any track
8. **View History**: Check your recently played tracks

## Storage

All data is stored in **localStorage**:
- `musiq_user`: Current user session
- `musiq_tracks`: Track library
- `musiq_playlists`: User playlists
- `musiq_liked_tracks`: Liked track IDs
- `musiq_history`: Listening history

**Note**: Data resets when localStorage is cleared.

## Sample Data

The app comes with 10 pre-loaded sample tracks using:
- Free audio from soundhelix.com
- Cover images from Unsplash
- Various genres (Electronic, Rock, Pop, Jazz, Hip Hop, etc.)

## Future Backend Integration

The app is designed to easily swap localStorage with a real backend:
- Replace `lib/storage.ts` with API calls
- Update `lib/store.ts` to use server state
- Add authentication with JWT/OAuth
- Connect to Firebase, Supabase, or custom API

## Design Features

- **Color System**: HSL-based with CSS custom properties
- **Typography**: System font stack with smooth antialiasing
- **Gradients**: Primary green to emerald accent colors
- **Spacing**: Consistent gap tokens (2, 4, 6, 8)
- **Animations**: Slide-up, slide-in, and fade-in effects
- **Hover States**: Scale transforms and color transitions

## License

This is a demo/portfolio project. Free to use and modify.

## Credits

- UI Design inspired by Spotify and Apple Music
- Sample audio from [SoundHelix](https://www.soundhelix.com/)
- Images from [Unsplash](https://unsplash.com/)
- Icons from [Lucide](https://lucide.dev/)
