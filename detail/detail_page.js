import '/src/main.js';

import '/src/styles/movie_main.css';
import '/detail/movie_detail.css';

import options from '/src/scripts/api/connect.js';
import { getMovieData } from '/src/scripts/api/get_movie_data.js';
import { createMovieList } from '/src/scripts/components/ui/create_movie_list.js';
import { buttonUtil } from '/src/scripts/utils/carousel/carousel_btn_utils.js';
import { addClones } from '/src/scripts/utils/carousel/crousel_clone_node.js';
import { createDetailState } from '/detail/detail_state.js';
import { createDetailSelectors } from '/detail/detail_selectors.js';
import {
  buildDetailUrls,
  fetchDetail,
  fetchCredits,
  fetchStills,
  fetchTrailerKey,
} from '/detail/detail_api.js';
import {
  renderMovieDetail,
  renderCast,
  renderStills,
  renderEmptyState,
} from '/detail/detail_render.js';
import { createDetailModalController } from '/detail/detail_modal.js';
import { bindDetailEvents } from '/detail/detail_events.js';
import { createLoadingOverlay } from '/src/scripts/utils/loading.js';

const MODAL_TIME = 300;

const loading = createLoadingOverlay('영화 목록을 불러오는 중...');

function redirectToError(status) {
  window.location.href = `/error?status=${status}`;
}

function getValidMovieId(rawId) {
  if (!rawId) return null;

  const num = Number(rawId);
  if (!Number.isInteger(num) || num <= 0) return null;

  return num;
}

function renderSimilarMovies(movieId, ui) {
  const listEl = ui.recoList;
  const similarUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=ko-KR&page=1`;

  getMovieData(similarUrl, 10).then((data) => {
    if (!data || data.length === 0) {
      renderEmptyState(listEl, '비슷한 영화가 없습니다.');
      return;
    }
    createMovieList(data, listEl);
    addClones(listEl);
    buttonUtil();
  });
}

async function initDetailPage() {
  loading.show();

  try {
    const ui = createDetailSelectors(document);
    const state = createDetailState();

    const params = new URLSearchParams(window.location.search);
    const rawId = params.get('id');
    const movieNum = getValidMovieId(rawId);

    if (movieNum === null) {
      redirectToError(400);
      return;
    }

    const urls = buildDetailUrls(movieNum);

    const modal = createDetailModalController({ ui, state, modalTime: MODAL_TIME });
    bindDetailEvents({ ui, state, modal });

    const detail = await fetchDetail(urls.detailUrl, options);
    if (!detail.ok) {
      redirectToError(detail.status);
      return;
    }
    renderMovieDetail(ui, detail.data);

    const credits = await fetchCredits(urls.creditsUrl, options);
    renderCast(ui, state, credits);

    const stills = await fetchStills(urls.stillsUrl, options);
    if (!stills.ok) {
      redirectToError(stills.status);
      return;
    }
    renderStills(ui, state, stills.data);

    renderSimilarMovies(movieNum, ui);

    state.trailerKey = await fetchTrailerKey(urls.videosUrl, options);
  } catch (err) {
    redirectToError(503);
  } finally {
    loading.hide();
  }
}

initDetailPage().catch(() => {
  redirectToError(0);
});
