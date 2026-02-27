import options from './api/connect.js';
import { createElement } from './utils/create_element_utils.js';
import { createLoadingOverlay } from './utils/loading.js';

/**
 * 영화 목록 페이지
 * - 장르 목록을 먼저 불러와 라디오 버튼을 생성한다.
 * - 선택된 장르/페이지에 따라 TMDB discover API를 호출한다. (getDiscoverUrl)
 * - 영화 리스트 + 결과 헤더(장르명/개수) + 페이지네이션을 렌더링한다.
 */

/* =========================
 * 1. 변수 (Elements & State)
 * ========================= */
const loading = createLoadingOverlay('영화 목록을 불러오는 중...');

const BODY = document.querySelector('body');
const movieArea = BODY.querySelector('.movie-area');
const movieLists = movieArea.querySelector('.lists');

// 결과 헤더/카운트/없음 문구 DOM
const resultTitleEl = BODY.querySelector('#genre-result');
const resultCountEl = resultTitleEl?.querySelector('.result-total .num');
const noResultsEl = BODY.querySelector('.no-results');
const filterStatusEl = BODY.querySelector('#filter-status');

let currentPage = 1; // 현재 페이지
let totalPages = 1; // 전체 페이지(서버 응답 기준, 최대 500 제한)
const PAGE_GROUP_SIZE = 10; // 페이지 번호 묶음(1~10, 11~20 ...)

// pagination elements (init에서 세팅)
let paginationEl;
let paginationListEl;
let prevBtnEl;
let nextBtnEl;

let genreMap = {}; // 장르 (id -> name)
let selectedGenreId = null; // 선택된 장르 id값 (null이면 전체)

/* =========================
 * 2. Init
 * ========================= */
init();

/**
 * 최초 1회 실행
 * - 필요한 DOM을 잡고 이벤트를 연결한다.
 * - 장르를 먼저 불러온 뒤, 1페이지 영화 목록을 호출한다.
 */
function init() {
  // 페이지네이션 DOM
  paginationEl = document.querySelector('.pagination');
  paginationListEl = paginationEl?.querySelector('.pagination-list');
  prevBtnEl = paginationEl?.querySelector('.pagination-btn[aria-label="이전 10페이지"]');
  nextBtnEl = paginationEl?.querySelector('.pagination-btn[aria-label="다음 10페이지"]');

  // 페이지네이션 events
  paginationListEl?.addEventListener('click', onClickPageNumber);
  prevBtnEl?.addEventListener('click', onClickPrev);
  nextBtnEl?.addEventListener('click', onClickNext);

  // 장르 change event
  const genreForm = document.querySelector('.genre-list');
  genreForm?.addEventListener('change', onChangeGenre);

  // no-results 기본 숨김(HTML에 hidden 안 넣었을 때 대비)
  if (noResultsEl) noResultsEl.hidden = true;

  // 장르 세팅 -> 완료 후 1페이지 호출
  fetchGenres();
}

/* =========================
 * 3. Event Handlers
 * ========================= */
/**
 * 페이지 번호 클릭 시 해당 페이지로 이동
 */
function onClickPageNumber(e) {
  const numBtn = e.target.closest('.pagination-num');
  if (!numBtn) return;

  const page = Number(numBtn.textContent);
  if (!Number.isFinite(page)) return;

  fetchAndRenderMovies(page);
}

/**
 * '이전 10페이지' 클릭 시 이전 그룹의 마지막 페이지로 이동
 */
function onClickPrev() {
  const groupStart = getGroupStart(currentPage);
  const prevGroupLast = groupStart - 1;

  if (prevGroupLast < 1) return;
  fetchAndRenderMovies(prevGroupLast);
}

/**
 * '다음 10페이지' 클릭 시 다음 그룹의 첫 페이지로 이동
 */
function onClickNext() {
  const groupStart = getGroupStart(currentPage);
  const nextGroupFirst = groupStart + PAGE_GROUP_SIZE;

  if (nextGroupFirst > totalPages) return;
  fetchAndRenderMovies(nextGroupFirst);
}

/**
 * 장르 라디오 변경 시 선택 장르를 갱신하고 1페이지부터 다시 호출
 */
