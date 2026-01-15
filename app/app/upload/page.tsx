'use client';

import { useState, useRef } from 'react';
import { useMusicStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Upload, Music, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
    const { currentUser } = useMusicStore();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);

    const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAudioFile(file);

            // Get duration
            const objectUrl = URL.createObjectURL(file);
            const audio = new Audio(objectUrl);
            audio.onloadedmetadata = () => {
                setDuration(audio.duration);
                URL.revokeObjectURL(objectUrl);
            };
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !artist || !imageFile || !audioFile) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const uniqueId = crypto.randomUUID();
            const imagePath = `covers/${uniqueId}-${imageFile.name}`;
            const audioPath = `tracks/${uniqueId}-${audioFile.name}`;

            // 1. Upload Image
            const { data: imageData, error: imageError } = await supabase.storage
                .from('images')
                .upload(imagePath, imageFile);

            if (imageError) throw imageError;

            // 2. Upload Audio
            const { data: audioData, error: audioError } = await supabase.storage
                .from('songs')
                .upload(audioPath, audioFile);

            if (audioError) throw audioError;

            // Get Public URLs
            const { data: { publicUrl: imageUrl } } = supabase.storage.from('images').getPublicUrl(imagePath);
            const { data: { publicUrl: audioUrl } } = supabase.storage.from('songs').getPublicUrl(audioPath);

            // 3. Insert into DB
            const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

            const insertData: any = {
                title,
                artist,
                description,
                image_url: imageUrl,
                audio_url: audioUrl,
                posted_by: currentUser?.name || 'Anonymous',
            };

            // Only add user_id if it's a valid UUID to avoid Supabase errors
            if (currentUser?.id && isUuid(currentUser.id)) {
                insertData.user_id = currentUser.id;
            }

            const { error: dbError } = await supabase.from('songs').insert(insertData);

            if (dbError) throw dbError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/app'); // Verify this route
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to upload song');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="h-full flex items-center justify-center p-6">
                <div className="text-center space-y-4 animate-slide-up">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/20">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">Upload Successful!</h2>
                    <p className="text-muted-foreground">Your song has been added to the library.</p>
                    <p className="text-sm">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 pb-32">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/20 rounded-full text-primary">
                    <Upload className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Upload Music</h1>
                    <p className="text-muted-foreground">Share your tracks with the world</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Song Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. Midnight City"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Artist Name</label>
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. M83"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Posted By</label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-muted-foreground flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {currentUser?.name?.charAt(0) || 'A'}
                                </div>
                                {currentUser?.name || 'Anonymous'}
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 px-1">This track will be attributed to your profile.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all h-32 resize-none"
                                placeholder="Tell us about your track..."
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload Song
                            </>
                        )}
                    </button>
                </form>

                <div className="space-y-6">
                    {/* Image Upload */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                            {imageFile ? (
                                <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-2xl">
                                    <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{imageFile ? 'Change Artwork' : 'Upload Artwork'}</h3>
                                <p className="text-sm text-muted-foreground">{imageFile ? imageFile.name : 'Rectangular or square image (PNG, JPG)'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Audio Upload */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors ${audioFile ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground'}`}>
                                <Music className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{audioFile ? 'Audio Selected' : 'Upload Audio'}</h3>
                                <p className="text-sm text-muted-foreground">{audioFile ? `${audioFile.name} (${Math.floor(duration)}s)` : 'MP3, WAV, or OGG'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
