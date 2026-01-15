import { Track } from './types';

// Sample music tracks with free audio URLs
export const sampleTracks: Track[] = [
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c1',
        title: 'Midnight Dreams',
        artist: 'Aurora Waves',
        album: 'Dreamscape',
        genre: 'Electronic',
        duration: 240,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&h=500&fit=crop',
        playCount: 1240,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c2',
        title: 'Electric Pulse',
        artist: 'Neon Lights',
        album: 'Voltage',
        genre: 'Electronic',
        duration: 195,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
        playCount: 890,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c3',
        title: 'Ocean Waves',
        artist: 'Calm Collective',
        album: 'Serenity',
        genre: 'Ambient',
        duration: 320,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
        playCount: 2100,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c4',
        title: 'Urban Rhythm',
        artist: 'City Beats',
        album: 'Street Sounds',
        genre: 'Hip Hop',
        duration: 210,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
        playCount: 3400,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c5',
        title: 'Jazz Lounge',
        artist: 'Smooth Operators',
        album: 'Late Night',
        genre: 'Jazz',
        duration: 280,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&h=500&fit=crop',
        playCount: 1560,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c6',
        title: 'Summer Vibes',
        artist: 'Tropical Dreams',
        album: 'Paradise',
        genre: 'Pop',
        duration: 200,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop',
        playCount: 5200,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c7',
        title: 'Rock Anthem',
        artist: 'Thunder Strike',
        album: 'Lightning',
        genre: 'Rock',
        duration: 250,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&h=500&fit=crop',
        playCount: 4100,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c8',
        title: 'Classical Journey',
        artist: 'Symphony Orchestra',
        album: 'Masterpieces',
        genre: 'Classical',
        duration: 360,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=500&fit=crop',
        playCount: 890,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8c9',
        title: 'Morning Coffee',
        artist: 'Acoustic Soul',
        album: 'Unplugged',
        genre: 'Acoustic',
        duration: 180,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop',
        playCount: 2800,
        isLiked: false,
    },
    {
        id: '6489a8c2-37f2-4e4b-9e4a-5b4d8c89a8d0',
        title: 'Night Drive',
        artist: 'Synthwave Heroes',
        album: 'Retrowave',
        genre: 'Electronic',
        duration: 270,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
        playCount: 6700,
        isLiked: false,
    },
];

// Utility functions
export const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const generateId = (): string => {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).substr(2);
};
