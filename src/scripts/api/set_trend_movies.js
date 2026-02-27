import { getMovieData } from '../data/get_movie_data';
import { createMovieList } from '../components/ui/createMovieList';
import { buttonUtil } from '../utils/carousel/carousel_btn_utils';
import { addClones } from '../utils/carousel/crousel_clone_node';
import { countItem } from '../components/ui/count_item.js';
import { createLoadingOverlay } from '../utils/loading.js';
const trandUrl = 'https://api.themoviedb.org/3/trending/all/day?language=ko-KR';
const trendArea = document.querySelector('.trending-movies-area');
const inputEl = trendArea.querySelector('.movie-item-list');
const MAX_COUNT = 10;

let loading = createLoadingOverlay('영화 준비중입니다. 잠시만 기다려주세요.');
(() => {
  loading.show();
  try {
    getMovieData(trandUrl, MAX_COUNT).then((data) => {
      countItem(MAX_COUNT);
      createMovieList(data, inputEl);
      addClones(inputEl);
      buttonUtil();
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.hide();
  }
})();
