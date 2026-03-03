import { getMovieData } from '/src/scripts/api/get_movie_data';
import { createMovieList } from '/src/scripts/components/ui/create_movie_list.js';
import { buttonUtil } from '/src/scripts/utils/carousel/carousel_btn_utils';
import { addClones } from '/src/scripts/utils/carousel/crousel_clone_node';
import { countItem } from '/src/scripts/components/ui/create_read_count_item.js';

const trandUrl = 'https://api.themoviedb.org/3/trending/all/day?language=ko-KR';
const trendArea = document.querySelector('.trending-movies-area');
const inputEl = trendArea.querySelector('.movie-item-list');
const MAX_COUNT = 10;

export async function trand() {
  const data = await getMovieData(trandUrl, MAX_COUNT);

  countItem(MAX_COUNT);
  createMovieList(data, inputEl);
  addClones(inputEl);
  buttonUtil();
}