function onChangeGenre(e) {
  const input = e.target.closest('input[type="radio"][name="genre"]');
  if (!input) return;

  const id = input.dataset.genreId;
  selectedGenreId = id ? Number(id) : null;

  fetchAndRenderMovies(1);
}

/* =========================
 * 4. API
 * ========================= */
/**
 * 장르 목록을 TMDB에서 가져와 genreMap을 만들고, 라디오를 렌더링한다.
 * 완료 후 1페이지 영화 목록을 호출한다.
 */
async function fetchGenres() {
  try {
    const res = await fetch(
      'https://api.themoviedb.org/3/genre/movie/list?language=ko-KR',
      options,
    );
    const data = await res.json();

    genreMap = {};
    data.genres.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });

    renderGenreRadios(data.genres);

    // 장르 준비 완료 -> 1페이지 영화 호출
    fetchAndRenderMovies(1);
  } catch (err) {
    console.error(err);
  }
}

/**
 * discover API URL을 생성한다.
 * - page: 요청할 페이지
 * - selectedGenreId가 있으면 with_genres 파라미터를 추가한다.
 */
function getDiscoverUrl(page = 1) {
  const base =
    'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR' +
    `&page=${page}&sort_by=popularity.desc`;

  const genreParam = selectedGenreId ? `&with_genres=${selectedGenreId}` : '';
  return base + genreParam;
}

/**
 * 영화 목록 데이터를 서버(TMDB)에서 가져온다.
 */
async function fetchMovies(page = 1) {
  const res = await fetch(getDiscoverUrl(page), options);
  return res.json();
}

/**
 * 영화 목록 + 결과 헤더 + 페이지네이션을 함께 갱신한다.
 * - 로딩 표시/숨김을 포함한다.
 * - total_pages는 TMDB 제한에 맞춰 최대 500으로 캡한다.
 */
async function fetchAndRenderMovies(page = 1) {
  currentPage = page;

  loading.show();
  try {
    const data = await fetchMovies(page);

    const MAX_PAGES = 500;
    totalPages = Math.min(data.total_pages ?? 1, MAX_PAGES);
    //console.log(data);
    const movies = data.results ?? [];

    renderMovies(movies);
    renderPagination(currentPage, totalPages);

    // 전체 개수로 바꾸기
    updateResultHeader(data.total_results ?? movies.length);
  } catch (err) {
    console.error(err);
  } finally {
    loading.hide();
  }
}

/* =========================
 * 5. Render
 * ========================= */
/**
 * 장르 라디오를 API 결과 기반으로 자동 생성한다.
 * - "전체"를 맨 앞에 만든다.
 */
function renderGenreRadios(genres) {
  const wrap = document.querySelector('.genres');
  if (!wrap) return;

  wrap.innerHTML = '';

  // 1) 전체
  const allId = 'genre-all';
  const allInput = createElement('input', [], {
    type: 'radio',
    name: 'genre',
    id: allId,
    checked: true,
  });
  allInput.dataset.genreId = ''; // 전체는 빈값

  const allLabel = createElement('label', [], { for: allId }, '전체');

  wrap.appendChild(allInput);
  wrap.appendChild(allLabel);

  // 2) API 장르들
  genres.forEach((genre) => {
    const inputId = `genre-${genre.id}`;

    const input = createElement('input', [], {
      type: 'radio',
      name: 'genre',
      id: inputId,
    });
    input.dataset.genreId = String(genre.id);

    const label = createElement('label', [], { for: inputId }, genre.name);

    wrap.appendChild(input);
    wrap.appendChild(label);
  });
}

/**
 * 페이지네이션을 렌더링한다.
 * - 현재 페이지 기준으로 10개 묶음 윈도우(1~10, 11~20...)를 만든다.
 * - 그룹의 처음/끝이면 이전/다음 버튼을 숨긴다.
 */
