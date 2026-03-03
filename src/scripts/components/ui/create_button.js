import { createElement } from '../../utils/create_element_utils';

export function createPrevButton() {
  const button = createElement('button', ['prev', 'carousel-btn'], {
    type: 'button',
    'aria-label': '이전 영화',
  });

  const img = createElement('img', null, {
    src: '/src/assets/icon/left-arrow.svg',
    alt: '',
  });

  button.append(img);
  return button;
}

export function createNextButton() {
  const button = createElement('button', ['next', 'carousel-btn'], {
    type: 'button',
    'aria-label': '다음 영화',
  });

  const img = createElement('img', null, {
    src: '/src/assets/icon/right-arrow.svg',
    alt: '',
  });

  button.append(img);
  return button;
}
