import { countItem } from '/src/scripts/components/ui/create_read_count_item.js';
import { createMovieList } from '/src/scripts/components/ui/create_movie_list';
import { getTodayMovieData } from '/src/scripts/api/get_today_movie_data';

const upcomingContainer = document.querySelector('.upcoming-area');
const upcomingList = upcomingContainer.querySelector('.movie-item-list');
const defaultUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=ko-KR';
const MAX_COUNT = 5;

export async function today() {
  try {
    const data = await getTodayMovieData(defaultUrl, 1, MAX_COUNT);

    countItem(MAX_COUNT);
    createMovieList(data, upcomingList);
  } catch (e) {
    console.error(e);
  }
}
