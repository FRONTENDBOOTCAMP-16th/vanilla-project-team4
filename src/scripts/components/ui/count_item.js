import { createElement } from '../../utils/create_element_utils';
const itemList = document.querySelector('.movie-item-list');
export function countItem(index) {
  const p = createElement(
    'p',
    ['count-item', 'sr-only'],
    null,
    `총 ${index}개의 영화 정보가 있습니다`,
  );

  itemList.prepend(p);
}
