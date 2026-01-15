// LocalStorage utility for temporary data persistence

const STORAGE_KEYS = {
    USER: 'musiq_user',
    TRACKS: 'musiq_tracks',
    PLAYLISTS: 'musiq_playlists',
    LIKED_TRACKS: 'musiq_liked_tracks',
    DOWNLOADS: 'musiq_downloads',
    HISTORY: 'musiq_history',
} as const;

class StorageManager {
    // Generic get/set methods with type safety
    private get<T>(key: string): T | null {
        if (typeof window === 'undefined') return null;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return null;
        }
    }

    private set<T>(key: string, value: T): void {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing ${key} to localStorage:`, error);
        }
    }

    private remove(key: string): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    }

    // User methods
    getUser() {
        return this.get<any>(STORAGE_KEYS.USER);
    }

    setUser(user: any) {
        this.set(STORAGE_KEYS.USER, user);
    }

    removeUser() {
        this.remove(STORAGE_KEYS.USER);
    }

    // Tracks methods
    getTracks() {
        return this.get<any[]>(STORAGE_KEYS.TRACKS) || [];
    }

    setTracks(tracks: any[]) {
        this.set(STORAGE_KEYS.TRACKS, tracks);
    }

    addTrack(track: any) {
        const tracks = this.getTracks();
        tracks.push(track);
        this.setTracks(tracks);
    }

    // Playlists methods
    getPlaylists() {
        return this.get<any[]>(STORAGE_KEYS.PLAYLISTS) || [];
    }

    setPlaylists(playlists: any[]) {
        this.set(STORAGE_KEYS.PLAYLISTS, playlists);
    }

    addPlaylist(playlist: any) {
        const playlists = this.getPlaylists();
        playlists.push(playlist);
        this.setPlaylists(playlists);
    }

    updatePlaylist(id: string, updates: Partial<any>) {
        const playlists = this.getPlaylists();
        const index = playlists.findIndex(p => p.id === id);
        if (index !== -1) {
            playlists[index] = { ...playlists[index], ...updates, updatedAt: new Date().toISOString() };
            this.setPlaylists(playlists);
        }
    }

    deletePlaylist(id: string) {
        const playlists = this.getPlaylists();
        this.setPlaylists(playlists.filter(p => p.id !== id));
    }

    // Liked tracks methods
    getLikedTracks() {
        return this.get<string[]>(STORAGE_KEYS.LIKED_TRACKS) || [];
    }

    setLikedTracks(trackIds: string[]) {
        this.set(STORAGE_KEYS.LIKED_TRACKS, trackIds);
    }

    toggleLikeTrack(trackId: string) {
        const liked = this.getLikedTracks();
        const index = liked.indexOf(trackId);

        if (index > -1) {
            liked.splice(index, 1);
        } else {
            liked.push(trackId);
        }

        this.setLikedTracks(liked);
        return index === -1; // Return true if now liked
    }

    isTrackLiked(trackId: string) {
        return this.getLikedTracks().includes(trackId);
    }

    // Downloads methods
    getDownloads() {
        return this.get<string[]>(STORAGE_KEYS.DOWNLOADS) || [];
    }

    setDownloads(trackIds: string[]) {
        this.set(STORAGE_KEYS.DOWNLOADS, trackIds);
    }

    toggleDownload(trackId: string) {
        const downloads = this.getDownloads();
        const index = downloads.indexOf(trackId);

        if (index > -1) {
            downloads.splice(index, 1);
        } else {
            downloads.push(trackId);
        }

        this.setDownloads(downloads);
        return index === -1;
    }

    isDownloaded(trackId: string) {
        return this.getDownloads().includes(trackId);
    }

    // History methods
    getHistory() {
        return this.get<any[]>(STORAGE_KEYS.HISTORY) || [];
    }

    addToHistory(trackId: string) {
        const history = this.getHistory();
        history.unshift({
            trackId,
            playedAt: new Date().toISOString(),
        });
        // Keep only last 50 items
        this.set(STORAGE_KEYS.HISTORY, history.slice(0, 50));
    }

    clearHistory() {
        this.set(STORAGE_KEYS.HISTORY, []);
    }

    // Clear all data
    clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => this.remove(key));
    }
}

export const storage = new StorageManager();
