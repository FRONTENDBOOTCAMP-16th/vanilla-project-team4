import { getErrorMessage } from '/src/scripts/data/error_message_data.js';
import { createElement } from '/src/scripts/utils/create_element_utils.js';

const params = new URLSearchParams(window.location.search);
const status = Number(params.get('status')) || 0;

const errorContainer = document.querySelector('.error-container');

export function renderError() {
  const message = getErrorMessage(status);

  const wrap = createElement('div', ['error-content']);

  const errCode = createElement('p', ['error-code']);
  errCode.textContent = status ? String(status) : 'ERROR';

  const errMessage = createElement('p', ['error-title']);
  errMessage.textContent = message;

  const link = createElement('a', ['error-home-btn'], { href: '/' }, '메인 페이지로 돌아가기');

  wrap.append(errCode, errMessage, link);
  errorContainer.append(wrap);
}
