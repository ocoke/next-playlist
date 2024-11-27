
import { type NextRequest } from 'next/server'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
// const SPOTIFY_PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists';

async function getSpotifyAccessToken(code: string): Promise<string> {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        }),
    });

    const data = await response.json();
    return data;
}

// async function getSpotifyPlaylists(accessToken: string) {
//     const response = await fetch(SPOTIFY_PLAYLISTS_URL, {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });

//     const data = await response.json();
//     return data.items;
// }

// async function getSpotifyTracks(accessToken: string, playlistId: string) {
//     const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
//         headers: {
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });
//     const data = await response.json();
//     return data.items;
// }

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code');

    if (!code) {
        return Response.json({ error: 'Missing Spotify OAuth code' });
    }

    try {
        const accessToken = await getSpotifyAccessToken(code as string);
    
        return Response.json({ code: 200, response: accessToken });
    } catch (e) {
        console.warn(e);
        return Response.json({ error: 'Failed to fetch token' });
    }
}