import { draw } from './recomend_movie_ui';
export function rederCarousel(type, data, el) {
  let renderData = data;
  if (type === 'infinity') {
    renderData = [...data, ...data, ...data];
  }
  draw(renderData, el);
}
