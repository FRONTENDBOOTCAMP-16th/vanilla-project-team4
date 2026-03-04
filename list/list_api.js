import options from '/src/scripts/api/connect.js';

export async function fetchGenresApi() {
  const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=ko-KR', options);
  return res.json();
}

export function getDiscoverUrl({ page = 1, selectedGenreId = null }) {
  const base =
    'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR' +
    `&page=${page}&sort_by=popularity.desc`;

  const genreParam = selectedGenreId ? `&with_genres=${selectedGenreId}` : '';
  return base + genreParam;
}

export async function fetchMoviesApi({ page = 1, selectedGenreId = null }) {
  const url = getDiscoverUrl({ page, selectedGenreId });
  const res = await fetch(url, options);
  return res.json();
}
