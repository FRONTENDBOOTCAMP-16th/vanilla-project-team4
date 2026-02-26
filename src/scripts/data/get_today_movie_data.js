import options from '../api/connect';

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMG = '/images/fallback.png';

let upcomingMovies = [];
let page = 1;

export function getTodayMovieData(url, pageNum, maxIndex) {
  let upcomingUrl = `${url}&page=${pageNum}`;
  const max = maxIndex;

  return fetch(upcomingUrl, options)
    .then((res) => res.json())
    .then((json) => {
      const pageMovies = (json.results ?? [])
        .filter((item) => (item.release_date ?? '') >= today)
        .map((item) => {
          const title = item.title ?? item.name ?? '제목 없음';
          const date = item.release_date ?? item.first_air_date ?? '0000-00-00';
          const imgPath = item.poster_path ?? item.backdrop_path ?? null;

          return {
            movieTitle: title,
            movieOpen: date,
            movieImage: imgPath ? `${IMG_BASE}${imgPath}` : FALLBACK_IMG,
          };
        });

      upcomingMovies = [...upcomingMovies, ...pageMovies];

      if (upcomingMovies.length >= max) return upcomingMovies.slice(0, max);

      page += 1;
      return getTodayMovieData(url, page, maxIndex);
    });
}
