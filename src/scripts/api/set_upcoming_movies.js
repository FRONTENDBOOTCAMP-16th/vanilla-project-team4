import { countItem } from '../components/count_item';
import { createMovieList } from '../components/ui/createMovieList';
import { getTodayMovieData } from '../data/get_today_movie_data';

const upcomingContainer = document.querySelector('.upcoming-area');
const upcomingList = upcomingContainer.querySelector('.movie-item-list');
const defaultUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=ko-KR';
const MAX_COUNT = 5;
getTodayMovieData(defaultUrl, 1, MAX_COUNT)
  .then((data) => {
    countItem(MAX_COUNT);
    createMovieList(data, upcomingList);
  })
  .catch(console.error);
