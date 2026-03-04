import { createElement } from '/src/scripts/utils/create_element_utils.js';

export function createHeader() {
  const header = createElement('header', ['header']);

  const h1 = createElement('h1', ['sr-only'], null, '영화 정보 안내 서비스');
  const nav = createElement('nav', ['navigation'], { 'aria-label': '주요 메뉴' });
  const h2 = createElement('h2', ['sr-only'], null, '주요 메뉴');
  const div = createElement('div', ['logo']);
  const lnbDiv = createElement('div', ['lnb']);

  const logo = createElement('a', ['logo'], {
    href: '/',
    'aria-label': '스크립트 디벨로퍼스 홈으로 이동',
  });

  const logoImg = createElement('img', ['logo-img'], {
    src: '/logo.svg',
    alt: '스크립트 디벨로퍼스 로고',
  });

  const home = createElement(
    'a',
    ['sub-nav'],
    { href: '/', 'aria-label': '메인 페이지로 이동' },
    '홈',
  );
  const movieListPage = createElement(
    'a',
    ['sub-nav'],
    { href: '/list', 'aria-label': '영화 목록 페이지로 이동' },
    '영화 목록',
  );

  logo.append(logoImg);
  div.append(logo);
  lnbDiv.append(home, movieListPage);
  nav.append(h2, div, lnbDiv);
  header.append(h1, nav);

  document.body.prepend(header);
}
