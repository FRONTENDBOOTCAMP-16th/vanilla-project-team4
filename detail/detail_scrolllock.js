export function lockScroll(state) {
  state.savedScrollY = window.scrollY || 0;
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

  document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`);

  document.body.style.top = `-${state.savedScrollY}px`;
  document.body.classList.add('modal-open');
}

export function unlockScroll(state) {
  document.body.classList.remove('modal-open');

  document.body.style.top = '';
  document.documentElement.style.removeProperty('--scrollbar-width');

  window.scrollTo(0, state.savedScrollY);
  state.savedScrollY = 0;
}
