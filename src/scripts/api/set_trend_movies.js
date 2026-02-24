import { getMovieData } from '../data/get_movie_data';
import { createMovieList } from '../components/ui/createMovieList';
import { buttonUtil } from '../utils/carousel_btn_utils';
const trandUrl = 'https://api.themoviedb.org/3/trending/all/day?language=ko-KR';
// const trandArea = document.querySelector('trending-movies-area');
const inputEl = document.querySelector('.movie-item-list');
getMovieData(trandUrl, 10).then((data) => {
  createMovieList(data, inputEl);
  buttonUtil();
});
