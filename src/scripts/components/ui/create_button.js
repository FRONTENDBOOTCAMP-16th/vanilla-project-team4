import { createElement } from '/src/scripts/utils/create_element_utils';
import leftArrow from '/src/assets/icon/left-arrow.svg';
import rightArrow from '/src/assets/icon/right-arrow.svg';

export function createPrevButton() {
  const button = createElement('button', ['prev', 'carousel-btn'], {
    type: 'button',
    'aria-label': '이전 영화',
  });

  const img = createElement('img', null, {
    src: leftArrow,
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
    src: rightArrow,
    alt: '',
  });

  button.append(img);
  return button;
}
