// 추후에 고려해 볼 사항 이미지가 한번에 나오게 작동

import { createElement } from '../utils/create_element_utils';

export function drawUpcoming(data, el1, el2) {
  const frag1 = document.createDocumentFragment();
  const frag2 = document.createDocumentFragment();

  if (data === null || data === undefined) {
    const nullMessae = '현재 찾으시는 영화 정보가 없습니다 고객센터에 문의해주세요';
    const nullData = createElement('p', null, null, nullMessae);
    el1.append(nullData);
    return;
  }

  data.forEach(({ movieId, movieTitle, movieImage, movieStart }) => {
    const a = createElement('a', ['movie-item-link'], { href: `/movie_detail.html?id=${movieId}` });
    const img = createElement('img', ['movie-poster'], {
      src: movieImage,
      alt: movieTitle,
    });

    const dl = createElement('dl');
    const dtTitle = createElement('dt', ['sr-only'], null, '영화 제목');
    const ddTitle = createElement('dd', ['sr-only', 'movie-title'], null, movieTitle);
    const dtDate = createElement('dt', ['sr-only'], null, '영화 출시일');
    const ddDate = createElement('dd', ['sr-only', 'movie-open-date']);
    const time = createElement('time', ['sr-only'], { datetime: movieStart }, movieStart);

    ddDate.append(time);

    dl.append(dtTitle, ddTitle, dtDate, ddDate);
    a.append(img);

    frag1.append(a);
    frag2.append(dl);
  });
  el1.append(frag1);
  el2.append(frag2);
}
