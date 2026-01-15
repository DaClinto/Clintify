'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, Plus, Heart, Clock, Download, Upload, Users, Music } from 'lucide-react';
import { useMusicStore } from '@/lib/store';

const navigation = [
    { name: 'Home', href: '/app', icon: Home },
    { name: 'Explore', href: '/app/explore', icon: Search },
    { name: 'Library', href: '/app/library', icon: Library },
    { name: 'Profile', href: '/app/profile', icon: Users },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { playlists } = useMusicStore();

    return (
        <div className="w-64 bg-black h-full flex flex-col gap-2 p-2">
            {/* Logo */}
            <div className="p-4 px-6 flex items-center gap-3 animate-fade-in group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 transition-transform group-hover:rotate-12">
                    <Music className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-black tracking-tighter text-white">CLINTIFY</h1>
            </div>

            {/* Main Navigation */}
            <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-300 group hover-lift ${isActive
                                ? 'text-foreground bg-white/10 shadow-lg shadow-black/20'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-all duration-500 ${isActive ? 'text-primary scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`} />
                            <span className="font-bold tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Library Section */}
            <div className="flex-1 bg-secondary/50 rounded-lg p-4 overflow-y-auto">
                <div className="space-y-4">
                    {/* Quick Access */}
                    <div className="space-y-2">
                        <Link
                            href="/app/upload"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group ${pathname === '/app/upload'
                                ? 'text-foreground bg-white/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center">
                                <Upload className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">Upload Music</span>
                        </Link>

                        <Link
                            href="/app/downloads"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group ${pathname === '/app/downloads'
                                ? 'text-foreground bg-white/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <div className="w-10 h-10 rounded bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                                <Download className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">Downloads</span>
                        </Link>

                        <Link
                            href="/app/library/liked"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group ${pathname === '/app/library/liked'
                                ? 'text-foreground bg-white/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <Heart className="w-5 h-5 fill-white text-white" />
                            </div>
                            <span className="font-medium">Liked Songs</span>
                        </Link>

                        <Link
                            href="/app/library/history"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors group ${pathname === '/app/library/history'
                                ? 'text-foreground bg-white/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">Recent</span>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10" />

                    {/* Playlists */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Playlists
                            </span>
                            <Link
                                href="/app/playlist/new"
                                className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                                title="Create Playlist"
                            >
                                <Plus className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-1">
                            {playlists.length === 0 ? (
                                <p className="text-sm text-muted-foreground px-3 py-2">
                                    No playlists yet. Create one!
                                </p>
                            ) : (
                                playlists.map((playlist) => (
                                    <Link
                                        key={playlist.id}
                                        href={`/app/playlist/${playlist.id}`}
                                        className={`block px-3 py-2 rounded-md transition-colors truncate ${pathname === `/app/playlist/${playlist.id}`
                                            ? 'text-foreground bg-white/10'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        {playlist.name}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
