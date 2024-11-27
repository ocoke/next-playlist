
import { type NextRequest } from 'next/server'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_PLAYLISTS_URL = 'https://api.spotify.com/v1/me/playlists';

async function getSpotifyTracks(accessToken: string, playlistId: string) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data.items;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token');
    const id = (await params).id;

    if (!token || !id) {
        return Response.json({ error: 'Missing Spotify OAuth token' });
    }

    try {
        // const accessToken = await getSpotifyAccessToken(code as string);
        const playlists = await getSpotifyTracks(token, id);
    
        console.log(playlists)
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