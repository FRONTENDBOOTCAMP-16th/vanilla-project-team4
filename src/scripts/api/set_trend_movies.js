import { getMovieData } from '../data/get_movie_data';
import { createMovieList } from '../components/ui/createMovieList';
import { buttonUtil } from '../utils/carousel/carousel_btn_utils';
import { addClones } from '../utils/carousel/crousel_clone_node';
const trandUrl = 'https://api.themoviedb.org/3/trending/all/day?language=ko-KR';
const trendArea = document.querySelector('.trending-movies-area');
const inputEl = trendArea.querySelector('.movie-item-list');
getMovieData(trandUrl, 10).then((data) => {
  createMovieList(data, inputEl);
  addClones(inputEl);
  buttonUtil();
});
