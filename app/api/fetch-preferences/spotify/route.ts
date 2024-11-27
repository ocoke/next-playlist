
import { type NextRequest } from 'next/server'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists';

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
    return data.access_token;
}

async function getSpotifyPlaylists(accessToken: string) {
    const response = await fetch(SPOTIFY_PLAYLISTS_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    return data.items;
}

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
    const token = searchParams.get('token');

    if (!token) {
        return Response.json({ error: 'Missing Spotify OAuth token' });
    }

    try {
        // const accessToken = await getSpotifyAccessToken(code as string);
        const playlists = await getSpotifyPlaylists(token);
        // console.log(playlists)
        // for (const i in playlists) {
        //     const playlist = playlists[i];
        //     const tracks = await getSpotifyTracks(accessToken, playlist.id);
        //     playlist.tracks = tracks;
        // }
        
        return Response.json({ code: 200, response: playlists });
    } catch (e) {
        console.warn(e);
        return Response.json({ error: 'Failed to fetch playlists' });
    }
}