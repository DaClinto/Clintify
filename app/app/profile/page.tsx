'use client';

import { useMusicStore } from '@/lib/store';
import TrackCard from '@/components/TrackCard';
import { User as UserIcon, Upload, Clock, Settings, LogOut, Edit3, Music } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
    const { currentUser, tracks, logout } = useMusicStore();

    // Get user's uploaded songs (filtering by artist name as a proxy in this demo)
    const userUploads = tracks.filter(t => t.artist === currentUser?.name);

    // Listen later (proxy using liked songs for this demo)
    const listenLater = tracks.slice(0, 4);

    if (!currentUser) return null;

    return (
        <div className="p-8 pb-32 space-y-12">
            {/* Profile Header */}
            <section className="relative group">
                <div className="h-[250px] w-full rounded-3xl overflow-hidden glass border border-white/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-900/40 to-black/60" />
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="absolute -bottom-12 left-12 flex items-end gap-6">
                    <div className="relative w-40 h-40 rounded-full border-[6px] border-black overflow-hidden shadow-2xl glass transition-transform duration-500 hover:scale-105 group-hover:border-primary/50">
                        {currentUser.avatar ? (
                            <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                <UserIcon className="w-16 h-16 text-muted-foreground" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Edit3 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="pb-4 space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-5xl font-black text-white tracking-tighter">{currentUser.name}</h1>
                            <div className="px-3 py-1 bg-primary/20 rounded-full text-xs font-bold text-primary border border-primary/20 uppercase">Pro Artist</div>
                        </div>
                        <p className="text-white/60 font-medium">@{currentUser.name.toLowerCase().replace(/\s/g, '_')} • {userUploads.length} tracks uploaded</p>
                    </div>
                </div>

                <div className="absolute top-6 right-6 flex gap-3">
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full glass border border-white/10 transition-colors text-white">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => logout()}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-full glass border border-red-500/20 transition-colors text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-16">
                {/* Left: Stats & Info */}
                <div className="space-y-8">
                    <div className="glass rounded-3xl p-8 space-y-6">
                        <h3 className="text-xl font-bold border-b border-white/5 pb-4">Activity Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-3xl font-black text-primary">{userUploads.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Songs</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-3xl font-black text-emerald-400">1.2k</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Plays</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Listen Later</h3>
                            <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-4">
                            {listenLater.map(track => (
                                <div key={track.id} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                                    <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                                        <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 truncate">
                                        <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{track.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center/Right: Uploaded Songs */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-xl text-primary">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold">Your Uploads</h2>
                        </div>
                    </div>

                    {userUploads.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {userUploads.map((track, index) => (
                                <TrackCard key={track.id} track={track} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-white/10 border-2">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                <Music className="w-10 h-10 text-muted-foreground opacity-30" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-bold">Artist Journey Starts Here</p>
                                <p className="text-muted-foreground max-w-xs">You haven&apos;t uploaded any music yet. Show your talent to the world!</p>
                            </div>
                            <button className="btn-primary flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Start Uploading
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
