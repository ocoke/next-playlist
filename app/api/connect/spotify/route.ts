import querystring from 'querystring';
import { redirect } from 'next/navigation';

export async function GET () {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
    const scope = 'playlist-read-private';

    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
        });

    return redirect(spotifyAuthUrl);
};