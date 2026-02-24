import options from './api/connect.js';
import { createElement } from './utils/create_element_utils.js';

// =====================
// constants
// =====================
const HOME_URL = '/index.html';

// =====================
// utils
// =====================
function redirectHome(message) {
  if (message) alert(message);
  window.location.replace(HOME_URL);
}

function getValidMovieId(rawId) {
  if (!rawId) return null;

  const num = Number(rawId);
  if (!Number.isInteger(num) || num <= 0) return null;

  return num;
}

function handleHttpError(status) {
  switch (status) {
    case 401:
    case 403:
      return redirectHome('인증에 실패했습니다. 관리자에게 문의해주세요. (401/403)');
    case 404:
      return redirectHome('해당 영화를 찾을 수 없습니다. (404)');
    case 429:
      return redirectHome('요청이 너무 많습니다. 잠시 후 다시 시도해주세요. (429)');
    case 500:
    case 502:
    case 503:
      return redirectHome('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (5xx)');
    default:
      return redirectHome(`알 수 없는 오류가 발생했습니다. (${status})`);
  }
}

// =====================
// main
// =====================
const params = new URLSearchParams(window.location.search);
const rawId = params.get('id');
const movieNum = getValidMovieId(rawId);

if (movieNum === null) {
  redirectHome('잘못된 접근입니다. (유효하지 않은 영화 id)');
  throw new Error('Invalid movie id');
}

const detailUrl = `https://api.themoviedb.org/3/movie/${movieNum}?language=ko-KR`;

fetch(detailUrl, options)
  .then((res) => {
    if (!res.ok) {
      handleHttpError(res.status);
      return;
    }
    return res.json();
  })
  .then((data) => {
    if (!data) return;
    console.log(data);
    renderMovieDetail(data);
  })
  .catch((err) => {
    console.error(err);
    redirectHome('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  });

function renderMovieDetail(data) {
  const movieSummary = document.querySelector('.movie-summary');

  const posterImg = movieSummary.querySelector('.movie-poster img');
  const titleEl = movieSummary.querySelector('#movie-title');

  const ratingA11y = movieSummary.querySelector('.meta-item.rating > span');
  const ratingText = movieSummary.querySelector('.meta-item.rating > span > span');

  const yearText = movieSummary.querySelector('.meta-item.year .meta-text');
  const runtimeText = movieSummary.querySelector('.meta-item.runtime .meta-text');
  const genreDd = movieSummary.querySelector('.meta-item.genre');

  const overviewText = movieSummary.querySelector('.overview-text');

  // 뒷배경 img (data.backdrop_path)
  const backdropUrl =
    typeof data.backdrop_path === 'string' && data.backdrop_path.startsWith('/')
      ? `url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})`
      : "url('/src/assets/fallback-backdrop.webp')";

  movieSummary.style.setProperty('--backdrop-url', backdropUrl);

  // 포스터 img (data.poster_path)
  const imgUrl =
    typeof data.poster_path === 'string' && data.poster_path.startsWith('/')
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : '';

  posterImg.src = imgUrl || '/src/assets/fallback-poster.webp';
  posterImg.alt = data.title ? `${data.title} 포스터` : '영화 포스터';

  // 제목 (data.title)
  titleEl.textContent = data.title ?? '';

  // 평점 (data.vote_average)
  const vote = typeof data.vote_average === 'number' ? data.vote_average : null;
  if (vote !== null) {
    const score = vote.toFixed(1);
    ratingText.textContent = `★ ${score}`;
    ratingA11y.setAttribute('aria-label', `10점 만점에 ${score}점`);
  } else {
    ratingText.textContent = '★ N/A';
    ratingA11y.setAttribute('aria-label', '평점 정보 없음');
  }

  // 개봉연도 (data.release_date)
  const year = typeof data.release_date === 'string' ? data.release_date.slice(0, 4) : '';
  yearText.textContent = year || '정보 없음';

  // 런타임 (data.runtime)
  runtimeText.textContent = Number.isFinite(data.runtime) ? `${data.runtime}분` : '정보 없음';

  // 개요 (data.overview)
  overviewText.textContent =
    data.overview && data.overview.trim() !== '' ? data.overview : '개요 정보가 없습니다.';

  // 장르 (data.genres)
  genreDd.textContent = ''; // innerHTML 금지

  if (Array.isArray(data.genres) && data.genres.length) {
    data.genres.forEach((g) => {
      const span = createElement('span', ['genre-item'], null, g.name ?? '');
      genreDd.appendChild(span);
    });
  } else {
    genreDd.appendChild(createElement('span', ['genre-item'], null, '정보 없음'));
  }
}
