export function createDetailSelectors(root = document) {
  const trailerModal = root.getElementById('trailer-modal');

  return {
    // summary
    movieSummary: root.querySelector('.movie-summary'),

    // cast
    castList: root.querySelector('.cast-list'),
    castMoreWrapper: root.querySelector('.cast-more-wrapper'),
    castMoreBtn: root.querySelector('.cast-more-btn'),
    castTitle: root.getElementById('cast-title'),

    // stills
    stillsList: root.querySelector('.stills-list'),
    stillsMoreWrapper: root.querySelector('.stills-more-wrapper'),
    stillsMoreBtn: root.querySelector('.stills-more-btn'),

    // reco
    recoList: root.querySelector('.reco .movie-item-list'),

    // trailer button
    trailerBtn: root.querySelector('.js-trailer'),

    // modal common
    trailerModal,
    closeBtn: trailerModal?.querySelector('.trailer-close'),
    iframe: trailerModal?.querySelector('.trailer-iframe'),
    emptyMessage: trailerModal?.querySelector('.trailer-empty'),

    // modal titles/panels
    trailerTitle: root.getElementById('trailer-title'),
    stillsTitle: root.getElementById('stills-modal-title'),
    trailerPanel: trailerModal?.querySelector('.trailer-panel'),
    stillsPanel: trailerModal?.querySelector('.stills-panel'),

    // stills modal ui
    stillsCloseBtn: trailerModal?.querySelector('.stills-close'),
    stillsImg: trailerModal?.querySelector('.stills-modal-img'),
    stillsCounter: trailerModal?.querySelector('.stills-counter'),
    stillsPrevBtn: trailerModal?.querySelector('.stills-prev'),
    stillsNextBtn: trailerModal?.querySelector('.stills-next'),
  };
}
