'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMusicStore } from '@/lib/store';
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

            <div className="flex-1 flex overflow-hidden relative">
                <Sidebar />
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
