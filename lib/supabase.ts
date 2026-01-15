import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://canygidgntquwraxaglt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_LMkoBvz0Tavx1w_UXAQ6MQ_VXZmheEp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbSong = {
    id: string;
    title: string;
    artist: string;
    description: string | null;
    image_url: string;
    audio_url: string;
    uploaded_by: string; // user identifier or name
    created_at: string;
};
