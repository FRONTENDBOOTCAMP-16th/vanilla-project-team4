// (1) 쿼리 파람스 id 읽기
// (2) id 추출 및 에러 처리
// (3) id 를 통해서 api 호출

// (1) 쿼리 파람스 id 읽기
const API_KEY = import.meta.env.VITE_RMDB_API_KEY;
const params = new URLSearchParams(window.location.search);
let movieId = params.get('id');

// (2) id 에러 핸들링
if (!movieId) {
  // 1) 에러 메시지 보여주기
  // 2) list.html로 돌려보내기
  // window.location.href = '/';
  console.log('id params 없어서 임의로 추가');
  movieId = '224372';
}

const movieNum = Number(movieId);
console.log(movieNum);

if (!Number.isInteger(movieNum) || movieNum <= 0) {
  window.location.href = '/';
}

// (3) id를 통해서 api 호출

const detailUrl = `https://api.themoviedb.org/3/movie/${movieNum}?language=ko-KR`;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

fetch(detailUrl, options)
  .then((res) => {
    if (!res.ok) {
      throw new Error('API 호출 실패');
    }
    return res.json();
  })
  .then((data) => {
    console.log('영화 데이터:', data);
  })
  .catch((error) => {
    console.error(error);
  });
