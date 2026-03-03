import options from '../api/connect.js';
import { getMovieData } from '../../scripts/data/get_movie_data.js';
import { createMovieList } from '../../scripts/components/ui/createMovieList.js';
import { buttonUtil } from '../../scripts/utils/carousel/carousel_btn_utils.js';
import { addClones } from '../../scripts/utils/carousel/crousel_clone_node.js';
import { createDetailState } from './detail-state.js';
import { createDetailSelectors } from './detail-selectors.js';
import {
  buildDetailUrls,
  fetchDetail,
  fetchCredits,
  fetchStills,
  fetchTrailerKey,
} from './detail-api.js';
import { renderMovieDetail, renderCast, renderStills, renderEmptyState } from './detail-render.js';
import { createDetailModalController } from './detail-modal.js';
import { bindDetailEvents } from './detail-events.js';

const MODAL_TIME = 300;
const HOME_URL = '/index.html';

// 임시 방편 (404 페이지로 대체)
function redirectHome(message) {
  if (message) alert(message);
  window.location.replace(HOME_URL);
}

function getValidMovieId(rawId) {
  if (!rawId) return null;

  const num = Number(rawId);
  if (!Number.isInteger(num) || num <= 0) return null;

  return num;
}

function handleHttpError(status) {
  switch (status) {
    case 401:
    case 403:
      return redirectHome('인증에 실패했습니다. 관리자에게 문의해주세요. (401/403)');
    case 404:
      return redirectHome('해당 영화를 찾을 수 없습니다. (404)');
    case 429:
      return redirectHome('요청이 너무 많습니다. 잠시 후 다시 시도해주세요. (429)');
    case 500:
    case 502:
    case 503:
      return redirectHome('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요. (5xx)');
    default:
      return redirectHome(`알 수 없는 오류가 발생했습니다. (${status})`);
  }
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
  const ui = createDetailSelectors(document);
  const state = createDetailState();

  const params = new URLSearchParams(window.location.search);
  const rawId = params.get('id');
  const movieNum = getValidMovieId(rawId);

  if (movieNum === null) {
    redirectHome('잘못된 접근입니다. (유효하지 않은 영화 id)');
    throw new Error('Invalid movie id');
  }

  const urls = buildDetailUrls(movieNum);

  const modal = createDetailModalController({ ui, state, modalTime: MODAL_TIME });
  bindDetailEvents({ ui, state, modal });

  const detail = await fetchDetail(urls.detailUrl, options);
  if (!detail.ok) {
    handleHttpError(detail.status);
    return;
  }
  renderMovieDetail(ui, detail.data);

  const credits = await fetchCredits(urls.creditsUrl, options);
  renderCast(ui, state, credits);

  const stills = await fetchStills(urls.stillsUrl, options);
  if (!stills.ok) {
    handleHttpError(stills.status);
    return;
  }
  renderStills(ui, state, stills.data);

  renderSimilarMovies(movieNum, ui);

  state.trailerKey = await fetchTrailerKey(urls.videosUrl, options);
}

initDetailPage().catch((err) => {
  console.error(err);
  alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  window.location.replace(HOME_URL);
});
