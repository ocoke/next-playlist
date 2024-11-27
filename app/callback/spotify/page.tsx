'use client'
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const SpotifyCallbackPage = async () => {
    const router = useRouter();
    const params = useSearchParams();

    useEffect(() => {
        const fetchPreferences = async (code: string) => {
            try {
                const response = await fetch(`/api/token/spotify?code=${code}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Preferences:', data);
                    localStorage.setItem('spotify_user', JSON.stringify(data.response));
                    router.push('/');
                } else {
                    console.error('Failed to fetch preferences');
                }
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        };

        if (params.get('code')) {
            fetchPreferences(params.get('code') as string);
        }
    }, []);

    return (
        <div className="main">
             <div className="h-[80vh] flex justify-center items-center">
              <div className="w-full mx-auto">
                <h1 className="text-3xl font-bold tracking-tighter">Please wait...</h1>
              </div>
            </div>
        </div>
      );;
};

export default SpotifyCallbackPage;