import options from './api/connect.js';
import { createElement } from './utils/create_element_utils.js';
import { getMovieData } from '../scripts/data/get_movie_data.js';
import { createMovieList } from '../scripts/components/ui/createMovieList.js';
import { buttonUtil } from '../scripts/utils/carousel/carousel_btn_utils.js';
import { addClones } from '../scripts/utils/carousel/crousel_clone_node.js';

const HOME_URL = '/index.html';

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

const params = new URLSearchParams(window.location.search);
const rawId = params.get('id');
const movieNum = getValidMovieId(rawId);

if (movieNum === null) {
  redirectHome('잘못된 접근입니다. (유효하지 않은 영화 id)');
  throw new Error('Invalid movie id');
}

const detailUrl = `https://api.themoviedb.org/3/movie/${movieNum}?language=ko-KR`;
const creditsUrl = `https://api.themoviedb.org/3/movie/${movieNum}/credits?language=ko-KR`;
const stillsUrl = `https://api.themoviedb.org/3/movie/${movieNum}/images?include_image_language=null`;

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
    renderMovieDetail(data);
  })
  .catch((err) => {
    console.error(err);
    redirectHome('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  });

fetch(creditsUrl, options)
  .then((res) => {
    if (!res.ok) return null;
    return res.json();
  })
  .then((data) => {
    if (!data) return renderCast({ cast: [] });
    renderCast(data);
  })
  .catch((err) => {
    console.error(err);
    renderCast({ cast: [] });
  });

fetch(stillsUrl, options)
  .then((res) => {
    if (!res.ok) {
      handleHttpError(res.status);
      return;
    }
    return res.json();
  })
  .then((data) => {
    if (!data) return;
    renderStills(data);
  })
  .catch((err) => {
    console.error(err);
    redirectHome('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  });

function renderMovieDetail(data) {
  const movieSummary = document.querySelector('.movie-summary');

  const posterImg = movieSummary.querySelector('.movie-poster img');
  const titleEl = movieSummary.querySelector('#movie-title');

  const ratingA11y = movieSummary.querySelector('.rating-a11y');
  const ratingText = movieSummary.querySelector('.rating-text');

  const yearText = movieSummary.querySelector('.meta-item.year .meta-text');
  const runtimeText = movieSummary.querySelector('.meta-item.runtime .meta-text');
  const genreDd = movieSummary.querySelector('.meta-item.genre');

  const overviewText = movieSummary.querySelector('.overview-text');

  const backdropUrl =
    typeof data.backdrop_path === 'string' && data.backdrop_path.startsWith('/')
      ? `url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})`
      : "url('/src/assets/fallback-backdrop.webp')";

  movieSummary.style.setProperty('--backdrop-url', backdropUrl);

  const imgUrl =
    typeof data.poster_path === 'string' && data.poster_path.startsWith('/')
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : '';

  posterImg.src = imgUrl || '/src/assets/fallback-poster.webp';
  posterImg.alt = data.title ? `${data.title} 포스터` : '영화 포스터';

  titleEl.textContent = data.title ?? '';

  const vote = typeof data.vote_average === 'number' ? data.vote_average : null;
  if (vote !== null) {
    const score = vote.toFixed(1);
    ratingText.textContent = `★ ${score}`;
    ratingA11y.setAttribute('aria-label', `10점 만점에 ${score}점`);
  } else {
    ratingText.textContent = '★ N/A';
    ratingA11y.setAttribute('aria-label', '평점 정보 없음');
  }

  const year = typeof data.release_date === 'string' ? data.release_date.slice(0, 4) : '';
  yearText.textContent = year || '정보 없음';

  runtimeText.textContent = Number.isFinite(data.runtime) ? `${data.runtime}분` : '정보 없음';

  overviewText.textContent =
    data.overview && data.overview.trim() !== ''
      ? data.overview
      : '해당 언어의 줄거리가 존재하지 않습니다.';

  genreDd.textContent = '';

  if (Array.isArray(data.genres) && data.genres.length) {
    data.genres.forEach((g) => {
      const span = createElement('span', ['genre-item'], null, g.name ?? '');
      genreDd.appendChild(span);
    });
  } else {
    genreDd.appendChild(createElement('span', ['genre-item'], null, '정보 없음'));
  }
}

function renderCast(credits) {
  const castList = document.querySelector('.cast-list');
  const castArr = Array.isArray(credits?.cast) ? credits.cast : [];

  if (castArr.length === 0) {
    renderEmptyState(castList, '배우 정보가 없습니다.');
    return;
  }

  castList.textContent = '';

  castArr.slice(0, 10).forEach((actor) => {
    castList.appendChild(createCastItem(actor));
  });
}

function createCastItem(actor) {
  const li = createElement('li', ['cast-item']);
  const figure = createElement('figure', ['cast-avatar']);
  const img = createElement('img');

  const fallbackProfile = '/src/assets/fallback-profile.webp';
  const profilePath =
    actor && typeof actor.profile_path === 'string' && actor.profile_path.startsWith('/')
      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
      : fallbackProfile;

  img.src = profilePath;
  img.alt = actor && actor.name ? `${actor.name} 프로필` : '배우 프로필';

  img.onerror = () => {
    img.onerror = null;
    img.src = fallbackProfile;
  };

  figure.appendChild(img);

  const nameText = actor && actor.name ? actor.name : '이름 정보 없음';
  const roleText =
    actor && typeof actor.character === 'string' && actor.character.trim()
      ? actor.character
      : '배역 정보 없음';

  li.appendChild(figure);
  li.appendChild(createElement('h3', ['cast-name'], null, nameText));
  li.appendChild(createElement('p', ['cast-role'], null, roleText));

  return li;
}

function renderStills(data) {
  const list = document.querySelector('.stills-list');
  const backdrops = Array.isArray(data?.backdrops) ? data.backdrops : [];
  const stills = backdrops.filter((b) => b?.file_path && (b?.iso_639_1 ?? null) === null);

  if (stills.length === 0) {
    renderEmptyState(list, '스틸컷 이미지가 없습니다.');
    return;
  }

  const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
  const SIZE = 'w780';
  const MAX_STILLS = 30;

  stills.slice(0, MAX_STILLS).forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'stills-item';

    const figure = document.createElement('figure');
    figure.className = 'stills-card';

    const img = document.createElement('img');
    img.className = 'stills-img';
    img.loading = 'lazy';
    img.src = `${IMAGE_BASE}${SIZE}${item.file_path}`;
    img.alt = `스틸컷 이미지 ${idx + 1}`;

    figure.appendChild(img);
    li.appendChild(figure);
    list.appendChild(li);
  });
}

function renderSimilarMovies(movieId) {
  const listEl = document.querySelector('.reco .movie-item-list');
  const similarUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=ko-KR&page=1`;

  getMovieData(similarUrl, 10).then((data) => {
    if (!data || data.length === 0) {
      renderEmptyState(listEl, '비슷한 영화가 없습니다.');
      return;
    }
    createMovieList(data, listEl);
    addClones(listEl);
    buttonUtil();
  });
}

renderSimilarMovies(movieNum);

const videosUrl = `https://api.themoviedb.org/3/movie/${movieNum}/videos?language=ko-KR&include_video_language=ko,en,null`;

fetch(videosUrl, options)
  .then((res) => {
    if (!res.ok) return null;
    return res.json();
  })
  .then((data) => {
    if (!data) return;
    console.log('트레일러', data);
    // 여기서 Trailer/Teaser 중 하나 고르기
    const results = Array.isArray(data?.results) ? data.results : [];

    // 1순위: YouTube Trailer
    const trailer =
      results.find((v) => v?.site === 'YouTube' && v?.type === 'Trailer' && v?.key) ||
      // 2순위: YouTube Teaser
      results.find((v) => v?.site === 'YouTube' && v?.type === 'Teaser' && v?.key) ||
      // 3순위: 그 외 YouTube 아무거나
      results.find((v) => v?.site === 'YouTube' && v?.key) ||
      null;

    // 다음 단계에서 모달 열 때 쓰려고 전역/상태로 저장할 예정
    window.__TRAILER_KEY__ = trailer?.key ?? null;
  })
  .catch((err) => {
    console.error(err);
    window.__TRAILER_KEY__ = null;
  });

function renderEmptyState(listEl, message) {
  if (!listEl) return;

  listEl.textContent = '';

  const li = document.createElement('li');
  li.className = 'empty-state';
  li.textContent = message;

  listEl.appendChild(li);
}

const trailerBtn = document.querySelector('.js-trailer');
const trailerModal = document.getElementById('trailer-modal');
const closeBtn = trailerModal?.querySelector('.trailer-close');
const iframe = trailerModal?.querySelector('.trailer-iframe');

const emptyMessage = trailerModal?.querySelector('.trailer-empty');

function openTrailerModal() {
  if (!trailerModal) return;

  const key = window.__TRAILER_KEY__;

  trailerModal.hidden = false;
  trailerModal.classList.remove('is-closing', 'is-open');

  if (iframe) {
    iframe.src = '';
    iframe.hidden = false;
  }

  if (!key) {
    if (iframe) iframe.hidden = true;
    if (emptyMessage) emptyMessage.hidden = false;
  } else {
    if (emptyMessage) emptyMessage.hidden = true;
  }

  document.body.style.overflow = 'hidden';
  trailerBtn?.setAttribute('aria-expanded', 'true');

  requestAnimationFrame(() => {
    trailerModal.classList.add('is-open');
    closeBtn?.focus();
  });

  if (key) {
    window.setTimeout(() => {
      if (trailerModal.hidden) return;
      if (!trailerModal.classList.contains('is-open')) return;

      if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${key}?rel=0`;
      }
    }, 300);
  }
}

function closeTrailerModal() {
  if (!trailerModal) return;

  trailerModal.classList.remove('is-open');
  trailerModal.classList.add('is-closing');
  document.body.style.overflow = '';

  if (iframe) iframe.src = '';
  if (emptyMessage) emptyMessage.hidden = true;
  if (iframe) iframe.hidden = false;

  trailerBtn?.setAttribute('aria-expanded', 'false');
  trailerBtn?.focus();

  window.setTimeout(() => {
    trailerModal.hidden = true;
    trailerModal.classList.remove('is-closing');
  }, 300);
}

if (trailerBtn && trailerModal) {
  trailerBtn.addEventListener('click', openTrailerModal);
  closeBtn?.addEventListener('click', closeTrailerModal);

  trailerModal.addEventListener('click', (e) => {
    if (e.target === trailerModal) closeTrailerModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!trailerModal.hidden && e.key === 'Escape') closeTrailerModal();
  });
}
