'use client';

import { useEffect, useState } from 'react';
import { useMusicStore } from '@/lib/store';
import { TrackRow } from '@/components/TrackCard';
import { Download, Music, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Track } from '@/lib/types';

export default function DownloadsPage() {
    const { tracks: sampleTracks, downloadedTrackIds } = useMusicStore();
    const [downloadedTracks, setDownloadedTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchDownloadedTracks() {
            setLoading(true);
            try {
                // 1. Get tracks from sample data
                const sampleMatched = sampleTracks.filter(t => downloadedTrackIds.includes(t.id));

                // 2. Fetch tracks from Supabase that match downloaded IDs but aren't in samples
                const remainingIds = downloadedTrackIds.filter(id => {
                    const isSample = sampleTracks.some(t => t.id === id);
                    // Only keep IDs that are not samples and look like a UUID (8-4-4-4-12 format)
                    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
                    return !isSample && isUuid;
                });

                let supabaseTracks: Track[] = [];
                if (remainingIds.length > 0) {
                    const { data, error } = await supabase
                        .from('songs')
                        .select('*')
                        .in('id', remainingIds);

                    if (data && !error) {
                        supabaseTracks = data.map(song => ({
                            id: song.id,
                            title: song.title,
                            artist: song.artist,
                            album: 'Original Upload',
                            coverUrl: song.image_url,
                            audioUrl: song.audio_url,
                            duration: 0,
                            genre: 'Upload',
                            playCount: 0,
                            isLiked: false
                        }));
                    }
                }

                setDownloadedTracks([...sampleMatched, ...supabaseTracks]);
            } catch (error) {
                console.error('Error fetching downloaded tracks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDownloadedTracks();
    }, [downloadedTrackIds, sampleTracks]);

    const filteredTracks = downloadedTracks.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-full pb-32">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/20 to-transparent px-8 pt-12 pb-8">
                <div className="flex items-end gap-6">
                    <div className="w-52 h-52 bg-gradient-to-br from-primary/40 to-primary shadow-2xl flex items-center justify-center rounded-lg">
                        <Download className="w-24 h-24 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wider mb-2">Playlist</p>
                        <h1 className="text-7xl font-bold mb-6">Downloads</h1>
                        <p className="text-muted-foreground">
                            {downloadedTracks.length} tracks • {downloadedTracks.length > 0 ? 'Available offline' : 'No downloads yet'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="px-8 py-6">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search in downloads"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Track List */}
                <div className="space-y-1">
                    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <div className="w-8 text-right">#</div>
                        <div>Title</div>
                        <div className="hidden md:block">Album</div>
                        <div className="flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading your downloads...</p>
                        </div>
                    ) : filteredTracks.length > 0 ? (
                        filteredTracks.map((track, index) => (
                            <TrackRow key={track.id} track={track} index={index} />
                        ))
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Music className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">No tracks found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                {searchQuery ? `No results for "${searchQuery}"` : "You haven't downloaded any tracks yet. Click the download icon on any song to save it here."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Re-importing Clock since it's used in the header row
import { Clock } from 'lucide-react';
