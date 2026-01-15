# Musiq - Quick Start Guide

## PowerShell Execution Policy Issue

If you see errors about "running scripts is disabled", you need to enable script execution temporarily.

### Option 1: Use Batch Files (Recommended)

1. Double-click `install.bat` to install dependencies
2. Double-click `dev.bat` to start the development server

### Option 2: Enable PowerShell Scripts (One-time setup)

Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then you can use npm commands normally:
```bash
npm install
npm run dev
```

### Option 3: Bypass for Current Session

Open PowerShell (normal, not admin) and run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
npm run dev
```

## After Installation

1. Open your browser to http://localhost:3000
2. Click "Get Started" or "Log in"
3. Enter any email/password (demo mode)
4. Start exploring and streaming music!

## Features to Try

✅ Browse featured and trending tracks
✅ Search for songs by name, artist, or genre
✅ Create playlists and add tracks
✅ Like songs with the heart icon
✅ View your listening history
✅ Use the bottom player controls

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing?**
- Make sure Node.js is installed (v18+)
- Try deleting `node_modules` and `package-lock.json`, then reinstall

**App not loading?**
- Clear browser cache
- Check console for errors
- Make sure you're on http://localhost:3000

## Default Credentials (Demo Mode)

Any email and password will work! Examples:
- demo@musiq.com / demo123
- test@test.com / password
- user@example.com / 123456

## Next Steps

Once the app is running:
1. **Explore the Dashboard** - See featured and trending tracks
2. **Search** - Find music by song, artist, or genre
3. **Create a Playlist** - Go to Library → Create Playlist
4. **Like Songs** - Click hearts on tracks you enjoy
5. **Check History** - View what you've been listening to

Enjoy your music! 🎵
