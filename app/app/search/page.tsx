'use client';

import { useState } from 'react';
import { useMusicStore } from '@/lib/store';
import TrackCard, { TrackRow } from '@/components/TrackCard';
import { Search as SearchIcon, Grid, List } from 'lucide-react';

export default function SearchPage() {
    const { tracks, searchQuery, setSearchQuery } = useMusicStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredTracks = searchQuery
        ? tracks.filter(track => {
            const query = searchQuery.toLowerCase();
            return (
                track.title.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query) ||
                track.album.toLowerCase().includes(query) ||
                track.genre.toLowerCase().includes(query)
            );
        })
        : tracks;

    const genres = Array.from(new Set(tracks.map(t => t.genre)));

    return (
        <div className="min-h-full p-8 space-y-8">
            {/* Search Header */}
            <div className="space-y-6">
                <h1 className="text-4xl font-bold">Search</h1>

                {/* Search Input */}
                <div className="relative max-w-2xl">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for songs, artists, or albums..."
                        className="input-field w-full pl-12 pr-4 py-4 text-lg"
                        autoFocus
                    />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                            ? 'bg-white/10 text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            }`}
                    >
                        <Grid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                            ? 'bg-white/10 text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                            }`}
                    >
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Results or Browse */}
            {searchQuery ? (
                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        {filteredTracks.length} {filteredTracks.length === 1 ? 'result' : 'results'} for &quot;{searchQuery}&quot;
                    </h2>

                    {filteredTracks.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filteredTracks.map((track, index) => (
                                    <TrackCard key={track.id} track={track} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredTracks.map((track, index) => (
                                    <TrackRow key={track.id} track={track} index={index} />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-muted-foreground">
                                No results found for &quot;{searchQuery}&quot;
                            </p>
                            <p className="text-muted-foreground mt-2">
                                Try searching for something else
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Browse All</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {genres.map((genre) => {
                            const genreTracks = tracks.filter(t => t.genre === genre);
                            const coverUrl = genreTracks[0]?.coverUrl;

                            return (
                                <button
                                    key={genre}
                                    onClick={() => setSearchQuery(genre)}
                                    className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 p-6 flex flex-col items-start justify-end glass card-hover relative overflow-hidden group"
                                    style={{
                                        backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-bold group-hover:scale-105 transition-transform">
                                            {genre}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {genreTracks.length} tracks
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
