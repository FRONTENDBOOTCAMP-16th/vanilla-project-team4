import { createElement } from '/src/scripts/utils/create_element_utils.js';
import fallbackProfileUrl from '/src/assets/fallback-profile.webp';
import fallbackPosterUrl from '/src/assets/fallback-poster.webp';
import fallbackBackdropUrl from '/src/assets/fallback-backdrop.webp';

export function renderEmptyState(listEl, message) {
  if (!listEl) return;

  const li = document.createElement('li');
  li.className = 'empty-state';
  li.textContent = message;

  listEl.replaceChildren(li);
}

export function renderMovieDetail(ui, data) {
  const movieSummary = ui.movieSummary;
  if (!movieSummary) return;

  const posterImg = movieSummary.querySelector('.movie-poster img');
  const titleEl = movieSummary.querySelector('#movie-title');

  const ratingA11y = movieSummary.querySelector('.rating-a11y');
  const ratingText = movieSummary.querySelector('.rating-text');

  const yearText = movieSummary.querySelector('.meta-item.year .meta-text');
  const runtimeText = movieSummary.querySelector('.meta-item.runtime .meta-text');
  const genreDd = movieSummary.querySelector('.meta-item.genre');

  const overviewText = movieSummary.querySelector('.overview-text');

  const candidateBackdrop =
    typeof data?.backdrop_path === 'string' && data.backdrop_path.startsWith('/')
      ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
      : null;

  const finalBackdrop = candidateBackdrop ?? fallbackBackdropUrl;

  const pre = new Image();
  pre.onload = () => {
    movieSummary.style.setProperty('--backdrop-url', `url(${finalBackdrop})`);
  };
  pre.onerror = () => {
    movieSummary.style.setProperty('--backdrop-url', `url(${fallbackBackdropUrl})`);
  };
  pre.src = finalBackdrop;

  const posterSrc =
    typeof data?.poster_path === 'string' && data.poster_path.startsWith('/')
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : fallbackPosterUrl;

  if (posterImg) {
    posterImg.src = posterSrc;
    posterImg.alt = data?.title ? `${data.title} 포스터` : '영화 포스터';

    posterImg.onerror = () => {
      posterImg.onerror = null;
      posterImg.src = fallbackPosterUrl;
    };
  }

  if (titleEl) titleEl.textContent = data?.title ?? '';

  const vote = typeof data?.vote_average === 'number' ? data.vote_average : null;
  if (ratingText && ratingA11y) {
    if (vote !== null) {
      const score = vote.toFixed(1);
      ratingText.textContent = `★ ${score}`;
      ratingA11y.setAttribute('aria-label', `10점 만점에 ${score}점`);
    } else {
      ratingText.textContent = '★ N/A';
      ratingA11y.setAttribute('aria-label', '평점 정보 없음');
    }
  }

  const year = typeof data?.release_date === 'string' ? data.release_date.slice(0, 4) : '';
  if (yearText) yearText.textContent = year || '정보 없음';

  if (runtimeText) {
    runtimeText.textContent = Number.isFinite(data?.runtime) ? `${data.runtime}분` : '정보 없음';
  }

  if (overviewText) {
    overviewText.textContent =
      typeof data?.overview === 'string' && data.overview.trim() !== ''
        ? data.overview
        : '해당 언어의 줄거리가 존재하지 않습니다.';
  }

  if (!genreDd) return;

  if (Array.isArray(data?.genres) && data.genres.length) {
    const frag = document.createDocumentFragment();

    data.genres.forEach((g) => {
      frag.appendChild(createElement('span', ['genre-item'], null, g?.name ?? ''));
    });

    genreDd.replaceChildren(frag);
  } else {
    genreDd.replaceChildren(createElement('span', ['genre-item'], null, '정보 없음'));
  }
}

export function createCastItem(actor) {
  const li = createElement('li', ['cast-item']);

  const figure = createElement('figure', ['cast-avatar']);
  const img = createElement('img');

  const profilePath = actor?.profile_path?.startsWith('/')
    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
    : fallbackProfileUrl;

  img.src = profilePath;
  img.alt = actor?.name ? `${actor.name} 프로필` : '배우 프로필';

  img.onerror = () => {
    img.onerror = null;
    img.src = fallbackProfileUrl;
  };

  figure.appendChild(img);

  const nameText = actor?.name ? actor.name : '이름 정보 없음';
  const roleText =
    typeof actor?.character === 'string' && actor.character.trim()
      ? actor.character
      : '배역 정보 없음';

  const nameEl = createElement('h3', ['cast-name'], null, nameText);
  const roleEl = createElement('p', ['cast-role'], null, roleText);

  const frag = document.createDocumentFragment();
  frag.append(figure, nameEl, roleEl);

  li.appendChild(frag);
  return li;
}

export function renderCast(ui, state, credits) {
  const castList = ui.castList;
  const moreWrapper = ui.castMoreWrapper;
  const moreBtn = ui.castMoreBtn;

  if (!castList) return;

  const castArr = Array.isArray(credits?.cast) ? credits.cast : [];
  const actorsOnly = castArr.filter(
    (person) => person?.known_for_department === 'Acting' || person?.known_for_department == null,
  );

  state.cast = actorsOnly;

  if (actorsOnly.length === 0) {
    state.isCastExpanded = false;
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

  const needsMore = actorsOnly.length > 7;

  if (!needsMore) {
    state.isCastExpanded = false;
    castList.classList.remove('is-expanded');
  }

  if (moreWrapper) moreWrapper.hidden = !needsMore;

  if (moreBtn) {
    moreBtn.disabled = !needsMore;
    moreBtn.setAttribute('aria-expanded', String(state.isCastExpanded));
    moreBtn.textContent = state.isCastExpanded ? '배우 목록 접기' : '배우 목록 더보기';
  }

  const renderCount = state.isCastExpanded ? actorsOnly.length : Math.min(7, actorsOnly.length);
  const frag = document.createDocumentFragment();

  for (let i = 0; i < renderCount; i += 1) {
    frag.appendChild(createCastItem(actorsOnly[i]));
  }

  castList.replaceChildren(frag);
}

export function renderStills(ui, state, data) {
  const list = ui.stillsList;
  const moreWrapper = ui.stillsMoreWrapper;
  const moreBtn = ui.stillsMoreBtn;

  if (!list) return;

  const backdrops = Array.isArray(data?.backdrops) ? data.backdrops : [];
  const filtered = backdrops.filter((b) => b?.file_path && (b?.iso_639_1 ?? null) === null);

  if (filtered.length === 0) {
    state.stills = [];
    renderEmptyState(list, '스틸컷 이미지가 없습니다.');
    if (moreWrapper) moreWrapper.hidden = true;
    if (moreBtn) moreBtn.hidden = true;
    return;
  }

  state.stills = filtered.slice(0, 30);

  const thumbs = state.stills.slice(0, 3);
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
  const SIZE = 'w780';

  const frag = document.createDocumentFragment();

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

    img.onerror = () => {
      img.onerror = null;
      img.src = fallbackBackdropUrl;
    };

    figure.appendChild(img);
    btn.appendChild(figure);
    li.appendChild(btn);

    frag.appendChild(li);
  });

  list.replaceChildren(frag);

  const needsMore = state.stills.length > 3;
  if (moreWrapper) moreWrapper.hidden = !needsMore;
  if (moreBtn) moreBtn.hidden = !needsMore;
}
