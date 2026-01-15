'use client';

import { useMemo, useEffect, useState } from 'react';
import { useMusicStore } from '@/lib/store';
import TrackCard from '@/components/TrackCard';
import VideoTrailers from '@/components/VideoTrailers';
import FeaturedHero from '@/components/FeaturedHero';
import NewsBlogs from '@/components/NewsBlogs';
import { Clock, TrendingUp, Sparkles, Upload } from 'lucide-react';
import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { Track } from '@/lib/types';

export default function AppHomePage() {
    const { tracks, playTrack, currentUser } = useMusicStore();
    const [dbUploads, setDbUploads] = useState<Track[]>([]);

    // Fetch uploads from Supabase
    useEffect(() => {
        async function fetchUploads() {
            const { data } = await supabase
                .from('songs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(6);

            if (data) {
                const uploadTracks: Track[] = data.map(song => ({
                    id: song.id,
                    title: song.title,
                    artist: song.artist,
                    album: 'Original Upload',
                    coverUrl: song.image_url,
                    audioUrl: song.audio_url,
                    duration: 0,
                    genre: 'Upload',
                    playCount: 0,
                    isLiked: false,
                    description: song.description,
                    posted_by: song.posted_by,
                    created_at: song.created_at
                }));
                setDbUploads(uploadTracks);
            }
        }
        fetchUploads();
    }, []);

    // Get recently played tracks
    const history = storage.getHistory();
    const recentTrackIds = Array.from(new Set(history.slice(0, 6).map(h => h.trackId)));
    const recentTracks = tracks.filter(t => recentTrackIds.includes(t.id));

    // Get trending tracks (by play count)
    const trendingTracks = useMemo(() => {
        return [...tracks]
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 10);
    }, [tracks]);

    // Get featured tracks (stable per tracks list change)
    const featuredTracks = useMemo(() => {
        return [...tracks]
            .sort(() => {
                // Use a seeded-like randomness based on track IDs so it's stable 
                // but looks random
                return 0.5 - Math.random();
            })
            .slice(0, 6);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tracks.length]); // Re-shuffle only when tracks are added/removed

    return (
        <div className="min-h-full bg-gradient-to-b from-primary/10 via-background to-background">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/20 to-transparent px-8 pt-6 pb-16">
                <h1 className="text-4xl font-bold mb-1">
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
                </h1>
                <p className="text-lg text-muted-foreground">
                    Welcome back, {currentUser?.name}!
                </p>
            </div>

            <div className="px-8 -mt-12 space-y-10 pb-8">
                {/* Video Trailers Section */}
                <div className="animate-slide-up delay-100">
                    <VideoTrailers />
                </div>

                {/* Hero Feature: Global Rhythm by Caleb Oquendo */}
                <div className="animate-slide-up">
                    <FeaturedHero />
                </div>

                {/* Latest Uploads (Supabase) */}
                {dbUploads.length > 0 && (
                    <section className="animate-slide-up delay-200">
                        <div className="flex items-center gap-3 mb-6">
                            <Upload className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold">Latest Uploads</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {dbUploads.map((track) => (
                                <TrackCard key={track.id} track={track} />
                            ))}
                        </div>
                    </section>
                )}

                

                {/* Featured Tracks */}
                <section className="animate-slide-up delay-500">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6 text-accent" />
                        <h2 className="text-2xl font-bold">Featured for You</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {featuredTracks.map((track, index) => (
                            <TrackCard key={track.id} track={track} index={index} />
                        ))}
                    </div>
                </section>

                {/* Trending */}
                <section className="animate-slide-up delay-500">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Trending Now</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {trendingTracks.slice(0, 10).map((track, index) => (
                            <TrackCard key={track.id} track={track} index={index} />
                        ))}
                    </div>
                </section>

                {/* News & Blogs */}
                <div className="animate-slide-up delay-500">
                    <NewsBlogs />
                </div>
            </div>
        </div>
    );
}
