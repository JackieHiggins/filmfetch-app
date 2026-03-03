const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMoviesByGenre(genreId = '27,878') { 
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
}