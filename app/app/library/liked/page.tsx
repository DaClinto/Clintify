'use client';

import { useMusicStore } from '@/lib/store';
import { TrackRow } from '@/components/TrackCard';
import { Heart, Play } from 'lucide-react';

export default function LikedSongsPage() {
    const { tracks, likedTrackIds, playTrack } = useMusicStore();

    const likedTracks = tracks.filter(t => likedTrackIds.includes(t.id));

    const handlePlayAll = () => {
        if (likedTracks.length > 0) {
            playTrack(likedTracks[0], likedTracks);
        }
    };

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="bg-gradient-to-b from-purple-900/40 to-transparent px-8 pt-20 pb-8">
                <div className="flex items-end gap-6">
                    <div className="w-56 h-56 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                        <Heart className="w-28 h-28 text-white fill-white" />
                    </div>
                    <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold uppercase">Playlist</p>
                        <h1 className="text-6xl font-bold my-4">Liked Songs</h1>
                        <p className="text-muted-foreground">
                            {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="px-8 py-6 flex items-center gap-4">
                {likedTracks.length > 0 && (
                    <button
                        onClick={handlePlayAll}
                        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center shadow-2xl"
                    >
                        <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                    </button>
                )}
            </div>

            {/* Track List */}
            <div className="px-8 pb-8">
                {likedTracks.length > 0 ? (
                    <div className="space-y-1">
                        {likedTracks.map((track, index) => (
                            <TrackRow key={track.id} track={track} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-xl text-muted-foreground mb-2">
                            No liked songs yet
                        </p>
                        <p className="text-muted-foreground">
                            Songs you like will appear here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
