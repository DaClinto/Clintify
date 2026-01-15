'use client';

import { useEffect, useRef } from 'react';
import { useMusicStore } from '@/lib/store';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Repeat, Repeat1, Shuffle, Heart, ListMusic } from 'lucide-react';
import Image from 'next/image';
import { formatDuration } from '@/lib/sampleData';

export default function AudioPlayer() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const {
        currentTrack,
        isPlaying,
        volume,
        isShuffle,
        repeatMode,
        currentTime,
        duration,
        togglePlay,
        nextTrack,
        previousTrack,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        setCurrentTime,
        setDuration,
        toggleLikeTrack,
        likedTrackIds,
        showQueue,
        toggleQueue,
    } = useMusicStore();

    // Handle audio playback
    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(err => console.error('Playback error:', err));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Update audio source when track changes
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.load();

        if (isPlaying) {
            audioRef.current.play().catch(err => console.error('Playback error:', err));
        }
    }, [currentTrack, isPlaying]);

    // Volume control
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Time update handler
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    // Load metadata handler
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // Track ended handler
    const handleEnded = () => {
        if (repeatMode === 'one') {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else {
            nextTrack();
        }
    };

    // Seek handler
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !progressRef.current || !duration) return;

        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;

        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    if (!currentTrack) {
        return (
            <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/95 backdrop-blur-xl border-t border-white/10 flex items-center justify-center">
                <p className="text-muted-foreground">Select a track to start playing</p>
            </div>
        );
    }

    return (
        <>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/95 backdrop-blur-2xl border-t border-white/10 z-50">
                <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center gap-8">
                    {/* Track Info */}
                    <div className="flex items-center gap-4 w-1/4 min-w-[250px] animate-slide-in">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 group shadow-lg">
                            <Image
                                src={currentTrack.coverUrl}
                                alt={currentTrack.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate text-white group-hover:text-primary transition-colors">{currentTrack.title}</h4>
                            <p className="text-xs text-muted-foreground truncate hover:text-white transition-colors cursor-pointer">{currentTrack.artist}</p>
                        </div>
                        <button
                            onClick={() => toggleLikeTrack(currentTrack.id)}
                            className={`p-2 transition-all duration-300 hover:scale-125 ${isLiked ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(28, 77, 141, 0.5)]' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex-1 flex flex-col items-center gap-2 max-w-xl animate-slide-up">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={toggleShuffle}
                                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isShuffle ? 'text-primary drop-shadow-[0_0_8px_rgba(28, 77, 141, 0.4)]' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <Shuffle className="w-4 h-4" />
                            </button>

                            <button
                                onClick={previousTrack}
                                className="p-2 text-muted-foreground hover:text-white hover:scale-110 active:scale-95 transition-all duration-200"
                            >
                                <SkipBack className="w-6 h-6" fill="currentColor" />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-12 h-12 rounded-full bg-white text-black hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-primary/40"
                            >
                                {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
                            </button>

                            <button
                                onClick={nextTrack}
                                className="p-2 text-muted-foreground hover:text-white hover:scale-110 active:scale-95 transition-all duration-200"
                            >
                                <SkipForward className="w-6 h-6" fill="currentColor" />
                            </button>

                            <button
                                onClick={toggleRepeat}
                                className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${repeatMode !== 'off' ? 'text-primary drop-shadow-[0_0_8px_rgba(28, 77, 141, 0.4)]' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full flex items-center gap-3 group">
                            <span className="text-[10px] font-bold text-muted-foreground w-10 text-right tabular-nums">
                                {formatDuration(currentTime)}
                            </span>
                            <div
                                ref={progressRef}
                                onClick={handleSeek}
                                className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300 group-hover:h-2"
                            >
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full relative transition-all duration-150 ease-linear shadow-[0_0_10px_rgba(28, 77, 141, 0.3)]"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute right-0 top-0 h-full w-4 bg-white/30 blur-sm" />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground w-10 tabular-nums">
                                {formatDuration(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px] animate-slide-in">
                        <button
                            onClick={toggleQueue}
                            className={`p-2 rounded-lg transition-all duration-300 hover:bg-white/5 ${showQueue ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Queue"
                        >
                            <ListMusic className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 group/vol">
                            <button
                                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                                className="p-2 text-muted-foreground hover:text-white transition-all duration-300 hover:scale-110"
                            >
                                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>
                            <div className="w-24 flex items-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer group-hover/vol:h-1.5 transition-all
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
                                    [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.5)]
                                    hover:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
