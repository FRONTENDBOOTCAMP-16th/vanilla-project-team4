import { renderCast } from './detail-render.js';

export function bindDetailEvents({ ui, state, modal }) {
  if (ui.trailerBtn && ui.trailerModal) {
    ui.trailerBtn.addEventListener('click', modal.openTrailerModal);

    ui.closeBtn?.addEventListener('click', modal.closeMediaModal);
    ui.stillsCloseBtn?.addEventListener('click', modal.closeMediaModal);

    ui.stillsPrevBtn?.addEventListener('click', modal.prevStills);
    ui.stillsNextBtn?.addEventListener('click', modal.nextStills);

    ui.trailerModal.addEventListener('click', (e) => {
      if (e.target === ui.trailerModal) modal.closeMediaModal();
    });

    document.addEventListener('keydown', modal.onKeydown);
  }

  if (ui.stillsMoreBtn) {
    ui.stillsMoreBtn.addEventListener('click', () => {
      modal.openStillsModal(0);
    });
  }

  if (ui.stillsList) {
    ui.stillsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.stills-btn');
      if (!btn) return;
      modal.openStillsModal(Number(btn.dataset.index));
    });
  }

  if (ui.castMoreBtn) {
    ui.castMoreBtn.addEventListener('click', () => {
      if (!Array.isArray(state.cast) || state.cast.length <= 6) return;

      const wasExpanded = state.isCastExpanded;
      state.isCastExpanded = !state.isCastExpanded;

      if (ui.castList) {
        ui.castList.classList.toggle('is-expanded', state.isCastExpanded);
      }

      ui.castMoreBtn.setAttribute('aria-expanded', String(state.isCastExpanded));
      ui.castMoreBtn.textContent = state.isCastExpanded ? '배우 목록 접기' : '배우 목록 더보기';

      renderCast(ui, state, { cast: state.cast });

      if (wasExpanded) {
        ui.castTitle?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    });
  }
}