function renderPagination(page, total) {
  if (!paginationListEl || !prevBtnEl || !nextBtnEl) return;

  const groupStart = getGroupStart(page);
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, total);

  const isFirstGroup = page <= PAGE_GROUP_SIZE;
  const isLastGroup = groupEnd >= total;

  prevBtnEl.hidden = isFirstGroup;
  prevBtnEl.disabled = isFirstGroup;

  nextBtnEl.hidden = isLastGroup;
  nextBtnEl.disabled = isLastGroup;

  paginationListEl.innerHTML = '';

  for (let i = groupStart; i <= groupEnd; i++) {
    const li = document.createElement('li');
    const numBtn = createElement('button', ['pagination-num'], { type: 'button' }, String(i));

    if (i === page) {
      numBtn.classList.add('is-active');
      numBtn.setAttribute('aria-current', 'page');
    } else {
      numBtn.setAttribute('aria-label', `${i}페이지로 이동`);
    }

    li.appendChild(numBtn);
    paginationListEl.appendChild(li);
  }
}

/**
 * 영화 목록을 렌더링한다.
 * - 장르는 genreMap(id->name)을 이용해 텍스트로 만든다.
 * - 줄거리가 없으면 기본 문구를 표시한다.
 */
function renderMovies(movies) {
  movieLists.innerHTML = '';

  movies.forEach((movie) => {
    const ids = movie.genre_ids ?? [];

    // 선택된 장르가 영화에 있으면 맨 앞으로 보내기
    const orderedIds =
      selectedGenreId && ids.includes(selectedGenreId)
        ? [selectedGenreId, ...ids.filter((id) => id !== selectedGenreId)]
        : ids;

    const names = orderedIds.map((id) => genreMap[id]).filter(Boolean);

    const genreText = names.slice(0, 3).join(', ') + (names.length > 3 ? '...' : '');

    // li
    const movieItem = createElement('li');

    // a
    const movieLink = createElement('a', ['movie'], { href: `movie_detail.html?id=${movie.id}` });

    // img
    const moviePoster = createElement('img', ['movie-poster'], {
      alt: movie.title ?? '',
      src: movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : '/src/assets/fallback-backdrop.webp',
    });

    // info
    const movieInfo = createElement('div', ['movie-info']);
    const movieTitle = createElement('h3', ['info-tit'], null, movie.title);

    const descriptionOverview =
      !movie.overview || movie.overview.trim() === ''
        ? '해당 언어의 줄거리가 존재하지 않습니다.'
        : movie.overview.slice(0, 17) + '...';
    const movieDescription = createElement('p', ['info-txt'], null, descriptionOverview);

    // detail (year/genre)
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

    // rating
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

    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieDescription);
    movieInfo.appendChild(movieDetail);

    movieDetail.appendChild(movieYearDt);
    movieDetail.appendChild(movieYearDd);
    movieYearDd.appendChild(movieYearDdTime);

    movieDetail.appendChild(movieGenreDt);
    movieDetail.appendChild(movieGenreDd);

    movieLink.appendChild(movieRate);
    movieRate.appendChild(movieRateTitle);
    movieRate.appendChild(movieRating);
  });
}

/* =========================
 * 6. Helpers
 * ========================= */
/**
 * 현재 page가 속한 그룹의 시작 페이지를 구한다. (1, 11, 21, ...)
 */
function getGroupStart(page) {
  return Math.floor((page - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
}

/**
 * 선택된 장르 이름을 반환한다. (없으면 "전체")
 */
function getSelectedGenreName() {
  if (!selectedGenreId) return '전체';
  return genreMap[selectedGenreId] ?? '전체';
}

/**
 * 결과 헤더(장르명/개수)와 "결과 없음" 문구를 갱신한다.
 * - count === 0 이면 no-results를 보여준다.
 */
function updateResultHeader(count) {
  if (!resultTitleEl) return;

  const name = getSelectedGenreName();

  // h2의 첫 번째 텍스트 노드를 찾아 장르명 부분만 교체
  const firstTextNode = [...resultTitleEl.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
  if (firstTextNode) firstTextNode.nodeValue = `${name} `;

  if (resultCountEl) resultCountEl.textContent = String(count);

  if (noResultsEl) noResultsEl.hidden = count !== 0;

  if (filterStatusEl) {
    filterStatusEl.textContent = `${name}로 필터링 되었습니다. 결과 ${count}개`;
  }
}
