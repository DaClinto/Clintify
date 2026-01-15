'use client';

import { Compass } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedHero() {
    return (
        <section className="mt-4 mb-6">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            ` }} />

            <div className="relative h-[280px] rounded-3xl overflow-hidden glass shadow-lg group border border-white/5">
                {/* Visual Background (Dynamic Glow) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-950/40 to-black transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse" />

                <div className="relative z-10 h-full w-full px-8 md:px-12 py-8 pt-[5px] pb-[5px] flex flex-col justify-center gap-5">
                    {/* Discovery Mode removed per request */}

                    <div className="space-y-3 animate-slide-up">
                        <h1 className="mt-[10px] text-[34px] md:text-[52px] font-black text-white leading-[0.9] tracking-tighter">
                            EXPLORE <br /> <span className="gradient-text block mt-[13px]">WITH CLINTIFY MUSIC</span>
                        </h1>
                        <p className="text-base text-white/50 max-w-lg font-medium leading-normal">
                            Dive into curated selections and discover your next favorite track.
                            Personalized sonic landscapes updated in real-time.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 animate-fade-in mb-[26px]">
                        <Link
                            href="/app/explore"
                            className="btn-primary px-8 py-3 flex items-center gap-3 font-bold hover:scale-105 transition-all text-sm shadow-xl shadow-primary/20 group/btn"
                        >
                            <span>START JOURNEY</span>
                            <Compass className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Aesthetic Accents */}
                <div className="absolute bottom-6 right-10 flex items-center gap-4 text-white/10 select-none pointer-events-none">
                    <span className="text-[8px] font-bold tracking-[0.6em] uppercase">Clintify Premium</span>
                    <div className="w-8 h-[1px] bg-white/5" />
                </div>
            </div>
        </section>
    );
}
