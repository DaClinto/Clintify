'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMusicStore } from '@/lib/store';
import { generateId } from '@/lib/sampleData';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function NewPlaylistPage() {
    const router = useRouter();
    const { createPlaylist } = useMusicStore();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        const playlist = {
            id: generateId(),
            name: name.trim(),
            description: description.trim(),
            trackIds: [],
            coverUrl: '',
            isPublic,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        createPlaylist(playlist);
        router.push(`/app/playlist/${playlist.id}`);
    };

    return (
        <div className="min-h-full p-8">
            <Link
                href="/app/library"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Library
            </Link>

            <div className="max-w-2xl">
                <h1 className="text-4xl font-bold mb-8">Create Playlist</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Cover Image</label>
                        <div className="w-48 h-48 rounded-lg bg-secondary/50 flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer group">
                            <div className="text-center">
                                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
                                <p className="text-sm text-muted-foreground">Upload cover</p>
                                <p className="text-xs text-muted-foreground">(Coming soon)</p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Playlist Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field w-full"
                            placeholder="My Awesome Playlist"
                            required
                            maxLength={100}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field w-full min-h-[100px] resize-y"
                            placeholder="Add an optional description"
                            maxLength={300}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {description.length}/300 characters
                        </p>
                    </div>

                    {/* Privacy */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Privacy</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsPublic(true)}
                                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${isPublic
                                        ? 'border-primary bg-primary/10 text-foreground'
                                        : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                                    }`}
                            >
                                <p className="font-semibold mb-1">Public</p>
                                <p className="text-xs opacity-75">Anyone can see this playlist</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsPublic(false)}
                                className={`flex-1 px-6 py-4 rounded-lg border-2 transition-all ${!isPublic
                                        ? 'border-primary bg-primary/10 text-foreground'
                                        : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                                    }`}
                            >
                                <p className="font-semibold mb-1">Private</p>
                                <p className="text-xs opacity-75">Only you can see this playlist</p>
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create Playlist
                        </button>
                        <Link href="/app/library" className="btn-secondary">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
