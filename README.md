# Next Playlist

> 🎵 Generate your next playlist by keywords and your own musical taste.

Next Playlist is a playlist recommendation tool designed to generate personalized playlists and suggest music genres, types, or themes based on user preferences and specific inputs. Users can connect it with Spotify, Apple Music *(todo)*, or other streaming services to help AI learn their preferences.

## 🎵 Try Now

- https://nextplaylist.junx.me

![Sequence 04_1](https://github.com/user-attachments/assets/e85d8d55-bc6d-40b1-b3bf-2d977390f3d4)


## 🌟 Features

- Personalized Playlists: Generates playlists based on user-provided keywords, musical preferences, and mood.
- Genre and Theme Suggestions: Recommends music genres, subgenres, or themes for exploring new sounds.
- User-Defined Parameters: Supports custom inputs like playlist length, season, weather, and preferences for old or new songs.
- Creative Analysis: Provides explanations for recommendations, helping users understand the suggestions.
- Streaming Services Integration: Get your playlist from Spotify or other streaming services to help AI learn your preferences.

## 🔍 AI Services

Next Playlist is currently using Google `Gemini 1.5 Flash 8B` to generate keyword suggestions, and Google `Gemini 1.5 Flash` to generate the playlist. Next Playlist is using [`AI SDK`](https://sdk.vercel.ai/) to generate the response.


## 🚀 Getting Started

This is a new project and may include breaking changes in the future.


1. Clone the repository

```bash
git clone https://github.com/ocoke/next-playlist.git
```

2. Install dependencies

```bash
npm install --save
```

3. Configuring Environmental Variables

```env
GOOGLE_GENERATIVE_AI_API_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=http://[YOUR_DOMAIN]/callback/spotify
```

4. Start

```bash
npm run dev
```
