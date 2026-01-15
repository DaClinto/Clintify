'use client';

import { useMusicStore } from '@/lib/store';
import TrackCard from '@/components/TrackCard';
import { Music, Heart, Clock, ListMusic } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
    const { tracks, playlists, likedTrackIds } = useMusicStore();

    const likedTracks = tracks.filter(t => likedTrackIds.includes(t.id));

    return (
        <div className="min-h-full p-8 space-y-8">
            <h1 className="text-4xl font-bold">Your Library</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-6">
                    <Music className="w-8 h-8 text-primary mb-3" />
                    <p className="text-3xl font-bold">{tracks.length}</p>
                    <p className="text-muted-foreground">Total Tracks</p>
                </div>
                <div className="glass rounded-xl p-6">
                    <Heart className="w-8 h-8 text-pink-500 mb-3" />
                    <p className="text-3xl font-bold">{likedTracks.length}</p>
                    <p className="text-muted-foreground">Liked Songs</p>
                </div>
                <div className="glass rounded-xl p-6">
                    <ListMusic className="w-8 h-8 text-purple-500 mb-3" />
                    <p className="text-3xl font-bold">{playlists.length}</p>
                    <p className="text-muted-foreground">Playlists</p>
                </div>
                <div className="glass rounded-xl p-6">
                    <Clock className="w-8 h-8 text-blue-500 mb-3" />
                    <p className="text-3xl font-bold">{Math.floor(tracks.reduce((sum, t) => sum + t.duration, 0) / 3600)}h</p>
                    <p className="text-muted-foreground">Total Time</p>
                </div>
            </div>

            {/* Playlists */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Your Playlists</h2>
                    <Link
                        href="/app/playlist/new"
                        className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-full font-semibold transition-all hover:scale-105"
                    >
                        Create Playlist
                    </Link>
                </div>

                {playlists.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {playlists.map((playlist) => {
                            const playlistTracks = tracks.filter(t => playlist.trackIds.includes(t.id));
                            const coverUrl = playlistTracks[0]?.coverUrl || playlist.coverUrl;

                            return (
                                <Link
                                    key={playlist.id}
                                    href={`/app/playlist/${playlist.id}`}
                                    className="glass rounded-lg p-4 card-hover group"
                                >
                                    <div
                                        className="aspect-square rounded-md mb-4 bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center overflow-hidden"
                                        style={{
                                            backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                                            backgroundSize: 'cover',
                                        }}
                                    >
                                        {!coverUrl && <ListMusic className="w-16 h-16 text-muted-foreground" />}
                                    </div>
                                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                        {playlist.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {playlist.trackIds.length} {playlist.trackIds.length === 1 ? 'track' : 'tracks'}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 glass rounded-xl">
                        <ListMusic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-xl text-muted-foreground mb-4">
                            You haven&apos;t created any playlists yet
                        </p>
                        <Link
                            href="/app/playlist/new"
                            className="btn-primary inline-flex"
                        >
                            Create Your First Playlist
                        </Link>
                    </div>
                )}
            </section>

            {/* All Tracks */}
            <section>
                <h2 className="text-2xl font-bold mb-6">All Tracks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {tracks.map((track, index) => (
                        <TrackCard key={track.id} track={track} index={index} />
                    ))}
                </div>
            </section>
        </div>
    );
}
