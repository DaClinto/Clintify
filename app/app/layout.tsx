'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMusicStore } from '@/lib/store';
import { Menu, Music } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import AudioPlayer from '@/components/AudioPlayer';
import QueueSidebar from '@/components/QueueSidebar';
import { storage } from '@/lib/storage';
import TransitionProvider from '@/components/TransitionProvider';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { currentUser, setCurrentUser, initializeLibrary } = useMusicStore();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Check for existing user session
        const storedUser = storage.getUser();
        if (storedUser) {
            setCurrentUser(storedUser);
        } else {
            router.push('/login');
        }

        // Initialize library with sample data
        initializeLibrary();
    }, [setCurrentUser, initializeLibrary, router]);

    const handleScroll = () => {
        if (!mainRef.current) return;
        const target = mainRef.current;
        const winScroll = target.scrollTop;
        const height = target.scrollHeight - target.clientHeight;
        const scrolled = (winScroll / height) * 100;
        setScrollProgress(scrolled);
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-black overflow-hidden relative">
            {/* Top Scroll Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 z-[100] pointer-events-none">
                <div
                    className="h-full bg-gradient-to-r from-primary via-purple-500 to-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-150 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Mobile Header with Hamburger Menu */}
            <div className="lg:hidden flex items-center justify-between p-3 bg-black/50 backdrop-blur-sm border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                        <Music className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm">CLINTIFY</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <div className="flex flex-col gap-0.5">
                        <div className="w-4 h-0.5 bg-white rounded-full"></div>
                        <div className="w-4 h-0.5 bg-white rounded-full"></div>
                        <div className="w-4 h-0.5 bg-white rounded-full"></div>
                    </div>
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                
                {/* Sidebar */}
                <div className={`fixed lg:relative lg:translate-x-0 transform -translate-x-full transition-transform duration-300 ease-in-out z-50 lg:z-auto h-full w-64 ${sidebarOpen ? 'translate-x-0' : ''}`}>
                    <Sidebar />
                </div>
                
                <main
                    ref={mainRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto pb-32 scroll-smooth"
                >
                    <TransitionProvider>
                        {children}
                    </TransitionProvider>
                </main>
                <QueueSidebar />
            </div>
            <AudioPlayer />
        </div>
    );
}
