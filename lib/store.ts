import { create } from 'zustand';
import { Track, User, Playlist } from './types';
import { storage } from './storage';
import { sampleTracks } from './sampleData';

interface MusicStore {
    // User state
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    logout: () => void;

    // Playback state
    isPlaying: boolean;
    currentTrack: Track | null;
    queue: Track[];
    currentTrackIndex: number;
    volume: number;
    isShuffle: boolean;
    repeatMode: 'off' | 'all' | 'one';
    currentTime: number;
    duration: number;

    // Playback actions
    playTrack: (track: Track, queue?: Track[]) => void;
    togglePlay: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    setVolume: (volume: number) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;

    // Library state
    tracks: Track[];
    playlists: Playlist[];
    likedTrackIds: string[];
    downloadedTrackIds: string[];

    // Library actions
    initializeLibrary: () => void;
    addTrack: (track: Track) => void;
    toggleLikeTrack: (trackId: string) => void;
    toggleDownload: (trackId: string) => void;
    createPlaylist: (playlist: Playlist) => void;
    updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
    deletePlaylist: (id: string) => void;
    addTrackToPlaylist: (playlistId: string, trackId: string) => void;
    removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;

    // UI state
    showQueue: boolean;
    toggleQueue: () => void;

    // Search & filter
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    getFilteredTracks: () => Track[];
}

export const useMusicStore = create<MusicStore>((set, get) => ({
    // Initial user state
    currentUser: null,
    setCurrentUser: (user) => {
        set({ currentUser: user });
        if (user) {
            storage.setUser(user);
        }
    },
    logout: () => {
        set({ currentUser: null });
        storage.removeUser();
    },

    // Initial playback state
    isPlaying: false,
    currentTrack: null,
    queue: [],
    currentTrackIndex: 0,
    volume: 0.7,
    isShuffle: false,
    repeatMode: 'off',
    currentTime: 0,
    duration: 0,

    // Playback actions
    playTrack: (track, queue) => {
        const newQueue = queue || [track];
        const index = newQueue.findIndex(t => t.id === track.id);

        set({
            currentTrack: track,
            queue: newQueue,
            currentTrackIndex: index >= 0 ? index : 0,
            isPlaying: true,
            currentTime: 0,
        });

        // Add to history
        storage.addToHistory(track.id);
    },

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    nextTrack: () => {
        const { queue, currentTrackIndex, repeatMode, isShuffle } = get();

        if (queue.length === 0) return;

        let nextIndex = currentTrackIndex + 1;

        if (isShuffle) {
            nextIndex = Math.floor(Math.random() * queue.length);
        } else if (nextIndex >= queue.length) {
            nextIndex = repeatMode === 'all' ? 0 : currentTrackIndex;
        }

        if (nextIndex !== currentTrackIndex || repeatMode === 'one') {
            const nextTrack = queue[nextIndex];
            set({
                currentTrack: nextTrack,
                currentTrackIndex: nextIndex,
                currentTime: 0,
            });
            storage.addToHistory(nextTrack.id);
        }
    },

    previousTrack: () => {
        const { queue, currentTrackIndex, currentTime } = get();

        if (queue.length === 0) return;

        // If more than 3 seconds played, restart current track
        if (currentTime > 3) {
            set({ currentTime: 0 });
            return;
        }

        const prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : queue.length - 1;
        const prevTrack = queue[prevIndex];

        set({
            currentTrack: prevTrack,
            currentTrackIndex: prevIndex,
            currentTime: 0,
        });
        storage.addToHistory(prevTrack.id);
    },

    setVolume: (volume) => set({ volume }),
    toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
    toggleRepeat: () => set((state) => ({
        repeatMode: state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off'
    })),
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ duration }),

    // Initial library state
    tracks: [],
    playlists: [],
    likedTrackIds: [],
    downloadedTrackIds: [],

    // Library actions
    initializeLibrary: () => {
        // Init User
        let currentUser = storage.getUser();
        if (currentUser) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser.id);
            if (!isUuid) {
                console.warn("Fixing legacy User ID to UUID");
                currentUser.id = typeof crypto !== 'undefined' ? crypto.randomUUID() : currentUser.id;
                storage.setUser(currentUser);
            }
            set({ currentUser });
        }

        const storedTracks = storage.getTracks();
        const tracks = storedTracks.length > 0 ? storedTracks : sampleTracks;

        if (storedTracks.length === 0) {
            storage.setTracks(tracks);
        }

        const playlists = storage.getPlaylists();
        const likedTrackIds = storage.getLikedTracks();
        const downloadedTrackIds = storage.getDownloads();

        set({ tracks, playlists, likedTrackIds, downloadedTrackIds });
    },

    addTrack: (track) => {
        const tracks = [...get().tracks, track];
        set({ tracks });
        storage.addTrack(track);
    },

    toggleLikeTrack: (trackId) => {
        const isNowLiked = storage.toggleLikeTrack(trackId);
        const likedTrackIds = storage.getLikedTracks();
        set({ likedTrackIds });

        // Update track in library
        const tracks = get().tracks.map(t =>
            t.id === trackId ? { ...t, isLiked: isNowLiked } : t
        );
        set({ tracks });
        storage.setTracks(tracks);
    },

    toggleDownload: (trackId) => {
        storage.toggleDownload(trackId);
        const downloadedTrackIds = storage.getDownloads();
        set({ downloadedTrackIds });
    },

    createPlaylist: (playlist) => {
        const playlists = [...get().playlists, playlist];
        set({ playlists });
        storage.addPlaylist(playlist);
    },

    updatePlaylist: (id, updates) => {
        const playlists = get().playlists.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        );
        set({ playlists });
        storage.updatePlaylist(id, updates);
    },

    deletePlaylist: (id) => {
        const playlists = get().playlists.filter(p => p.id !== id);
        set({ playlists });
        storage.deletePlaylist(id);
    },

    addTrackToPlaylist: (playlistId, trackId) => {
        const playlist = get().playlists.find(p => p.id === playlistId);
        if (playlist && !playlist.trackIds.includes(trackId)) {
            const trackIds = [...playlist.trackIds, trackId];
            get().updatePlaylist(playlistId, { trackIds });
        }
    },

    removeTrackFromPlaylist: (playlistId, trackId) => {
        const playlist = get().playlists.find(p => p.id === playlistId);
        if (playlist) {
            const trackIds = playlist.trackIds.filter(id => id !== trackId);
            get().updatePlaylist(playlistId, { trackIds });
        }
    },

    // UI state
    showQueue: false,
    toggleQueue: () => set((state) => ({ showQueue: !state.showQueue })),

    // Search
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    getFilteredTracks: () => {
        const { tracks, searchQuery } = get();
        if (!searchQuery) return tracks;

        const query = searchQuery.toLowerCase();
        return tracks.filter(
            track =>
                track.title.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query) ||
                track.album.toLowerCase().includes(query) ||
                track.genre.toLowerCase().includes(query)
        );
    },
}));
