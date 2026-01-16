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
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Shared controller state (one controller controls all videos)
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(0.7);
    const [controllerIndex, setControllerIndex] = useState<number | null>(null);

    useEffect(() => {
        async function fetchVideos() {
            setLoading(true);
            try {
                const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;

                // If no API key, use high-quality fallbacks
                if (!apiKey) {
                    console.warn("Pexels API key missing. Using fallbacks.");
                    setVideos([
                        {
                            id: 1,
                            title: "Studio Session",
                            subtitle: "Behind the Scenes",
                            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-headphones-listening-to-music-reveling-4008-large.mp4",
                            thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"
                        },
                        {
                            id: 2,
                            title: "Live Concert",
                            subtitle: "Neon Nights Tour",
                            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-crowd-at-concert-with-lights-and-smoke-4011-large.mp4",
                            thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
                        },
                        {
                            id: 3,
                            title: "Urban Rhythms",
                            subtitle: "City Beats 2024",
                            videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-dancing-and-listening-to-music-with-headphones-4007-large.mp4",
                            thumbnail: "https://images.unsplash.com/photo-1514525253344-f203046759fc?w=800&q=80"
                        }
                    ]);
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://api.pexels.com/v1/videos/search?query=music+studio&per_page=3', {
                    headers: {
                        Authorization: apiKey
                    }
                });

                if (!response.ok) throw new Error('Pexels API request failed');

                const data = await response.json();
                const mappedVideos = data.videos.map((v: PexelsVideo, index: number) => ({
                    id: v.id,
                    title: index === 0 ? "Production Masterclass" : index === 1 ? "Global Rhythm" : "Studio Sessions",
                    subtitle: `By ${v.user.name}`,
                    videoUrl: v.video_files.find(f => f.quality === 'hd' || f.quality === 'sd')?.link || v.video_files[0].link,
                    thumbnail: v.image
                }));

                setVideos(mappedVideos);
            } catch (err: any) {
                console.error("Pexels fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="w-full aspect-[21/9] flex items-center justify-center glass rounded-2xl">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

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
    const [videoSrc, setVideoSrc] = useState<string>(trailer.videoUrl);
    const [localVideoFailed, setLocalVideoFailed] = useState(false);
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

    // Prefer a local copy if user places `global_rhythm.mp4` in the public folder
    useEffect(() => {
        let mounted = true;
        async function checkLocal() {
            const candidates = ['/global_rhythm.mp4', '/components/global_rhythm.mp4'];
            for (const path of candidates) {
                try {
                    const res = await fetch(path, { method: 'HEAD' });
                    if (mounted && res.ok) {
                        setVideoSrc(path);
                        return;
                    }
                } catch (e) {
                    // ignore
                }
            }
            // fallback to remote
            if (mounted) setVideoSrc(trailer.videoUrl);
        }

        checkLocal();
        return () => { mounted = false; };
    }, [trailer.videoUrl]);

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
    }, [isMuted, isPlaying, volume]);

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
        <div onClick={handleCardClick} className={`relative group aspect-[3/2] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.01] cursor-pointer ${isController ? 'ring-2 ring-primary/60 shadow-lg' : 'glass shadow-2xl'}`}>
            {videoSrc && videoSrc.endsWith('/global_rhythm.mp4') && !localVideoFailed ? (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={videoSrc}
                    poster="/global_rhythm.jpg"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    onError={() => setLocalVideoFailed(true)}
                    onLoadedMetadata={onLoadedMetadata}
                    onTimeUpdate={onTimeUpdate}
                />
            ) : videoSrc && videoSrc.endsWith('/global_rhythm.mp4') && localVideoFailed ? (
                <img
                    className="w-full h-full object-cover"
                    src="/global_rhythm.jpg"
                    alt={trailer.title}
                />
            ) : (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    src={videoSrc}
                    poster={trailer.thumbnail}
                    muted={isMuted}
                    loop
                    playsInline
                    onLoadedMetadata={onLoadedMetadata}
                    onTimeUpdate={onTimeUpdate}
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 p-3 w-full">
                <p className="text-white font-bold text-[9px] uppercase tracking-widest mb-0.5 opacity-80">{trailer.subtitle}</p>
                <h3 className="text-lg font-bold text-white mb-1.5">{trailer.title}</h3>

                <div className={`flex items-center gap-4 transition-opacity duration-300 ${isController ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isController && (
                        <>
                            <button
                                onClick={togglePlay}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
                            >
                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>

                            <div className="w-full flex items-center gap-3 ml-2">
                                <div className="text-white text-sm opacity-90">{formatTime(currentTime)}</div>
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
                                <div className="text-white text-sm opacity-80">{formatTime(duration)}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); if (!isController) return; setVolume(Math.max(0, +(volume - 0.05).toFixed(2))); }}
                    className="p-1 rounded-md bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/5"
                    title="Decrease volume"
                >
                    <Minus className="w-3 h-3" />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(e); }}
                    className="p-1 rounded-md bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/5"
                    title="Mute/Unmute"
                >
                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); if (!isController) return; setVolume(Math.min(1, +(volume + 0.05).toFixed(2))); }}
                    className="p-1 rounded-md bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-white/5"
                    title="Increase volume"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
