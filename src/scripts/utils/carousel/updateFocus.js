export function updateFocusRing(currentIndex, items, visibleCount = 5) {
  if (!updateFocusRing.links) {
    updateFocusRing.links = Array.from(items).map((item) => item.querySelector('.movie-link'));
  }

  updateFocusRing.links.forEach((link, i) => {
    const isVisible = i >= currentIndex && i < currentIndex + visibleCount;
    const targetTabindex = isVisible ? '0' : '-1';

    if (link.getAttribute('tabindex') !== targetTabindex) {
      link.setAttribute('tabindex', targetTabindex);
      link.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
    }
  });
}

updateFocusRing.links = null;
