import { lockScroll, unlockScroll } from './detail-scrolllock.js';

export function createDetailModalController({ ui, state, modalTime = 300 }) {
  function showTrailerPanel() {
    if (ui.trailerTitle) ui.trailerTitle.hidden = false;
    if (ui.stillsTitle) ui.stillsTitle.hidden = true;

    if (ui.trailerPanel) ui.trailerPanel.hidden = false;
    if (ui.stillsPanel) ui.stillsPanel.hidden = true;
  }

  function showStillsPanel() {
    if (ui.trailerTitle) ui.trailerTitle.hidden = true;
    if (ui.stillsTitle) ui.stillsTitle.hidden = false;

    if (ui.trailerPanel) ui.trailerPanel.hidden = true;
    if (ui.stillsPanel) ui.stillsPanel.hidden = false;
  }

  function clampStillsIndex() {
    if (!Array.isArray(state.stills) || state.stills.length === 0) return 0;
    if (state.stillIndex < 0) state.stillIndex = state.stills.length - 1;
    if (state.stillIndex >= state.stills.length) state.stillIndex = 0;
    return state.stillIndex;
  }

  function updateStillsModal() {
    if (!ui.stillsImg || !Array.isArray(state.stills) || state.stills.length === 0) return;

    const idx = clampStillsIndex();
    const IMAGE_BASE = 'https://image.tmdb.org/t/p/';
    const SIZE = 'w1280';

    const item = state.stills[idx];
    ui.stillsImg.src = `${IMAGE_BASE}${SIZE}${item.file_path}`;
    ui.stillsImg.alt = `스틸컷 이미지 ${idx + 1}`;

    if (ui.stillsCounter) ui.stillsCounter.textContent = `${idx + 1} / ${state.stills.length}`;

    const disabled = state.stills.length <= 1;
    if (ui.stillsPrevBtn) ui.stillsPrevBtn.disabled = disabled;
    if (ui.stillsNextBtn) ui.stillsNextBtn.disabled = disabled;
  }

  function openTrailerModal() {
    if (!ui.trailerModal) return;

    showTrailerPanel();
    const key = state.trailerKey;

    ui.trailerModal.hidden = false;
    ui.trailerModal.classList.remove('is-closing', 'is-open');

    if (ui.iframe) {
      ui.iframe.src = '';
      ui.iframe.hidden = false;
    }

    if (!key) {
      if (ui.iframe) ui.iframe.hidden = true;
      if (ui.emptyMessage) ui.emptyMessage.hidden = false;
    } else {
      if (ui.emptyMessage) ui.emptyMessage.hidden = true;
    }

    lockScroll(state);
    ui.trailerBtn?.setAttribute('aria-expanded', 'true');

    requestAnimationFrame(() => {
      ui.trailerModal.classList.add('is-open');
      ui.closeBtn?.focus();
    });

    if (key) {
      window.setTimeout(() => {
        if (ui.trailerModal.hidden) return;
        if (!ui.trailerModal.classList.contains('is-open')) return;

        if (ui.iframe) ui.iframe.src = `https://www.youtube.com/embed/${key}?rel=0`;
      }, modalTime);
    }
  }

  function openStillsModal(startIndex = 0) {
    if (!ui.trailerModal) return;
    if (!Array.isArray(state.stills) || state.stills.length === 0) return;

    showStillsPanel();
    state.stillIndex = Number.isInteger(startIndex) ? startIndex : 0;

    ui.trailerModal.hidden = false;
    ui.trailerModal.classList.remove('is-closing', 'is-open');

    lockScroll(state);

    requestAnimationFrame(() => {
      ui.trailerModal.classList.add('is-open');
      ui.stillsCloseBtn?.focus();
    });

    updateStillsModal();
  }

  function closeMediaModal() {
    if (!ui.trailerModal) return;

    ui.trailerModal.classList.remove('is-open');
    ui.trailerModal.classList.add('is-closing');

    if (ui.iframe) ui.iframe.src = '';
    if (ui.emptyMessage) ui.emptyMessage.hidden = true;
    if (ui.iframe) ui.iframe.hidden = false;

    if (ui.stillsImg) ui.stillsImg.src = '';
    if (ui.stillsCounter) ui.stillsCounter.textContent = '';

    ui.trailerBtn?.setAttribute('aria-expanded', 'false');
    ui.trailerBtn?.focus();

    window.setTimeout(() => {
      ui.trailerModal.hidden = true;
      ui.trailerModal.classList.remove('is-closing');

      showTrailerPanel();
      unlockScroll(state);
    }, modalTime);
  }

  function onKeydown(e) {
    if (!ui.trailerModal || ui.trailerModal.hidden) return;

    if (e.key === 'Escape') {
      closeMediaModal();
      return;
    }

    if (ui.stillsPanel && !ui.stillsPanel.hidden) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (state.stills.length <= 1) return;
        state.stillIndex -= 1;
        updateStillsModal();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (state.stills.length <= 1) return;
        state.stillIndex += 1;
        updateStillsModal();
      }
    }
  }

  function prevStills() {
    if (state.stills.length <= 1) return;
    state.stillIndex -= 1;
    updateStillsModal();
  }

  function nextStills() {
    if (state.stills.length <= 1) return;
    state.stillIndex += 1;
    updateStillsModal();
  }

  return {
    openTrailerModal,
    openStillsModal,
    closeMediaModal,
    onKeydown,
    prevStills,
    nextStills,
    updateStillsModal,
  };
}
