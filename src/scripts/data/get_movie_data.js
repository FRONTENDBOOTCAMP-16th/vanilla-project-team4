import options from '../api/connect';

export function getMovieData(url, count) {
  const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
  const FALLBACK_IMG = '/images/fallback.png';

  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return (json.results ?? []).slice(0, `${count}`).map((item) => {
        const movieId = item.id;
        const title = item.title ?? item.name ?? '제목 없음';
        const date = item.release_date ?? item.first_air_date ?? null;
        const imgPath = item.poster_path ?? item.backdrop_path ?? null;

        return {
          movieId,
          movieTitle: title,
          movieOpen: date,
          movieImage: imgPath ? `${IMG_BASE}${imgPath}` : FALLBACK_IMG,
        };
      });
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
