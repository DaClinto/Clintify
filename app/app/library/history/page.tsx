'use client';

import { useMusicStore } from '@/lib/store';
import { TrackRow } from '@/components/TrackCard';
import { storage } from '@/lib/storage';
import { Clock, Play } from 'lucide-react';

export default function HistoryPage() {
    const { tracks, playTrack } = useMusicStore();

    const history = storage.getHistory();
    const historyTracks = history
        .map(h => ({
            track: tracks.find(t => t.id === h.trackId),
            playedAt: h.playedAt,
        }))
        .filter(item => item.track !== undefined);

    const handlePlayAll = () => {
        const allTracks = historyTracks.map(item => item.track!);
        if (allTracks.length > 0) {
            playTrack(allTracks[0], allTracks);
        }
    };

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="bg-gradient-to-b from-blue-900/40 to-transparent px-8 pt-20 pb-8">
                <div className="flex items-end gap-6">
                    <div className="w-56 h-56 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-2xl">
                        <Clock className="w-28 h-28 text-white" />
                    </div>
                    <div className="flex-1 pb-4">
                        <p className="text-sm font-semibold uppercase">Your History</p>
                        <h1 className="text-6xl font-bold my-4">Recently Played</h1>
                        <p className="text-muted-foreground">
                            {historyTracks.length} {historyTracks.length === 1 ? 'track' : 'tracks'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="px-8 py-6 flex items-center gap-4">
                {historyTracks.length > 0 && (
                    <>
                        <button
                            onClick={handlePlayAll}
                            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center shadow-2xl"
                        >
                            <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Clear all listening history?')) {
                                    storage.clearHistory();
                                    window.location.reload();
                                }
                            }}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all"
                        >
                            Clear History
                        </button>
                    </>
                )}
            </div>

            {/* Track List */}
            <div className="px-8 pb-8">
                {historyTracks.length > 0 ? (
                    <div className="space-y-1">
                        {historyTracks.map((item, index) => {
                            const playedDate = new Date(item.playedAt);
                            const now = new Date();
                            const diffMs = now.getTime() - playedDate.getTime();
                            const diffMins = Math.floor(diffMs / 60000);
                            const diffHours = Math.floor(diffMs / 3600000);
                            const diffDays = Math.floor(diffMs / 86400000);

                            let timeAgo = '';
                            if (diffMins < 1) timeAgo = 'Just now';
                            else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
                            else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
                            else timeAgo = `${diffDays}d ago`;

                            return (
                                <div key={`${item.track!.id}-${item.playedAt}`} className="group relative">
                                    <TrackRow track={item.track!} index={index} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground group-hover:hidden">
                                        {timeAgo}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-xl text-muted-foreground mb-2">
                            No listening history yet
                        </p>
                        <p className="text-muted-foreground">
                            Tracks you play will appear here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
