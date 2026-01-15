'use client';

import Link from 'next/link';
import { Play, Music, Zap, Heart, Users } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                            <Music className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">Clintify</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
                        <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
                        <Link href="/register" className="btn-primary">Get Started</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-slide-up">
                        <span className="gradient-text">Music for Everyone</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Discover millions of songs, create playlists, and enjoy your favorite artists.
                        Stream music the way it should be.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link href="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                            <Play className="w-5 h-5" fill="currentColor" />
                            Start Listening Now
                        </Link>
                        <Link href="/login" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                            Log in
                        </Link>
                    </div>
                </div>

                {/* Floating Music Cards */}
                <div className="max-w-5xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="aspect-square rounded-2xl glass p-6 flex flex-col items-center justify-center gap-3 animate-fade-in card-hover"
                            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                                <Music className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-center">Playlist {i}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        <span className="gradient-text">Everything You Need</span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass rounded-2xl p-8 card-hover">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-emerald-600/20 flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                            <p className="text-muted-foreground">
                                Instant playback with zero buffering. Experience music the way it should be.
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-8 card-hover">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-6">
                                <Heart className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Personalized</h3>
                            <p className="text-muted-foreground">
                                Create unlimited playlists and get recommendations tailored just for you.
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-8 card-hover">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Social</h3>
                            <p className="text-muted-foreground">
                                Share your favorite tracks and discover what your friends are listening to.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nano Banana Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 animate-slide-in">
                        <div className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden glass shadow-2xl">
                            <img
                                src="/girl_listening_music_smiling.png"
                                alt="Smiling girl listening to music"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex-1 space-y-8">
                        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                            Listen to your soul with <span className="gradient-text">Nano Banana</span>.
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Experience music in its purest form. Our high-fidelity streaming and personalized
                            discovery tools help you find the perfect rhythm for every moment.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Hyper-fidelity audio quality",
                                "Zero ads, pure music",
                                "Offline discovery with Nano Banana",
                                "Exclusive artist premieres"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Start?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join millions of music lovers streaming their favorite songs.
                    </p>
                    <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
                        <Play className="w-5 h-5" fill="currentColor" />
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Clintify</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        © 2026 Clintify. Premium music streaming.
                    </p>
                </div>
            </footer>
        </div>
    );
}
