import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Clintify - Premium Music Streaming",
    description: "Discover, stream, and enjoy your favorite music",
    keywords: ["music", "streaming", "playlist", "audio", "music player"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
