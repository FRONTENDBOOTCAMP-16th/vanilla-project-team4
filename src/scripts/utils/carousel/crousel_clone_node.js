export function addClones(list) {
  if (!list) return;
  if (list.dataset.cloned === 'true') return;
  list.dataset.cloned = 'true';

  const items = list.querySelectorAll('.movie-item');
  const total = items.length;
  if (total === 0) return;

  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.dataset.cloned = 'true';
    list.appendChild(clone);
  });

  Array.from(items)
    .reverse()
    .forEach((item) => {
      const clone = item.cloneNode(true);
      clone.dataset.cloned = 'true';
      list.insertBefore(clone, list.firstChild);
    });

  const cloned = document.querySelectorAll('[data-cloned="true"]');

  cloned.forEach((item) => {
    const link = item.querySelector('a');
    if (link) {
      link.setAttribute('tabindex', '-1');
    }
  });
}
