import { createMovieList } from '../components/ui/createMovieList';
import { getTodayMovieData } from '../data/get_today_movie_data';

const upcomingContainer = document.querySelector('.upcoming-area');
const upcomingList = upcomingContainer.querySelector('.movie-item-list');
const defaultUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=ko-KR';

getTodayMovieData(defaultUrl, 1, 5)
  .then((data) => {
    createMovieList(data, upcomingList);
  })
  .catch(console.error);
