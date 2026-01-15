'use client';

import { Track } from '@/lib/types';
import { useMusicStore } from '@/lib/store';
import { Play, Pause, Heart, MoreHorizontal, Download, Trash2, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/lib/sampleData';

interface TrackCardProps {
    track: Track;
    index?: number;
    showArtist?: boolean;
}

export default function TrackCard({ track, index, showArtist = true }: TrackCardProps) {
    const router = useRouter();
    const {
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        toggleLikeTrack,
        likedTrackIds,
        tracks,
        toggleDownload,
        downloadedTrackIds
    } = useMusicStore();

    const isCurrentTrack = currentTrack?.id === track.id;
    const isLiked = likedTrackIds.includes(track.id);
    const isDownloaded = downloadedTrackIds.includes(track.id);

    const handlePlay = () => {
        if (isCurrentTrack) {
            togglePlay();
        } else {
            playTrack(track, tracks);
        }
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isDownloaded) {
            // If already downloaded, toggle acts as a "delete" from the list
            toggleDownload(track.id);
            return;
        }

        try {
            const response = await fetch(track.audioUrl, { mode: 'cors' });
            if (!response.ok) throw new Error('CORS or network error');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${track.artist} - ${track.title}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toggleDownload(track.id);
        } catch (error) {
            console.error('Download via fetch failed, falling back to direct link:', error);
            window.open(track.audioUrl, '_blank');
            toggleDownload(track.id);
        }
    };

    return (
        <div
            className="group glass-premium rounded-2xl p-4 transition-all duration-500 cursor-pointer hover-lift flex flex-col h-full active-scale"
            onClick={() => router.push(`/app/track/${track.id}`)}
        >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 shadow-xl group-hover:shadow-primary/20 transition-all duration-500">
                <Image
                    src={track.coverUrl}
                    alt={track.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Play Button Overlay */}
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-500 ${isCurrentTrack && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePlay();
                        }}
                        className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center scale-90 group-hover:scale-100 hover:scale-110 transition-all duration-300 shadow-2xl shadow-primary/40 active:scale-95"
                    >
                        {isCurrentTrack && isPlaying ? (
                            <Pause className="w-6 h-6" fill="currentColor" />
                        ) : (
                            <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-1 flex-1 flex flex-col">
                <h3 className={`font-bold truncate text-lg transition-colors duration-300 ${isCurrentTrack ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                    {track.title}
                </h3>
                {showArtist && (
                    <Link
                        href={`/app/artist/${encodeURIComponent(track.artist)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-muted-foreground truncate hover:text-white transition-colors duration-300 block mb-2"
                    >
                        {track.artist}
                    </Link>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground italic">{track.genre}</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${isDownloaded ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {isDownloaded ? (
                                <Trash2 className="w-4 h-4" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLikeTrack(track.id);
                            }}
                            className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${isLiked ? 'text-primary scale-110 animate-pulse' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// List view variant
interface TrackRowProps {
    track: Track;
    index: number;
}

export function TrackRow({ track, index }: TrackRowProps) {
    const {
        currentTrack,
        isPlaying,
        playTrack,
        togglePlay,
        toggleLikeTrack,
        likedTrackIds,
        tracks,
        toggleDownload,
        downloadedTrackIds
    } = useMusicStore();

    const isCurrentTrack = currentTrack?.id === track.id;
    const isLiked = likedTrackIds.includes(track.id);
    const isDownloaded = downloadedTrackIds.includes(track.id);

    const handlePlay = () => {
        if (isCurrentTrack) {
            togglePlay();
        } else {
            playTrack(track, tracks);
        }
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const response = await fetch(track.audioUrl, { mode: 'cors' });
            if (!response.ok) throw new Error('CORS or network error');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${track.artist} - ${track.title}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toggleDownload(track.id);
        } catch (error) {
            console.error('Download via fetch failed, falling back to direct link:', error);
            window.open(track.audioUrl, '_blank');
            toggleDownload(track.id);
        }
    };

    return (
        <div
            className="group grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center px-4 py-3 rounded hover:bg-white/5 transition-colors cursor-pointer"
            onClick={handlePlay}
        >
            {/* Index / Play Button */}
            <div className="w-8 text-right">
                <span className={`group-hover:hidden ${isCurrentTrack ? 'text-primary' : 'text-muted-foreground'}`}>
                    {index + 1}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePlay();
                    }}
                    className="hidden group-hover:inline-flex items-center justify-center"
                >
                    {isCurrentTrack && isPlaying ? (
                        <Pause className="w-4 h-4" fill="currentColor" />
                    ) : (
                        <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                    )}
                </button>
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <Image
                        src={track.coverUrl}
                        alt={track.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <p className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : 'text-foreground'}`}>
                        {track.title}
                    </p>
                    <Link
                        href={`/app/artist/${encodeURIComponent(track.artist)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-muted-foreground truncate hover:underline hover:text-white block"
                    >
                        {track.artist}
                    </Link>
                </div>
            </div>

            {/* Album */}
            <div className="text-sm text-muted-foreground truncate hidden md:block">
                {track.album}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTrack(track.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${isLiked ? 'opacity-100 text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <span className="text-sm text-muted-foreground">{formatDuration(track.duration)}</span>
                <button
                    onClick={handleDownload}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDownloaded ? 'opacity-100 text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    title={isDownloaded ? "Delete Download" : "Download"}
                >
                    {isDownloaded ? (
                        <Trash2 className="w-4 h-4" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                </button>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
