// Data types for the application

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
}

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    genre: string;
    duration: number; // in seconds
    audioUrl: string;
    coverUrl: string;
    playCount: number;
    isLiked: boolean;
    description?: string;
    posted_by?: string;
    created_at?: string;
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    trackIds: string[];
    coverUrl: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ListeningHistory {
    trackId: string;
    playedAt: string;
}

export interface AppState {
    currentUser: User | null;
    isPlaying: boolean;
    currentTrack: Track | null;
    queue: Track[];
    currentTrackIndex: number;
    volume: number;
    isShuffle: boolean;
    repeatMode: 'off' | 'all' | 'one';
    currentTime: number;
}
