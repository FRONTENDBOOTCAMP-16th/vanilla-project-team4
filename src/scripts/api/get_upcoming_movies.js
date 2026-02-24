import options from './connect.js';
import { rederUpcoming } from '../components/render_upcoming.js';
import { upcomingBtn } from '../utils/vertical_carousel_button.js';

const upcomingContainer = document.querySelector('.upcoming-area');
const upcomingList = upcomingContainer.querySelector('.upcoming-movie-container');
const upcomingButton = upcomingContainer.querySelector('.upcoming-date-button');
const introUpcoming = upcomingContainer.querySelector('.intro-upcoming');

const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
const maxMovies = 5;

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMG = '/images/fallback.png';

let upcomingMovies = [];
let page = 1;

function fetchNextPage() {
  const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=${page}`;

  return fetch(upcomingUrl, options)
    .then((res) => res.json())
    .then((json) => {
      const pageMovies = (json.results ?? [])
        .filter((item) => (item.release_date ?? '') >= today)
        .map((item) => {
          const title = item.title ?? item.name ?? '제목 없음';
          const date = item.release_date ?? item.first_air_date ?? '0000-00-00';
          const imgPath = item.poster_path ?? item.backdrop_path ?? null;

          return {
            movieTitle: title,
            movieStart: date,
            movieImage: imgPath ? `${IMG_BASE}${imgPath}` : FALLBACK_IMG,
          };
        });

      upcomingMovies = [...upcomingMovies, ...pageMovies];

      if (upcomingMovies.length >= maxMovies) return;
      page += 1;
      return fetchNextPage();
    });
}

(() => {
  fetchNextPage()
    .then(() => {
      const upcoming5 = upcomingMovies;
      rederUpcoming(upcoming5, upcomingList, introUpcoming, upcomingButton);
      upcomingBtn();
    })
    .catch(console.error);
})();
