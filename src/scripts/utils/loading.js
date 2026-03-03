import { createElement } from '../utils/create_element_utils.js';

export function createLoadingOverlay(text = '로딩 중..') {
  const overlay = createElement('div', ['loading-overlay'], {
    'aria-live': 'polite',
    'aria-busy': 'false',
  });
  overlay.hidden = true;

  const box = createElement('div', ['loading-box'], { role: 'status', 'aria-label': text });
  const spinner = createElement('span', ['spinner'], { 'aria-hidden': 'true' });
  const textEl = createElement('p', ['loading-text'], null, text);
  const subText = createElement('p', ['loading-sub'], null, '잠시만 기다려 주세요 ');
  const dots = createElement('span', ['loading-dots'], { 'aria-hidden': 'true' });

  for (let i = 0; i < 3; i++) dots.appendChild(createElement('span'));
  subText.appendChild(dots);

  box.append(spinner, textEl, subText);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // 스크롤 잠금/해제 유틸
  let prevOverflow = '';
  let prevPaddingRight = '';

  const lockScroll = () => {
    const body = document.body;

    // 기존 스타일 저장 (복구용)
    prevOverflow = body.style.overflow;
    prevPaddingRight = body.style.paddingRight;

    // 스크롤바 폭 계산 (레이아웃 점프 방지)
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;
  };

  const unlockScroll = () => {
    const body = document.body;
    body.style.overflow = prevOverflow;
    body.style.paddingRight = prevPaddingRight;
  };

  // 상태 함수
  const setLoading = (isBusy) => {
    overlay.hidden = !isBusy;
    overlay.setAttribute('aria-busy', String(isBusy));

    if (isBusy) lockScroll();
    else unlockScroll();
  };

  return {
    show() {
      setLoading(true);
    },
    hide() {
      setLoading(false);
    },
    // 필요시 사용
    setText(newText) {
      textEl.textContent = newText;
      box.setAttribute('aria-label', newText);
    },
    // 필요시 사용
    destroy() {
      unlockScroll();
      overlay.remove();
    },
  };
}
