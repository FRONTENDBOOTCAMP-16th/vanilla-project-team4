const API_KEY = import.meta.env.VITE_RMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

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
    // li
    const movieItem = document.createElement('li');

    // img
    const moviePoster = document.createElement('img');
    moviePoster.className = 'movie-poster';
    moviePoster.alt = movie.title;
    moviePoster.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : './basic.jpg';

    // a
    const movieLink = document.createElement('a');
    movieLink.classList.add('movie');
    movieLink.href = '#none';

    // 영화 info
    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');

    // 영화 제목
    const movieTitle = document.createElement('h3');
    movieTitle.classList.add('info-tit');
    movieTitle.textContent = movie.title;

    // 영화 설명
    const movieDescription = document.createElement('p');
    movieDescription.classList.add('info-txt');
    const descriptionOverview = movie.overview;
    movieDescription.textContent = descriptionOverview;
    if (!movie.overview || movie.overview.trim() === '') {
      movieDescription.textContent = '해당 언어의 줄거리가 존재하지 않습니다.';
    } else {
      movieDescription.textContent = movie.overview.slice(0, 17) + '...';
    }

    // 설명
    const movieDetail = document.createElement('dl');
    movieDetail.classList.add('movie-info-detail');

    // 개봉연도
    const movieYearDt = document.createElement('dt');
    movieYearDt.className = 'sr-only';
    movieYearDt.textContent = '개봉연도';

    // 개봉연도 - 날짜
    const movieYearDd = document.createElement('dd');
    const yearDd = movie.release_date.slice(0, 4);

    const yearTime = document.createElement('time');
    yearTime.dateTime = movie.release_date;
    yearTime.textContent = movie.release_date;

    movieYearDd.textContent = yearDd;

    const movieGenreDt = document.createElement('dt');
    movieGenreDt.className = 'sr-only';
    movieGenreDt.textContent = '장르';

    const movieGenreDd = document.createElement('dd');
    movieGenreDd.classList.add('genre');
    movieGenreDd.textContent = movie.genre_ids;

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

    movieLists.appendChild(movieItem);
  });
}
