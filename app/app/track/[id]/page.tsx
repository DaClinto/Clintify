'use client';

import { useEffect, useState, useMemo } from 'react';
import { useMusicStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Track } from '@/lib/types';
import Image from 'next/image';
import { Play, Pause, Heart, Share2, MoreHorizontal, ArrowLeft, Disc, User, Calendar, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/lib/sampleData';

export default function TrackDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const { tracks, currentTrack, isPlaying, playTrack, togglePlay, toggleLikeTrack, likedTrackIds } = useMusicStore();

    const [track, setTrack] = useState<Track | null>(null);
    const [loading, setLoading] = useState(true);

    const isCurrentTrack = currentTrack?.id === track?.id;
    const isLiked = track ? likedTrackIds.includes(track.id) : false;

    useEffect(() => {
        async function fetchTrack() {
            setLoading(true);
            // 1. Check store
            const foundInStore = tracks.find(t => t.id === id);
            if (foundInStore) {
                setTrack(foundInStore);
                setLoading(false);
                return;
            }

            // 2. Check Supabase
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .eq('id', id)
                .single();

            if (data && !error) {
                setTrack({
                    id: data.id,
                    title: data.title,
                    artist: data.artist,
                    album: 'Single',
                    coverUrl: data.image_url,
                    audioUrl: data.audio_url,
                    duration: 0,
                    genre: 'Unknown',
                    playCount: 0,
                    isLiked: false,
                    description: data.description,
                    posted_by: data.posted_by,
                    created_at: data.created_at
                } as any);
            }
            setLoading(false);
        }

        fetchTrack();
    }, [id, tracks]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!track) {
        return (
            <div className="p-8 text-center">
                <p className="text-xl text-muted-foreground">Track not found.</p>
                <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-full pb-32">
            {/* Header / Background Mural */}
            <div className="relative h-[40vh] w-full overflow-hidden">
                <Image
                    src={track.coverUrl}
                    alt={track.title}
                    fill
                    className="object-cover blur-3xl opacity-40 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                <button
                    onClick={() => router.back()}
                    className="absolute top-8 left-8 p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all border border-white/10 z-10"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            {/* Content Area */}
            <div className="px-8 -mt-48 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-end">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 group">
                        <Image
                            src={track.coverUrl}
                            alt={track.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    <div className="flex-1 space-y-4 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                                {track.genre || 'Single'}
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                            {track.title}
                        </h1>
                        <div className="flex items-center gap-4 text-xl">
                            <span className="font-bold text-primary hover:underline cursor-pointer transition-all">{track.artist}</span>
                            <span className="text-white/40">•</span>
                            <span className="text-white/60">{track.album === 'Original Upload' ? 'Uploaded Content' : track.album}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 mt-12 py-6 border-b border-white/5">
                    <button
                        onClick={() => playTrack(track, tracks)}
                        className="w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/30"
                    >
                        {isCurrentTrack && isPlaying ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8 ml-1" fill="currentColor" />}
                    </button>

                    <button
                        onClick={() => toggleLikeTrack(track.id)}
                        className={`p-3 rounded-full border transition-all hover:scale-110 ${isLiked ? 'bg-primary/20 border-primary text-primary' : 'border-white/20 text-white/60 hover:text-white hover:border-white'}`}
                    >
                        <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
                    </button>

                    <button className="p-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white transition-all hover:scale-110">
                        <Share2 className="w-7 h-7" />
                    </button>

                    <button className="p-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white transition-all hover:scale-110">
                        <MoreHorizontal className="w-7 h-7" />
                    </button>
                </div>

                {/* Info Grid */}
                <div className="grid lg:grid-cols-3 gap-12 mt-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description / Story */}
                        <section className="animate-slide-up">
                            <div className="flex items-center gap-3 mb-6">
                                <Music className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">About this track</h2>
                            </div>
                            <div className="glass-premium p-8 rounded-3xl space-y-6">
                                <p className="text-lg text-white/70 leading-relaxed italic">
                                    {track.description || "The artist hasn't provided a description for this track yet. Discover the unique soundscape of " + track.artist + "'s latest release."}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Released</p>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>{track.created_at ? new Date(track.created_at).toLocaleDateString() : 'Dec 2025'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Genre</p>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Disc className="w-4 h-4 text-primary" />
                                            <span>{track.genre || 'Alternative'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Format</p>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Music className="w-4 h-4 text-primary" />
                                            <span>High Fidelity HQ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Artist Spotlight */}
                        <section className="animate-slide-up delay-100">
                            <div className="flex items-center gap-3 mb-6">
                                <User className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Artist Spotlight</h2>
                            </div>
                            <div className="glass-premium p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 p-1 flex-shrink-0">
                                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
                                        <User className="w-12 h-12 text-primary/40" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold">{track.artist}</h3>
                                    <p className="text-white/60 leading-relaxed font-medium">
                                        Innovative creator pushing the boundaries of {track.genre || 'modern sound'}. Known for evocative melodies and intricate production, {track.artist} continues to define the Clintify aesthetic.
                                    </p>
                                    <button className="btn-secondary px-8 py-2.5 text-sm font-bold hover:bg-white/10">VIEW ARTIST PROFILE</button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8 animate-slide-in">
                        <section>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Uploader</h3>
                            <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                    {track.posted_by?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{track.posted_by || 'Verified Artist'}</p>
                                    <p className="text-xs text-muted-foreground">Certified Clintify Creator</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Technical Info</h3>
                            <div className="glass p-6 rounded-2xl space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Duration</span>
                                    <span className="font-medium">{formatDuration(track.duration || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Plays</span>
                                    <span className="font-medium">1,204 • Trending</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Quality</span>
                                    <span className="font-medium text-primary">Lossless</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
