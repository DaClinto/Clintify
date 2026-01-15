'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    author: string;
    date: string;
}

export default function NewsBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            setLoading(true);
            try {
                const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
                const response = await fetch('https://api.pexels.com/v1/search?query=concert+crowd&per_page=4', {
                    headers: { Authorization: apiKey || '' }
                });

                if (!response.ok) throw new Error('Failed to fetch pexels');

                const data = await response.json();
                const titles = [
                    "Grammy Predictions 2026: Who Will Win?",
                    "The Rise of Afro-Beat in Global Charts",
                    "Off-White x Beats: The New Sonic Aesthetic",
                    "Is Digital Audio Really Killing Vinyl?"
                ];

                const mappedBlogs = data.photos.map((p: any, i: number) => ({
                    id: p.id,
                    title: titles[i] || "Latest Music Industry News",
                    excerpt: "An in-depth look at the shifting landscapes of modern sound and performance...",
                    image: p.src.large,
                    author: p.photographer,
                    date: "Oct 24, 2024"
                }));

                setBlogs(mappedBlogs);
            } catch (err) {
                console.error(err);
                // Fallbacks if API fails
                setBlogs([1, 2, 3, 4].map(i => ({
                    id: i,
                    title: "Music Scene Pulse",
                    excerpt: "Checking the latest trends in the music industry...",
                    image: `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80`,
                    author: "Clintify Team",
                    date: "Today"
                })));
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Blogs & News</h2>
                </div>
                <Link href="/app/news" className="text-sm text-primary hover:underline flex items-center gap-1 font-semibold">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {blogs.map((blog) => (
                    <Link
                        key={blog.id}
                        href={`/app/news/${blog.id}`}
                        className="group cursor-pointer glass-premium rounded-2xl overflow-hidden card-hover block hover-lift active-scale"
                    >
                        <div className="relative aspect-[16/10]">
                            <Image
                                src={blog.image}
                                alt={blog.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                        <div className="p-4 space-y-2">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">{blog.date} • By {blog.author}</p>
                            <h3 className="font-bold text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {blog.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                &quot;{blog.excerpt}&quot;
                            </p>
                            <div className="pt-2 flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                READ FULL STORY <ArrowRight className="w-3 h-3" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
