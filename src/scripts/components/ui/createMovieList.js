import { createMovieItem } from './create_movie_item_ui';
export function createMovieList(data, el) {
  const fragment = document.createDocumentFragment();

  data.forEach((movie) => {
    fragment.appendChild(createMovieItem(movie));
  });

  el.appendChild(fragment);
}
