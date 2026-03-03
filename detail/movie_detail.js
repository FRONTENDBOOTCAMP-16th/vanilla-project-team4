// 공통 import
import './styles/main.css';

// 자신 페이지 import
import '../movie_detail.css';

import options from '../src/scripts/api/connect.js';
import { createElement } from '../src/scripts/utils/create_element_utils.js';
import { getMovieData } from '../src/scripts/data/get_movie_data.js';
import { createMovieList } from '../src/scripts/components/ui/createMovieList.js';
import { buttonUtil } from '../src/scripts/utils/carousel/carousel_btn_utils.js';
import { addClones } from '../src/scripts/utils/carousel/crousel_clone_node.js';

const HOME_URL = '/index.html';
const MODAL_TIME = 300;

let cast = [];
let isCastExpanded = false;
let trailerKey = null;
let stills = [];
let stillIndex = 0;

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
  const moreWrapper = document.querySelector('.cast-more-wrapper');
  const moreBtn = document.querySelector('.cast-more-btn');

  const castArr = Array.isArray(credits?.cast) ? credits.cast : [];
  const actorsOnly = castArr.filter(
    (person) => person?.known_for_department === 'Acting' || person?.known_for_department == null,
  );

  cast = actorsOnly;

  if (!castList) return;

  if (actorsOnly.length === 0) {
    isCastExpanded = false;
    castList.classList.remove('is-expanded');

    if (moreWrapper) moreWrapper.hidden = true;
    if (moreBtn) {
      moreBtn.disabled = true;
      moreBtn.setAttribute('aria-expanded', 'false');
      moreBtn.textContent = '배우 목록 더보기';
    }

    renderEmptyState(castList, '배우 정보가 없습니다.');
    return;
  }

  const needsMore = actorsOnly.length > 6;

  if (!needsMore) {
    isCastExpanded = false;
    castList.classList.remove('is-expanded');
  }

  if (moreWrapper) moreWrapper.hidden = !needsMore;

  if (moreBtn) {
    moreBtn.disabled = !needsMore;
    moreBtn.setAttribute('aria-expanded', String(isCastExpanded));
    moreBtn.textContent = isCastExpanded ? '배우 목록 접기' : '배우 목록 더보기';
  }

  castList.textContent = '';
  const renderCount = isCastExpanded ? actorsOnly.length : Math.min(6, actorsOnly.length);

  for (let i = 0; i < renderCount; i += 1) {
    castList.appendChild(createCastItem(actorsOnly[i]));
  }
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
  const moreWrapper = document.querySelector('.stills-more-wrapper');

  if (!list) return;

  const backdrops = Array.isArray(data?.backdrops) ? data.backdrops : [];
  const filtered = backdrops.filter((b) => b?.file_path && (b?.iso_639_1 ?? null) === null);

  if (filtered.length === 0) {
    stills = [];
    renderEmptyState(list, '스틸컷 이미지가 없습니다.');
    if (moreWrapper) moreWrapper.hidden = true;
    return;
  }

  stills = filtered.slice(0, 30);

  const thumbs = stills.slice(0, 3);

  list.textContent = '';

  const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
  const SIZE = 'w780';

  thumbs.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'stills-item';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stills-btn';
    btn.dataset.index = String(idx);

    const figure = document.createElement('figure');
    figure.className = 'stills-card';

    const img = document.createElement('img');
    img.className = 'stills-img';
    img.loading = 'lazy';
    img.src = `${IMAGE_BASE}${SIZE}${item.file_path}`;
    img.alt = `스틸컷 이미지 ${idx + 1}`;

    figure.appendChild(img);
    btn.appendChild(figure);
    li.appendChild(btn);
    list.appendChild(li);
  });

  const needsMore = stills.length > 3;

  if (moreWrapper) moreWrapper.hidden = !needsMore;
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

    const results = Array.isArray(data?.results) ? data.results : [];

    const trailer =
      results.find((v) => v?.site === 'YouTube' && v?.type === 'Trailer' && v?.key) ||
      results.find((v) => v?.site === 'YouTube' && v?.type === 'Teaser' && v?.key) ||
      results.find((v) => v?.site === 'YouTube' && v?.key) ||
      null;

    trailerKey = trailer?.key ?? null;
  })
  .catch((err) => {
    console.error(err);
    trailerKey = null;
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
const trailerTitle = document.getElementById('trailer-title');
const stillsTitle = document.getElementById('stills-modal-title');
const trailerPanel = trailerModal?.querySelector('.trailer-panel');
const stillsPanel = trailerModal?.querySelector('.stills-panel');
const stillsCloseBtn = trailerModal?.querySelector('.stills-close');
const stillsImg = trailerModal?.querySelector('.stills-modal-img');
const stillsCounter = trailerModal?.querySelector('.stills-counter');
const stillsPrevBtn = trailerModal?.querySelector('.stills-prev');
const stillsNextBtn = trailerModal?.querySelector('.stills-next');

function showTrailerPanel() {
  if (trailerTitle) trailerTitle.hidden = false;
  if (stillsTitle) stillsTitle.hidden = true;

  if (trailerPanel) trailerPanel.hidden = false;
  if (stillsPanel) stillsPanel.hidden = true;
}

function showStillsPanel() {
  if (trailerTitle) trailerTitle.hidden = true;
  if (stillsTitle) stillsTitle.hidden = false;

  if (trailerPanel) trailerPanel.hidden = true;
  if (stillsPanel) stillsPanel.hidden = false;
}

function openTrailerModal() {
  if (!trailerModal) return;

  showTrailerPanel();
  const key = trailerKey;

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

  lockScroll();
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
    }, MODAL_TIME);
  }
}

