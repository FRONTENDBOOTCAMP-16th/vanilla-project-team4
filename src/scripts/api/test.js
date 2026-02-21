import options from './connect.js';
import { rederCarousel } from '../component/render_carousel.js';
import { btnUtils } from '../utils/carousel_btn_utils.js';
const url = 'https://api.themoviedb.org/3/trending/all/day?language=ko-KR';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMG = '/images/fallback.png';

(() => {
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      const top10 = (json.results ?? []).slice(0, 10).map((item) => {
        const title = item.title ?? item.name ?? '제목 없음';
        const date = item.release_date ?? item.first_air_date ?? '0000-00-00';
        const imgPath = item.poster_path ?? item.backdrop_path ?? null;

        return {
          movieTitle: title,
          movieStart: date,
          movieImage: imgPath ? `${IMG_BASE}${imgPath}` : FALLBACK_IMG,
        };
      });

      rederCarousel('infinity', top10);
      btnUtils();
    })
    .catch(console.error);
})();
