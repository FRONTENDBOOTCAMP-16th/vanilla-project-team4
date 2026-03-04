import { getGroupStart } from '/list/list_pagination.js';

export function createHandlers({ state, PAGE_GROUP_SIZE, fetchAndRenderMovies }) {
  function onClickPageNumber(e) {
    const numBtn = e.target.closest('.pagination-num');
    if (!numBtn) return;

    const page = Number(numBtn.textContent);
    if (!Number.isFinite(page)) return;

    fetchAndRenderMovies(page);
  }

  function onClickPrev() {
    const groupStart = getGroupStart(state.currentPage, PAGE_GROUP_SIZE);
    const prevGroupLast = groupStart - 1;

    if (prevGroupLast < 1) return;
    fetchAndRenderMovies(prevGroupLast);
  }

  function onClickNext() {
    const groupStart = getGroupStart(state.currentPage, PAGE_GROUP_SIZE);
    const nextGroupFirst = groupStart + PAGE_GROUP_SIZE;

    if (nextGroupFirst > state.totalPages) return;
    fetchAndRenderMovies(nextGroupFirst);
  }

  function onChangeGenre(e) {
    const input = e.target.closest('input[type="radio"][name="genre"]');
    if (!input) return;

    const id = input.dataset.genreId;
    state.selectedGenreId = id ? Number(id) : null;

    fetchAndRenderMovies(1);
  }

  return { onClickPageNumber, onClickPrev, onClickNext, onChangeGenre };
}
