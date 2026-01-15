'use client';

import { useParams } from 'next/navigation';
import { useMusicStore } from '@/lib/store';
import { TrackRow } from '@/components/TrackCard';
import { Play, Heart, Disc, Music, Users, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Track } from '@/lib/types';

export default function ArtistPage() {
    const params = useParams();
    const artistName = decodeURIComponent(params.name as string);
    const { tracks, playTrack, toggleLikeTrack, likedTrackIds } = useMusicStore();

    const artistTracks = tracks.filter(t => t.artist === artistName);

    // Create mock albums from tracks
    const albums = Array.from(new Set(artistTracks.map(t => t.album)));

    const handlePlayAll = () => {
        if (artistTracks.length > 0) {
            playTrack(artistTracks[0], artistTracks);
        }
    };

    const isLiked = artistTracks.some(t => likedTrackIds.includes(t.id));

    // If no artist found (or no tracks)
    if (artistTracks.length === 0) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Artist not found</h2>
                    <Link href="/app/search" className="text-primary hover:underline">
                        Back to Search
                    </Link>
                </div>
            </div>
        );
    }

    const coverUrl = artistTracks[0].coverUrl;

    return (
        <div className="min-h-full">
            {/* Back Button */}
            <div className="absolute top-8 left-8 z-10">
                <Link
                    href="/app/search"
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors inline-block"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            {/* Hero Header */}
            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                {/* Background Image with Blur */}
                <div className="absolute inset-0">
                    <Image
                        src={coverUrl}
                        alt={artistName}
                        fill
                        className="object-cover blur-3xl opacity-50 scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-background" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end px-8 pb-8">
                    <div className="flex items-end gap-6 animate-slide-up">
                        <div className="w-52 h-52 rounded-full border-4 border-white/10 shadow-2xl relative overflow-hidden hidden md:block">
                            <Image
                                src={coverUrl}
                                alt={artistName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-2 text-white/80">
                                <div className="bg-blue-500/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                    <span className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                    </span>
                                    Verified Artist
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                                {artistName}
                            </h1>
                            <p className="text-lg text-white/80 font-medium drop-shadow-md">
                                {Number(1500000 + Math.random() * 5000000).toLocaleString()} monthly listeners
                            </p>

                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    onClick={handlePlayAll}
                                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Play
                                </button>
                                <button
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full font-semibold transition-colors"
                                >
                                    Follow
                                </button>
                                <div className="flex items-center gap-2 text-sm text-white/60 ml-4">
                                    <span className="px-2 py-1 rounded bg-white/10">
                                        {artistTracks[0].genre}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-8 py-8 space-y-12">
                {/* Popular Tracks */}
                <div className="grid lg:grid-cols-2 gap-12">
                    <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-2xl font-bold mb-6">Popular</h2>
                        <div className="space-y-1">
                            {artistTracks.slice(0, 5).map((track, index) => (
                                <TrackRow key={track.id} track={track} index={index} />
                            ))}
                        </div>
                    </section>

                    {/* Artist Pick / Latest Release */}
                    <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-2xl font-bold mb-6">Artist Pick</h2>
                        <div className="flex gap-4">
                            <div className="relative w-32 h-32 rounded-md overflow-hidden flex-shrink-0 group cursor-pointer">
                                <Image
                                    src={artistTracks[0].coverUrl}
                                    alt={artistTracks[0].album}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                                    Latest Release
                                </p>
                                <h3 className="text-xl font-bold mb-1 hover:underline cursor-pointer">
                                    {artistTracks[0].album}
                                </h3>
                                <p className="text-muted-foreground">
                                    Album • {new Date().getFullYear()}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Discography */}
                <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-bold mb-6">Discography</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {albums.map((album) => {
                            const albumTrack = artistTracks.find(t => t.album === album);
                            if (!albumTrack) return null;

                            return (
                                <div key={album} className="group cursor-pointer p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-lg">
                                        <Image
                                            src={albumTrack.coverUrl}
                                            alt={album}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <Play className="w-6 h-6 text-black fill-black ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold truncate" title={album}>{album}</h3>
                                        <p className="text-sm text-muted-foreground">Album</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* About */}
                <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <h2 className="text-2xl font-bold mb-6">About</h2>
                    <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer">
                        <Image
                            src={coverUrl}
                            alt={artistName}
                            fill
                            className="object-cover filter brightness-50 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <div className="max-w-3xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-lg text-white/90 leading-relaxed line-clamp-3 mb-4">
                                    {artistName} is one of the most exciting acts in current music scene.
                                    With a unique blend of {artistTracks[0].genre} and modern production,
                                    they have captured the hearts of millions of listeners worldwide.
                                    Their latest album &quot;{artistTracks[0].album}&quot; creates an immersive sonic journey.
                                </p>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="font-bold text-xl text-white">
                                            {Number(Math.floor(Math.random() * 500 + 100)).toLocaleString()}M
                                        </p>
                                        <p className="text-sm text-white/70 uppercase tracking-wider">
                                            Streams
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-white">
                                            #{Math.floor(Math.random() * 100 + 1)}
                                        </p>
                                        <p className="text-sm text-white/70 uppercase tracking-wider">
                                            In the world
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
