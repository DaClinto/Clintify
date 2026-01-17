'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music, Mail, Lock } from 'lucide-react';
import { useMusicStore } from '@/lib/store';
import { generateId } from '@/lib/sampleData';

export default function LoginPage() {
    const router = useRouter();
    const { setCurrentUser } = useMusicStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Demo authentication - any credentials work
        const user = {
            id: generateId(),
            name: email.split('@')[0],
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            createdAt: new Date().toISOString(),
        };

        setCurrentUser(user);
        router.push('/app');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                        <Music className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-3xl font-bold gradient-text">Clintify</span>
                </Link>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Login to continue streaming</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field w-full pl-12"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field w-full pl-12"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Log In
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-secondary/50 px-4 text-muted-foreground">
                                Demo Mode
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        <p className="text-muted-foreground mb-4">
                            This is a demo app. Any email/password will work!
                        </p>
                        <p className="text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-primary hover:underline font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
