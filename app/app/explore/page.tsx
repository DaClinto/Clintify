"use client";

import { useMemo } from 'react';
import { useMusicStore } from '@/lib/store';
import TrackCard from '@/components/TrackCard';
import { Search, Compass, Sparkles, Zap, Music } from 'lucide-react';

export default function ExplorePage() {
    const { tracks } = useMusicStore();

    // Get 15 songs for exploration — memoized so the list doesn't reshuffle on unrelated re-renders
    const exploreTracks = useMemo(() => {
        return [...tracks].sort(() => 0.5 - Math.random()).slice(0, 15);
    }, [tracks]);

    return (
        <div className="p-8 pb-32 space-y-12">
            <style dangerouslySetInnerHTML={{ __html: style }} />
            {/* Header Section */}
            <div className="relative h-[300px] rounded-3xl overflow-hidden glass shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-purple-900/40 to-black/40" />
                <div className="absolute inset-0 flex flex-col justify-center p-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/20 rounded-full text-primary">
                            <Compass className="w-6 h-6 animate-spin-slow" />
                        </div>
                        <span className="text-sm font-bold tracking-[0.3em] text-primary uppercase">Discovery Mode</span>
                    </div>
                    <h1 className="text-6xl font-black text-white leading-none tracking-tighter mb-4">
                        EXPLORE <br /> <span className="gradient-text">NEW HORIZONS</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-xl font-medium">
                        Dive into curated selections and discover your next favorite track.
                        Updated every hour with the freshest sounds.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="animate-slide-up">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            Curated for <span className="text-primary italic">You</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        15 Fresh Tracks Found
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {exploreTracks.map((track, index) => (
                        <div
                            key={track.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <TrackCard track={track} index={index} />
                        </div>
                    ))}
                </div>

                {exploreTracks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 glass rounded-3xl">
                        <Search className="w-12 h-12 text-muted-foreground" />
                        <div>
                            <h3 className="text-xl font-bold text-white">No tracks found</h3>
                            <p className="text-muted-foreground">Try uploading some music to see them here!</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Footer Tag */}
            <div className="flex justify-center pt-12">
                <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/5 text-sm font-medium text-muted-foreground italic">
                    <Music className="w-4 h-4 text-primary" />
                    &quot;Music is the divine way to tell beautiful, poetic things to the heart.&quot;
                </div>
            </div>
        </div>
    );
}

// Custom CSS for slow spin
const style = `
@keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.animate-spin-slow {
    animation: spin-slow 8s linear infinite;
}
`;
