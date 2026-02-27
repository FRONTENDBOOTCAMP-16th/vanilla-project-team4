import { countItem } from '../components/ui/count_item.js';
import { createMovieList } from '../components/ui/createMovieList';
import { getTodayMovieData } from '../data/get_today_movie_data';
import { createLoadingOverlay } from '../utils/loading.js';

const upcomingContainer = document.querySelector('.upcoming-area');
const upcomingList = upcomingContainer.querySelector('.movie-item-list');
const defaultUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=ko-KR';
const MAX_COUNT = 5;
let loading = createLoadingOverlay('영화 준비중입니다. 잠시만 기다려주세요.');

(() => {
  loading.show();
  try {
    getTodayMovieData(defaultUrl, 1, MAX_COUNT)
      .then((data) => {
        countItem(MAX_COUNT);
        createMovieList(data, upcomingList);
      })
      .catch(console.error);
  } catch (error) {
    console.log(error);
  } finally {
    loading.hide();
  }
})();
