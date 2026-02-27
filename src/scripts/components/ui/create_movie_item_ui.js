import { createElement } from '../../utils/create_element_utils';

export function createMovieItem({
  movieId,
  movieTitle,
  movieImage,
  movieDescription,
  movieOpen,
  movieGenre,
  movieRate,
}) {
  const movieLinkA = createElement('a', ['movie-link'], {
    href: `/movie_detail.html?id=${movieId}`,
  });

  const movieItemLi = createElement('li', ['movie-item']);

  const moviePosterImg = createElement('img', ['movie-poster'], {
    src: movieImage,
    alt: movieTitle,
    loading: 'lazy',
  });

  const movieInfoDiv = createElement('div', ['movie-info']);
  const movieTitleH3 = createElement('h3', ['info-title', 'aria-hidden'], null, movieTitle);
  const movieDescriptionP = createElement('p', ['info-description'], null, movieDescription);

  const movieInfoDetailDl = createElement('dl', ['movie-info-detail']);

  if (movieOpen) {
    const movieDateDt = createElement('dt', ['sr-only'], null, '개봉연도');
    const movieDateDd = createElement('dd');
    const movieDateTime = createElement('time', null, { datetime: movieOpen }, movieOpen);
    movieDateDd.appendChild(movieDateTime);
    movieInfoDetailDl.append(movieDateDt, movieDateDd);
  }

  if (movieGenre) {
    const movieGenreDt = createElement('dt', ['sr-only'], null, '장르');
    const movieGenreDd = createElement('dd', ['genre'], null, movieGenre);
    movieInfoDetailDl.append(movieGenreDt, movieGenreDd);
  }

  movieInfoDiv.append(movieTitleH3, movieDescriptionP, movieInfoDetailDl);

  if (movieRate != null) {
    const movieRateDiv = createElement('div', ['rate']);
    const movieRateSpan = createElement(
      'span',
      null,
      { 'aria-label': `10점 만점에 ${movieRate}점` },
      `★ ${movieRate}`,
    );
    movieRateDiv.appendChild(movieRateSpan);
    movieLinkA.append(moviePosterImg, movieInfoDiv, movieRateDiv);
  } else {
    movieLinkA.append(moviePosterImg, movieInfoDiv);
  }

  movieItemLi.appendChild(movieLinkA);
  return movieItemLi;
}
