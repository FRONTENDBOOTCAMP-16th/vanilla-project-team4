import { createPrevButton, createNextButton } from '../ui/create_button';

const buttonContainer = document.querySelector('.carousel-controls');

function renderButton() {
  if (!buttonContainer) return;

  const fragment = document.createDocumentFragment();

  const prev = createPrevButton();
  const next = createNextButton();

  fragment.append(prev, next);
  buttonContainer.appendChild(fragment);
}

renderButton();