function closeMediaModal() {
  if (!trailerModal) return;

  trailerModal.classList.remove('is-open');
  trailerModal.classList.add('is-closing');

  if (iframe) iframe.src = '';
  if (emptyMessage) emptyMessage.hidden = true;
  if (iframe) iframe.hidden = false;

  if (stillsImg) stillsImg.src = '';
  if (stillsCounter) stillsCounter.textContent = '';

  trailerBtn?.setAttribute('aria-expanded', 'false');
  trailerBtn?.focus();

  window.setTimeout(() => {
    trailerModal.hidden = true;
    trailerModal.classList.remove('is-closing');

    showTrailerPanel();
    unlockScroll();
  }, MODAL_TIME);
}

function clampStillsIndex() {
  if (stills.length === 0) return 0;
  if (stillIndex < 0) stillIndex = stills.length - 1;
  if (stillIndex >= stills.length) stillIndex = 0;
  return stillIndex;
}

function updateStillsModal() {
  if (!stillsImg || stills.length === 0) return;

  const idx = clampStillsIndex();
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
  const SIZE = 'w1280';

  const item = stills[idx];
  stillsImg.src = `${IMAGE_BASE}${SIZE}${item.file_path}`;
  stillsImg.alt = `스틸컷 이미지 ${idx + 1}`;

  if (stillsCounter) stillsCounter.textContent = `${idx + 1} / ${stills.length}`;

  const disabled = stills.length <= 1;
  if (stillsPrevBtn) stillsPrevBtn.disabled = disabled;
  if (stillsNextBtn) stillsNextBtn.disabled = disabled;
}

function openStillsModal(startIndex) {
  if (!trailerModal) return;
  if (!Array.isArray(stills) || stills.length === 0) return;

  showStillsPanel();
  stillIndex = Number.isInteger(startIndex) ? startIndex : 0;

  trailerModal.hidden = false;
  trailerModal.classList.remove('is-closing', 'is-open');

  lockScroll();

  requestAnimationFrame(() => {
    trailerModal.classList.add('is-open');
    stillsCloseBtn?.focus();
  });

  updateStillsModal();
}

if (trailerBtn && trailerModal) {
  trailerBtn.addEventListener('click', openTrailerModal);
  closeBtn?.addEventListener('click', closeMediaModal);
  stillsCloseBtn?.addEventListener('click', closeMediaModal);

  stillsPrevBtn?.addEventListener('click', () => {
    if (stills.length <= 1) return;
    stillIndex -= 1;
    updateStillsModal();
  });

  stillsNextBtn?.addEventListener('click', () => {
    if (stills.length <= 1) return;
    stillIndex += 1;
    updateStillsModal();
  });

  trailerModal.addEventListener('click', (e) => {
    if (e.target === trailerModal) closeMediaModal();
  });

  document.addEventListener('keydown', (e) => {
    if (trailerModal.hidden) return;

    if (e.key === 'Escape') {
      closeMediaModal();
      return;
    }

    if (stillsPanel && !stillsPanel.hidden) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stillIndex -= 1;
        updateStillsModal();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stillIndex += 1;
        updateStillsModal();
      }
    }
  });
}

const stillsMoreBtn = document.querySelector('.stills-more-btn');

if (stillsMoreBtn) {
  stillsMoreBtn.addEventListener('click', () => {
    openStillsModal(0);
  });
}

let savedScrollY = 0;

function lockScroll() {
  savedScrollY = window.scrollY || 0;
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`);

  document.body.style.top = `-${savedScrollY}px`;
  document.body.classList.add('modal-open');
}

function unlockScroll() {
  document.body.classList.remove('modal-open');

  document.body.style.top = '';
  document.documentElement.style.removeProperty('--scrollbar-width');

  window.scrollTo(0, savedScrollY);
  savedScrollY = 0;
}

const castMoreBtn = document.querySelector('.cast-more-btn');

if (castMoreBtn) {
  castMoreBtn.addEventListener('click', () => {
    if (!Array.isArray(cast) || cast.length <= 6) return;

    const wasExpanded = isCastExpanded;

    isCastExpanded = !isCastExpanded;

    const castListEl = document.querySelector('.cast-list');
    if (castListEl) {
      castListEl.classList.toggle('is-expanded', isCastExpanded);
    }

    castMoreBtn.setAttribute('aria-expanded', String(isCastExpanded));
    castMoreBtn.textContent = isCastExpanded ? '배우 목록 접기' : '배우 목록 더보기';

    renderCast({ cast });

    if (wasExpanded) {
      document.getElementById('cast-title')?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  });
}

const stillsListEl = document.querySelector('.stills-list');

if (stillsListEl) {
  stillsListEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.stills-btn');
    if (!btn) return;
    openStillsModal(Number(btn.dataset.index));
  });
}
