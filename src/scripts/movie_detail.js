import options from './api/connect.js';

// =====================
// constants
// =====================
const HOME_URL = '/index.html';

// =====================
// utils
// =====================
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

// =====================
// main
// =====================
const params = new URLSearchParams(window.location.search);
const rawId = params.get('id');
const movieNum = getValidMovieId(rawId);

if (movieNum === null) {
  redirectHome('잘못된 접근입니다. (유효하지 않은 영화 id)');
  throw new Error('Invalid movie id');
}

const detailUrl = `https://api.themoviedb.org/3/movie/${movieNum}?language=ko-KR`;

fetch(detailUrl, options)
  .then((res) => {
    if (!res.ok) {
      handleHttpError(res.status);
      return;
    }
    return res.json();
  })
  .then((data) => {
    if (!data) return;
    console.log('영화 데이터:', data);
  })
  .catch(() => {
    redirectHome('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
  });
