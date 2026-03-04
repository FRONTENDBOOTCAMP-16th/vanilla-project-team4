import '/src/main.js';
import '/list/movie_list.css';

import { createLoadingOverlay } from '/src/scripts/utils/loading.js';

import { fetchGenresApi, fetchMoviesApi } from '/list/list_api.js';
import { getDom } from '/list/list_selectors.js';
import { state, PAGE_GROUP_SIZE, MAX_PAGES } from '/list/list_state.js';

import { renderGenreRadios } from '/list/list_genreRadio.js';
import { renderPagination } from '/list/list_pagination.js';
import { renderMovies } from '/list/list_movie.js';
import { updateResultHeader } from '/list/list_resultHeader.js';

import { createHandlers } from '/list/list_handlers.js';

init();

function init() {
  const dom = getDom();
  const loading = createLoadingOverlay('영화 목록을 불러오는 중...');

  // no-results 기본 숨김
  if (dom.noResultsEl) dom.noResultsEl.hidden = true;

  // handlers (fetchAndRenderMovies를 주입해야 해서 아래에서 정의)
  const handlers = createHandlers({
    state,
    PAGE_GROUP_SIZE,
    fetchAndRenderMovies,
  });

  dom.paginationListEl?.addEventListener('click', handlers.onClickPageNumber);
  dom.prevBtnEl?.addEventListener('click', handlers.onClickPrev);
  dom.nextBtnEl?.addEventListener('click', handlers.onClickNext);
  dom.genreForm?.addEventListener('change', handlers.onChangeGenre);

  // 장르 먼저 로드
  fetchGenres();

  async function fetchGenres() {
    try {
      const data = await fetchGenresApi();

      // genreMap 만들기
      state.genreMap = {};
      data.genres.forEach((g) => {
        state.genreMap[g.id] = g.name;
      });

      renderGenreRadios(dom.genreWrap, data.genres);

      // 장르 준비 완료 -> 1페이지
      fetchAndRenderMovies(1);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchAndRenderMovies(page = 1) {
    state.currentPage = page;

    loading.show();
    try {
      const data = await fetchMoviesApi({ page, selectedGenreId: state.selectedGenreId });

      state.totalPages = Math.min(data.total_pages ?? 1, MAX_PAGES);
      const movies = data.results ?? [];

      renderMovies(dom.movieLists, movies, {
        genreMap: state.genreMap,
        selectedGenreId: state.selectedGenreId,
      });

      renderPagination(
        dom.paginationListEl,
        dom.prevBtnEl,
        dom.nextBtnEl,
        state.currentPage,
        state.totalPages,
        PAGE_GROUP_SIZE,
      );

      updateResultHeader(
        dom,
        { selectedGenreId: state.selectedGenreId, genreMap: state.genreMap },
        data.total_results ?? movies.length,
      );
    } catch (err) {
      console.error(err);
    } finally {
      loading.hide();
    }
  }
}
