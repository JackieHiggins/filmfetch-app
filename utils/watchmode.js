const WATCHMODE_API_KEY = process.env.NEXT_PUBLIC_WATCHMODE_API_KEY;

export async function getStreamingSources(tmdbId) {
    const response = await fetch(
      `https://api.watchmode.com/v1/title/movie-${tmdbId}/sources/?apiKey=${WATCHMODE_API_KEY}`
    );
    const data = await response.json();
    return data; 
}