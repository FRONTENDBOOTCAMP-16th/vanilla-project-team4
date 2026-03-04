import { createElement } from '/src/scripts/utils/create_element_utils.js';
import fallbackPoster from '/src/assets/fallback-backdrop.webp';

export function renderMovies(movieLists, movies, { genreMap, selectedGenreId }) {
  if (!movieLists) return;

  movieLists.innerHTML = '';

  movies.forEach((movie) => {
    const ids = movie.genre_ids ?? [];

    const orderedIds =
      selectedGenreId && ids.includes(selectedGenreId)
        ? [selectedGenreId, ...ids.filter((id) => id !== selectedGenreId)]
        : ids;

    const names = orderedIds.map((id) => genreMap[id]).filter(Boolean);
    const genreText = names.slice(0, 3).join(', ') + (names.length > 3 ? '...' : '');

    const movieItem = createElement('li');
    const movieLink = createElement('a', ['movie'], { href: `/detail?id=${movie.id}` });

    const moviePoster = createElement('img', ['movie-poster'], {
      alt: movie.title ?? '',
      src: movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : fallbackPoster,
    });

    const movieInfo = createElement('div', ['movie-info']);
    const movieTitle = createElement('h3', ['info-tit'], null, movie.title);

    const descriptionOverview =
      !movie.overview || movie.overview.trim() === ''
        ? '해당 언어의 줄거리가 존재하지 않습니다.'
        : movie.overview.slice(0, 17) + '...';
    const movieDescription = createElement('p', ['info-txt'], null, descriptionOverview);

    const movieDetail = createElement('dl', ['movie-info-detail']);

    const movieYearDt = createElement('dt', ['sr-only'], null, '개봉연도');
    const movieYearDd = createElement('dd');
    const movieYearDdTime = createElement(
      'time',
      [],
      { datetime: movie.release_date },
      movie.release_date?.slice(0, 4) ?? '',
    );

    const movieGenreDt = createElement('dt', ['sr-only'], null, '장르');
    const movieGenreDd = createElement('dd', ['genre'], null, genreText);

    const movieRate = createElement('div', ['rate']);
    const movieRateTitle = createElement('span', ['sr-only'], null, '평점');

    const ratingText = Number.isFinite(movie.vote_average) ? movie.vote_average.toFixed(1) : '0.0';
    const movieRating = createElement(
      'span',
      [],
      { 'aria-label': `10점 만점에 ${ratingText}점` },
      `★ ${ratingText}`,
    );

    if ((movie.vote_average ?? 0) >= 8) {
      movieRating.classList.add('rate-high');
    }

    // assemble
    movieLists.appendChild(movieItem);
    movieItem.appendChild(movieLink);

    movieLink.appendChild(moviePoster);
    movieLink.appendChild(movieInfo);

    movieInfo.append(movieTitle, movieDescription, movieDetail);

    movieDetail.appendChild(movieYearDt);
    movieDetail.appendChild(movieYearDd);
    movieYearDd.appendChild(movieYearDdTime);

    movieDetail.appendChild(movieGenreDt);
    movieDetail.appendChild(movieGenreDd);

    movieLink.appendChild(movieRate);
    movieRate.append(movieRateTitle, movieRating);
  });
}
