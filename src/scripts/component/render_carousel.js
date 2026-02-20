import dummyMovies from '../data/dummydata';
import { draw } from './recomend_movie_ui';
function _rederCarousel(type, data) {
  if (type === 'infinity') {
    draw(data);
    draw(data);
    draw(data);
  }
  draw(data);
}

_rederCarousel('infinity', dummyMovies);
// _rederCarousel('infinity');
