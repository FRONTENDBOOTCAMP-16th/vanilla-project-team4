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

  data.forEach(({ movieStart }) => {
    const button = createElement(
      'button',
      ['upcoming-button'],
      'aria-pressed:false',
      `${movieStart} 개봉`,
    );

    frag.append(button);
  });
  el.append(frag);
}
