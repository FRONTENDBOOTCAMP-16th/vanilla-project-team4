import { createElement } from '/src/scripts/utils/create_element_utils.js';

export function renderGenreRadios(genreWrap, genres) {
  if (!genreWrap) return;

  genreWrap.innerHTML = '';

  // 전체
  const allId = 'genre-all';
  const allInput = createElement('input', [], {
    type: 'radio',
    name: 'genre',
    id: allId,
    checked: true,
  });
  allInput.dataset.genreId = '';

  const allLabel = createElement('label', [], { for: allId }, '전체');

  genreWrap.append(allInput, allLabel);

  // 장르들
  genres.forEach((genre) => {
    const inputId = `genre-${genre.id}`;

    const input = createElement('input', [], {
      type: 'radio',
      name: 'genre',
      id: inputId,
    });
    input.dataset.genreId = String(genre.id);

    const label = createElement('label', [], { for: inputId }, genre.name);

    genreWrap.append(input, label);
  });
}
