'use client';

import { useMemo, useEffect, useState } from 'react';
import { useMusicStore } from '@/lib/store';
import TrackCard from '@/components/TrackCard';
import VideoTrailers from '@/components/VideoTrailers';
import FeaturedHero from '@/components/FeaturedHero';
import NewsBlogs from '@/components/NewsBlogs';
import LiveClock from '@/components/LiveClock';
import { Clock, TrendingUp, Sparkles, Upload } from 'lucide-react';
import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { Track } from '@/lib/types';

export default function AppHomePage() {
    const { tracks, playTrack, currentUser, likedTrackIds } = useMusicStore();
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
                    isLiked: likedTrackIds.includes(song.id), // Update like status based on current liked tracks
                    description: song.description,
                    posted_by: song.posted_by,
                    created_at: song.created_at
                }));
                setDbUploads(uploadTracks);
            }
        }
        fetchUploads();
    }, [likedTrackIds]); // Re-fetch when liked tracks change

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 drop-shadow-[0_4px_8px_rgba(168,85,247,0.3)] transform scale-105 transition-all duration-300 hover:scale-110 tracking-wide">
                            Good morning
                        </h1>
                        <p className="text-xl text-muted-foreground font-light tracking-wide">
                            Welcome back, <span className="text-lg font-semibold text-primary tracking-wide">tbsoso!</span>
                        </p>
                    </div>
                    <LiveClock />
                </div>
            </div>

            <div className="px-8 -mt-12 space-y-10 pb-8">
                {/* Video Trailers Section */}
                <div className="animate-slide-up delay-100 mt-10">
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
