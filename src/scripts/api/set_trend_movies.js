import { getMovieData } from '../data/get_movie_data';
import { createMovieList } from '../components/ui/createMovieList';
import { buttonUtil } from '../utils/carousel/carousel_btn_utils';
import { addClones } from '../utils/carousel/crousel_clone_node';
import { countItem } from '../components/count_item';
const trandUrl = 'https://api.themoviedb.org/3/trending/all/day?language=ko-KR';
const trendArea = document.querySelector('.trending-movies-area');
const inputEl = trendArea.querySelector('.movie-item-list');
const MAX_COUNT = 10;
getMovieData(trandUrl, MAX_COUNT).then((data) => {
  countItem(MAX_COUNT);
  createMovieList(data, inputEl);
  addClones(inputEl);
  buttonUtil();
});
