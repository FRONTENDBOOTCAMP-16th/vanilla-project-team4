// 추후에 고려해 볼 사항 이미지가 한번에 나오게 작동

import { createElement } from '../utils/create_element_utils';
const recomandCarousel = document.querySelector('.card-carousel');
const recomandList = recomandCarousel.querySelector('.movie-item-list');

const frag = document.createDocumentFragment();

export function draw(data) {
  data.forEach(({ movieTitle, movieImage, movieStart }) => {
    const li = createElement('li', ['movie-item']);
    const a = createElement('a', ['movie-item-link'], { href: '#' });
    const img = createElement('img', ['movie-item-image'], {
      src: movieImage,
      alt: movieTitle,
    });

    const dl = createElement('dl');
    const dtTitle = createElement('dt', ['sr-only'], null, '영화 제목');
    const ddTitle = createElement('dd', ['movie-title'], null, movieTitle);
    const dtDate = createElement('dt', ['sr-only'], null, '영화 출시일');
    const ddDate = createElement('dd', ['movie-open-date']);
    const time = createElement('time', [], { datetime: movieStart }, movieStart.slice(0, 4));

    ddDate.append(time);

    dl.append(dtTitle, ddTitle, dtDate, ddDate);
    a.append(img, dl);
    li.append(a);

    frag.append(li);
  });
  recomandList.append(frag);
}

// function _rederCarousel(type, data) {
//   if (data === null || data === undefined) {
//     const nullMessae = '현재 찾으시는 영화 정보가 없습니다 고객센터에 문의해주세요';
//     const nullData = createElement('p', null, null, nullMessae);
//     return recomandList.append(nullData);
//   }
//   if (type === 'infinity') {
//     draw(data);
//     draw(data);
//     draw(data);
//   }
//   draw(data);
// }

// _rederCarousel('infinity', dummyMovies);
// _rederCarousel('infinity');
