import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
export const metadata: Metadata = {
  title: "Next Playlist - Generate your next playlist with AI",
  description: "Generate your next playlist by keywords and your own musical taste. Next Playlist is a playlist recommendation tool designed to generate personalized playlists and suggest music genres, types, or themes based on user preferences and specific inputs. Users can connect it with Spotify, Apple Music (todo), or other streaming services to help AI learn their preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
        <footer
          className="font-sans font-medium text-center my-20"
        >
          <p>
            <Link href="https://github.com/ocoke/next-playlist" className="text-blue-700">Next Playlist</Link>
            <span> is an open-source project.</span><br/>
            <span>&copy; 2024 Next Playlist</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
