// 추후에 고려해 볼 사항 이미지가 한번에 나오게 작동

import { createElement } from '../utils/create_element_utils';

const frag = document.createDocumentFragment();

export function drawButton(data, el) {
  if (data === null || data === undefined) {
    const nullMessae = '현재 찾으시는 영화 정보가 없습니다 고객센터에 문의해주세요';
    const nullData = createElement('p', null, null, nullMessae);
    el.append(nullData);
    return;
  }

  data.forEach(({ movieTitle, movieStart }) => {
    const button = createElement('button', ['upcoming-button'], 'aria-pressed:false', ``);
    const title = createElement('span', ['button-title'], null, movieTitle);
    const date = createElement('span', ['button-date'], null, `${movieStart} 개봉 예정`);

    button.append(title, date);

    frag.append(button);
  });
  el.append(frag);
}
