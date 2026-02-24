import options from './api/connect.js';
import { createElement } from './utils/create_element_utils.js';

const BODY = document.querySelector('body');
const movieArea = BODY.querySelector('.movie-area');
const movieLists = movieArea.querySelector('.lists');

let currentPage = 1; // 현재 페이지
let totalPages = 1; // 전체 페이지(서버 응답 기준)
const PAGE_GROUP_SIZE = 10; // 한페이지에 보이는 번호 개수

// init에서 세팅
let paginationEl;
let paginationListEl;
let prevBtnEl;
let nextBtnEl;

// 장르 (id -> name)
let genreMap = {};

/*
1. init함수 실행
2. 실행된 init함수 내부, 클릭이벤트 연결 및 장르 api 실행
3. 장르 API 실행 - fetchGenres()
4. 페이지 렌더링 실행() - fetchAndRenderMovies()
5. 영화 데이터 가져오기 - fetchMovies()
6. 영화 목록 api 가져오기 - getDiscoverUrl()
7. 영화 목록 렌더링 함수 실행 - renderMovies(data.results)
8. 페이지 렌더링 함수 실행 - renderPagination(currentPage, totalPages)
*/

init(); // 1

// 2
function init() {
  paginationEl = document.querySelector('.pagination');
  paginationListEl = paginationEl?.querySelector('.pagination-list');
  prevBtnEl = paginationEl?.querySelector('.pagination-btn[aria-label="이전 페이지"]');
  nextBtnEl = paginationEl?.querySelector('.pagination-btn[aria-label="다음 페이지"]');

  // pagination 이벤트 연결(있을 때만)
  paginationListEl?.addEventListener('click', onClickPageNumber);
  prevBtnEl?.addEventListener('click', onClickPrev);
  nextBtnEl?.addEventListener('click', onClickNext);

  fetchGenres();
}

// 장르 API - 3
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

    // 장르 세팅 끝 -> 1페이지 영화 호출
    fetchAndRenderMovies(1);
  } catch (err) {
    console.error(err);
  }
}

/* 영화 목록 API */
// 영화 API (URL만듬) - 6
function getDiscoverUrl(page = 1) {
  return (
    'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR' +
    `&page=${page}&sort_by=popularity.desc`
  );
}

// 영화 데이터 가져오기 (서버에서 데이터 가져오기) - 5
async function fetchMovies(page = 1) {
  const res = await fetch(getDiscoverUrl(page), options);
  return res.json();
}

// 영화, 페이지네이션 렌더링 - 4
async function fetchAndRenderMovies(page = 1) {
  currentPage = page;

  try {
    const data = await fetchMovies(page);

    console.log('data::', data);
    totalPages = Math.min(data.total_pages ?? 1, 999);

    renderMovies(data.results); // 영화 목록 렌더링 함수 실행 - 7
    renderPagination(currentPage, totalPages); // 페이지 렌더링 함수 실행 - 8
    //console.log('currentPage', currentPage);
    //console.log('totalPages', totalPages);
  } catch (err) {
    console.error(err);
  }
}
/* //영화 목록 API */

// 페이지네이션 렌더링
function renderPagination(page, total) {
  if (!paginationListEl || !prevBtnEl || !nextBtnEl) return;

  const groupStart = Math.floor((page - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP_SIZE - 1, total);

  // 이전/다음 비활성 처리
  prevBtnEl.disabled = page <= 1;
  nextBtnEl.disabled = page >= total;

  // 페이지 번호 초기화
  paginationListEl.innerHTML = '';

  // 페이지 번호 생성
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

function onClickPageNumber(e) {
  const numBtn = e.target.closest('.pagination-num');
  if (!numBtn) return;

  const page = Number(numBtn.textContent);
  if (!Number.isFinite(page)) return;

  fetchAndRenderMovies(page);
}

function onClickPrev() {
  if (currentPage <= 1) return;
  fetchAndRenderMovies(currentPage - 1);
}

function onClickNext() {
  if (currentPage >= totalPages) return;
  fetchAndRenderMovies(currentPage + 1);
}

// 영화 목록 렌더링
function renderMovies(movies) {
  movieLists.innerHTML = ''; // 기존 내용 초기화

  movies.forEach((movie) => {
    const genreText = movie.genre_ids
      .map((id) => genreMap[id])
      .filter(Boolean)
      .join(', ');

    // li
    const movieItem = createElement('li');

    // a
    const movieLink = createElement('a', ['movie'], { href: '#none' });

    // img
    const moviePoster = createElement('img', ['movie-poster'], {
      alt: movie.title ?? '',
      src: movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : './basic.jpg',
    });

    // 영화 info
    const movieInfo = createElement('div', ['movie-info']);

    // 영화 제목
    const movieTitle = createElement('h3', ['info-tit'], null, movie.title);

    // 영화 설명
    const descriptionOverview =
      !movie.overview || movie.overview.trim() === ''
        ? '해당 언어의 줄거리가 존재하지 않습니다.'
        : movie.overview.slice(0, 17) + '...';
    const movieDescription = createElement('p', ['info-txt'], null, descriptionOverview);

    // 설명
    const movieDetail = createElement('dl', ['movie-info-detail']);

    // 개봉연도
    const movieYearDt = createElement('dt', ['sr-only'], null, '개봉연도');

    // 개봉연도 - 날짜
    const movieYearDd = createElement('dd');
    const movieYearDdTime = createElement(
      'time',
      [],
      { datetime: movie.release_date },
      movie.release_date.slice(0, 4),
    );

    // 장르
    const movieGenreDt = createElement('dt', ['sr-only'], null, '장르');

    // 장르 - 리스트
    const movieGenreDd = createElement('dd', ['genre'], null, genreText);

    // 평점
    const movieRate = createElement('div', ['rate']);
    const movieRateTitle = createElement('span', ['sr-only'], null, '평점');

    const ratingText = movie.vote_average.toFixed(1);

    const movieRating = createElement(
      'span',
      [],
      { 'aria-label': `10점 만점에 ${ratingText}점` },
      `★ ${ratingText}`,
    );

    if (movie.vote_average >= 7.5) {
      movieRating.classList.add('rate-high');
    }

    // console.log(movieLink);
    movieItem.appendChild(movieLink);

    movieLink.appendChild(moviePoster);
    movieLink.appendChild(movieInfo);
    movieInfo.appendChild(movieTitle);
    movieInfo.appendChild(movieDescription);
    movieInfo.appendChild(movieDetail);
    movieDetail.appendChild(movieYearDt);
    movieDetail.appendChild(movieYearDd);
    movieDetail.appendChild(movieGenreDt);
    movieDetail.appendChild(movieGenreDd);
    movieYearDd.appendChild(movieYearDdTime);

    movieLink.appendChild(movieRate);
    movieRate.appendChild(movieRateTitle);
    movieRate.appendChild(movieRating);

    movieLists.appendChild(movieItem);
  });
}
