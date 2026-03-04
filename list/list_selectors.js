export function getDom() {
  const BODY = document.querySelector('body');
  const movieArea = BODY.querySelector('.movie-area');
  const movieLists = movieArea?.querySelector('.lists');

  const resultTitleEl = BODY.querySelector('#genre-result');
  const resultCountEl = resultTitleEl?.querySelector('.result-total .num');
  const noResultsEl = BODY.querySelector('.no-results');
  const filterStatusEl = BODY.querySelector('#filter-status');

  const paginationEl = BODY.querySelector('.pagination');
  const paginationListEl = paginationEl?.querySelector('.pagination-list');
  const prevBtnEl = paginationEl?.querySelector('.pagination-btn[aria-label="이전 10페이지"]');
  const nextBtnEl = paginationEl?.querySelector('.pagination-btn[aria-label="다음 10페이지"]');

  const genreForm = BODY.querySelector('.genre-list');
  const genreWrap = BODY.querySelector('.genres');

  return {
    BODY,
    movieLists,

    resultTitleEl,
    resultCountEl,
    noResultsEl,
    filterStatusEl,

    paginationListEl,
    prevBtnEl,
    nextBtnEl,

    genreForm,
    genreWrap,
  };
}
