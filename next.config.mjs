/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'canygidgntquwraxaglt.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            },
        ],
    },
};

export default nextConfig;
