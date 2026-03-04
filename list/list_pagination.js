import { createElement } from '/src/scripts/utils/create_element_utils.js';

export function getGroupStart(page, pageGroupSize) {
  return Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;
}

export function renderPagination(
  paginationListEl,
  prevBtnEl,
  nextBtnEl,
  page,
  total,
  pageGroupSize,
) {
  if (!paginationListEl || !prevBtnEl || !nextBtnEl) return;

  const groupStart = getGroupStart(page, pageGroupSize);
  const groupEnd = Math.min(groupStart + pageGroupSize - 1, total);

  const isFirstGroup = page <= pageGroupSize;
  const isLastGroup = groupEnd >= total;

  prevBtnEl.hidden = isFirstGroup;
  prevBtnEl.disabled = isFirstGroup;

  nextBtnEl.hidden = isLastGroup;
  nextBtnEl.disabled = isLastGroup;

  paginationListEl.innerHTML = '';

  for (let i = groupStart; i <= groupEnd; i++) {
    const li = document.createElement('li');
    const numBtn = createElement('button', ['pagination-num'], { type: 'button' }, String(i));

    if (i === page) {
      numBtn.classList.add('is-active');
      numBtn.setAttribute('aria-current', 'page');
    } else {
      numBtn.setAttribute('aria-label', `${i}페이지로 이동`);
    }

    li.appendChild(numBtn);
    paginationListEl.appendChild(li);
  }
}
