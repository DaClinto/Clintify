'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Loader2, Video, Minus, Plus } from 'lucide-react';

interface PexelsVideo {
    id: number;
    url: string;
    image: string;
    video_files: {
        link: string;
        quality: string;
        file_type: string;
    }[];
    user: {
        name: string;
    };
}

export default function VideoTrailers() {
    // Use local video for faster loading with responsive number of cards
    const [videos] = useState([
        {
            id: 1,
            title: "",
            subtitle: "",
            videoUrl: "/0001-1240.mp4",
            thumbnail: "/0001-1240.mp4"
        },
        {
            id: 2,
            title: "",
            subtitle: "",
            videoUrl: "/0001-1240.mp4",
            thumbnail: "/0001-1240.mp4"
        },
        {
            id: 3,
            title: "",
            subtitle: "",
            videoUrl: "/0001-1240.mp4",
            thumbnail: "/0001-1240.mp4"
        }
    ]);

    // Shared controller state (one controller controls all videos)
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(0.7);
    const [controllerIndex, setControllerIndex] = useState<number | null>(null);

    return (
        <section className="animate-slide-up mb-[30px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((video, index) => (
                    <TrailerCard
                        key={video.id}
                        trailer={video}
                        index={index}
                        isController={index === (controllerIndex ?? Math.floor(videos.length / 2))}
                        isPlaying={isPlaying}
                        isMuted={isMuted}
                        volume={volume}
                        setIsPlaying={setIsPlaying}
                        setIsMuted={setIsMuted}
                        setVolume={setVolume}
                        setControllerIndex={setControllerIndex}
                    />
                ))}
            </div>
        </section>
    );
}

interface TrailerCardProps {
    trailer: any;
    index: number;
    isController: boolean;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    setIsPlaying: (v: boolean) => void;
    setIsMuted: (v: boolean) => void;
    setVolume: (v: number) => void;
    setControllerIndex?: (i: number | null) => void;
}

function TrailerCard({ trailer, index, isController, isPlaying, isMuted, volume, setIsPlaying, setIsMuted, setVolume, setControllerIndex }: TrailerCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isController) return;
        setIsMuted(!isMuted);
    };

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isController) return;
        setIsPlaying(!isPlaying);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (setControllerIndex) setControllerIndex(index);
    };

    // Sync video element with shared controller state
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        // Only the controller should output audio; all other videos stay muted
        el.muted = isController ? isMuted : true;
        // Volume only applies to the controller (others are muted)
        if (isController) el.volume = volume;
        if (isPlaying) {
            el.play().catch(() => { /* ignore */ });
        } else {
            el.pause();
        }
    }, [isMuted, isPlaying, volume, isController]);

    const onLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const d = e.currentTarget.duration || 0;
        setDuration(Number(d));
    };

    const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        if (isSeeking) return;
        setCurrentTime(e.currentTarget.currentTime || 0);
    };

    const handleRangePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setIsSeeking(true);
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Number(e.target.value);
        setCurrentTime(v);
    };

    const handleRangePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const el = videoRef.current;
        if (!el) { setIsSeeking(false); return; }
        const v = Number((e.target as HTMLInputElement).value || 0);
        el.currentTime = v;
        setIsSeeking(false);
    };

    const formatTime = (s: number) => {
        if (!Number.isFinite(s) || s <= 0) return '0:00';
        const sec = Math.floor(s % 60).toString().padStart(2, '0');
        const min = Math.floor(s / 60).toString();
        return `${min}:${sec}`;
    };

    return (
        <div onClick={handleCardClick} className={`relative group aspect-[3/2] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.01] cursor-pointer w-full ${isController ? 'ring-2 ring-primary/60 shadow-lg' : 'glass shadow-2xl'}`}>
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={trailer.videoUrl}
                autoPlay={isController}
                muted={!isController || isMuted}
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 w-full">
                <div className={`flex items-center gap-2 sm:gap-4 transition-opacity duration-300 ${isController ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isController && (
                        <>
                            <button
                                onClick={togglePlay}
                                className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
                            >
                                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
                            </button>

                            <div className="w-full flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2">
                                <div className="text-white text-xs sm:text-sm opacity-90 whitespace-nowrap">{formatTime(currentTime)}</div>
                                <input
                                    type="range"
                                    min={0}
                                    max={Math.max(0, duration)}
                                    step={0.1}
                                    value={currentTime}
                                    onPointerDown={handleRangePointerDown}
                                    onPointerUp={handleRangePointerUp}
                                    onChange={handleRangeChange}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 h-1 bg-white/20 appearance-none rounded-full cursor-pointer"
                                />
                                <div className="text-white text-xs sm:text-sm opacity-80 whitespace-nowrap">{formatTime(duration)}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); if (!isController) return; setVolume(Math.max(0, +(volume - 0.05).toFixed(2))); }}
                    className="p-0.5 sm:p-1 rounded-md bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/5"
                    title="Decrease volume"
                >
                    <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(e); }}
                    className="p-0.5 sm:p-1 rounded-md bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/5"
                    title="Mute/Unmute"
                >
                    {isMuted ? <VolumeX className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); if (!isController) return; setVolume(Math.min(1, +(volume + 0.05).toFixed(2))); }}
                    className="p-0.5 sm:p-1 rounded-md bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/5"
                    title="Increase volume"
                >
                    <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </button>
            </div>
        </div>
    );
}
