'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMusicStore } from '@/lib/store';
import { TrackRow } from '@/components/TrackCard';
import { Play, MoreVertical, Edit2, Trash2, Plus, ListMusic } from 'lucide-react';
import Link from 'next/link';

export default function PlaylistPage() {
    const router = useRouter();
    const params = useParams();
    const playlistId = params.id as string;

    const { tracks, playlists, playTrack, deletePlaylist, updatePlaylist, addTrackToPlaylist, removeTrackFromPlaylist } = useMusicStore();
    const [showAddTracks, setShowAddTracks] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-center">
                    <ListMusic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-xl text-muted-foreground">Playlist not found</p>
                    <Link href="/app/library" className="btn-primary mt-4 inline-flex">
                        Back to Library
                    </Link>
                </div>
            </div>
        );
    }

    const playlistTracks = tracks.filter(t => playlist.trackIds.includes(t.id));
    const availableTracks = tracks.filter(t => !playlist.trackIds.includes(t.id));
    const coverUrl = playlistTracks[0]?.coverUrl;

    const handlePlayAll = () => {
        if (playlistTracks.length > 0) {
            playTrack(playlistTracks[0], playlistTracks);
        }
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
            deletePlaylist(playlist.id);
            router.push('/app/library');
        }
    };

    const handleAddTrack = (trackId: string) => {
        addTrackToPlaylist(playlist.id, trackId);
    };

    const handleRemoveTrack = (trackId: string) => {
        removeTrackFromPlaylist(playlist.id, trackId);
    };

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/20 to-transparent px-8 pt-20 pb-8">
                <div className="flex items-end gap-6">
                    <div
                        className="w-56 h-56 rounded-lg bg-gradient-to-br from-primary/30 to-purple-600/30 flex items-center justify-center shadow-2xl overflow-hidden"
                        style={{
                            backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {!coverUrl && <ListMusic className="w-28 h-28 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold uppercase">{playlist.isPublic ? 'Public' : 'Private'} Playlist</p>
                        <h1 className="text-6xl font-bold my-4">{playlist.name}</h1>
                        {playlist.description && (
                            <p className="text-muted-foreground mb-2">{playlist.description}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                            {playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'song' : 'songs'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="px-8 py-6 flex items-center gap-4">
                {playlistTracks.length > 0 && (
                    <button
                        onClick={handlePlayAll}
                        className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center shadow-2xl"
                    >
                        <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                    </button>
                )}

                <button
                    onClick={() => setShowAddTracks(!showAddTracks)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Tracks
                </button>

                <div className="relative ml-auto">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-3 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <MoreVertical className="w-6 h-6" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 glass rounded-lg overflow-hidden shadow-2xl z-10">
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    // Edit functionality would go here
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Details
                            </button>
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    handleDelete();
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-red-400"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Playlist
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Tracks Panel */}
            {showAddTracks && (
                <div className="px-8 mb-6">
                    <div className="glass rounded-lg p-6 max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Add Tracks to Playlist</h3>
                        {availableTracks.length > 0 ? (
                            <div className="space-y-1">
                                {availableTracks.slice(0, 20).map((track, index) => (
                                    <div
                                        key={track.id}
                                        className="flex items-center gap-4 px-4 py-3 rounded hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex-1 flex items-center gap-3 min-w-0">
                                            <p className="font-medium truncate">{track.title}</p>
                                            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddTrack(track.id)}
                                            className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-full text-sm font-semibold transition-all"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">
                                All tracks are already in this playlist
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Track List */}
            <div className="px-8 pb-8">
                {playlistTracks.length > 0 ? (
                    <div className="space-y-1">
                        {playlistTracks.map((track, index) => (
                            <div key={track.id} className="group relative">
                                <TrackRow track={track} index={index} />
                                <button
                                    onClick={() => handleRemoveTrack(track.id)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full text-sm font-semibold transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <ListMusic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-xl text-muted-foreground mb-2">
                            This playlist is empty
                        </p>
                        <button
                            onClick={() => setShowAddTracks(true)}
                            className="btn-primary mt-4"
                        >
                            Add Tracks
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
