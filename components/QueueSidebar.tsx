'use client';

import { useMusicStore } from '@/lib/store';
import { TrackRow } from '@/components/TrackCard';
import { X, ListMusic } from 'lucide-react';
import Image from 'next/image';

export default function QueueSidebar() {
    const { showQueue, toggleQueue, currentTrack, queue, currentTrackIndex } = useMusicStore();

    if (!showQueue) return null;

    const nextTracks = queue.slice(currentTrackIndex + 1);

    return (
        <div className="w-80 border-l border-white/10 bg-black/95 backdrop-blur-xl flex flex-col h-full absolute right-0 top-0 bottom-24 z-40 transition-transform animate-slide-in">
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <h2 className="font-bold text-xl flex items-center gap-2">
                    <ListMusic className="w-5 h-5" /> Queue
                </h2>
                <button
                    onClick={toggleQueue}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Now Playing */}
                <section>
                    <h3 className="text-sm font-bold text-muted-foreground mb-4">Now Playing</h3>
                    {currentTrack ? (
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
                                <Image
                                    src={currentTrack.coverUrl}
                                    alt={currentTrack.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold hover:underline cursor-pointer truncate">
                                    {currentTrack.title}
                                </h4>
                                <p className="text-lg text-muted-foreground hover:text-white cursor-pointer truncate">
                                    {currentTrack.artist}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No track playing</p>
                    )}
                </section>

                {/* Next Up */}
                <section>
                    <h3 className="text-sm font-bold text-muted-foreground mb-4">Next Up</h3>
                    {nextTracks.length > 0 ? (
                        <div className="-mx-4">
                            {nextTracks.map((track, index) => (
                                <TrackRow
                                    key={`${track.id}-${index}`}
                                    track={track}
                                    index={currentTrackIndex + 1 + index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>End of queue</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
