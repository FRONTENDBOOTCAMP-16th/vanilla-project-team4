import { createElement } from './utils/create_element_utils.js';

const API_KEY = import.meta.env.VITE_RMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

// 장르 API
let genreMap = {};

fetch('https://api.themoviedb.org/3/genre/movie/list?language=ko-KR', options)
  .then((res) => res.json())
  .then((data) => {
    data.genres.forEach((genre) => {
      genreMap[genre.id] = genre.name;
    });

    console.log(data);
    console.log(genreMap);
  })
  .catch((err) => console.error(err));

// 영화목록 API
fetch(
  'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-KR&page=1&sort_by=popularity.desc',
  options,
)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    renderMovies(data.results);
  })
  .catch((err) => console.error(err));

const BODY = document.querySelector('body');
const movieArea = BODY.querySelector('.movie-area');
const movieLists = movieArea.querySelector('.lists');

function renderMovies(movies) {
  // console.log(movies);
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
    const movieRating = createElement(
      'span',
      [],
      { 'aria-label': `10점 만점에 ${Number(movie.vote_average.toFixed(2))}점` },
      `★ ${Number(movie.vote_average.toFixed(2))}`,
    );

    console.log(movieLink);
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
