import { draw } from './recomend_movie_ui';
// import dummyMovies from '../data/dummydata';
export function rederCarousel(type, data) {
  let renderData = data;
  if (type === 'infinity') {
    renderData = [...data, ...data, ...data];
  }
  draw(renderData);
}

// rederCarousel('infinity', dummyMovies);
