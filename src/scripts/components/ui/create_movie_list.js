import { createMovieItem } from '/src/scripts/components/ui/create_movie_item_ui.js';

export function createMovieList(data, el) {
  const fragment = document.createDocumentFragment();

  data.forEach((movie) => {
    fragment.appendChild(createMovieItem(movie));
  });

  el.appendChild(fragment);
}
