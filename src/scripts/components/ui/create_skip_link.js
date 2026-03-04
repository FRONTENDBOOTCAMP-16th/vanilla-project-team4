import { createElement } from '/src/scripts/utils/create_element_utils';

export function createSkipLink() {
  const skipLink = createElement(
    'a',
    ['skip-link'],
    {
      href: '#main-content',
    },
    '본문으로 바로가기',
  );

  document.body.prepend(skipLink);
}
