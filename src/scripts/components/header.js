/*
HTML : <header id="headerArea"></header> 바디 최상단에 사용해주세요.
*/

import { el } from '../utils/dom.js';
import searchIcon from '../../assets/icons/search_icon.svg';
import clearIcon from '../../assets/icons/clear_icon.svg';
import userIcon from '../../assets/icons/user_icon.svg';
import logoImg from '../../assets/images/logo.svg';

export const initHeader = (props = { isLoggedIn: false }) => {
  const headerArea = document.querySelector('#headerArea');
  if (!headerArea) return;

  const menuItems = [
    { name: '홈', href: '/index.html', active: true },
    { name: '영화', href: '/movies/index.html', active: false },
  ];

  const input = el('input', {
    type: 'search',
    id: 'search-input',
    className: 'header-search-input',
    placeholder: '제목, 사람, 장르',
    autocomplete: 'off',
  });

  const searchWrapper = el('div', { id: 'search-wrapper', className: 'header-search-wrapper' });

  // 헤더 구조 조립
  const nav = el(
    'nav',
    { className: 'header-nav', 'aria-label': '메인 네비게이션' },
    // 왼쪽 그룹
    el(
      'div',
      { className: 'header-left' },
      el(
        'h1',
        { className: 'header-logo' },
        el(
          'a',
          { href: '/index.html', 'aria-label': '홈으로 이동' },
          el('img', { src: logoImg, alt: '스크립트 디렉터스', className: 'header-logo-img' }),
        ),
      ),
      el(
        'ul',
        { className: 'header-menu' },
        ...menuItems.map((item) =>
          el(
            'li',
            {},
            el(
              'a',
              {
                href: item.href,
                className: `header-menu-link ${item.active ? 'active' : ''}`,
                'aria-current': item.active ? 'page' : null,
              },
              item.name,
            ),
          ),
        ),
      ),
    ),
    // 오른쪽 그룹
    el(
      'div',
      { className: 'header-right' },
      el(
        'form',
        {
          className: 'header-search-form',
          id: 'search-form',
          role: 'search',
          onsubmit: (e) => e.preventDefault(),
        },
        searchWrapper.append(
          el(
            'button',
            {
              type: 'button',
              id: 'search-toggle-btn',
              className: 'header-search-toggle',
              'aria-label': '검색창 열기',
              onclick: () => {
                searchWrapper.classList.add('is-active');
                input.focus();
              },
            },
            el('img', { src: searchIcon, className: 'icon-search', 'aria-hidden': 'true' }),
          ),
          el(
            'div',
            { className: 'header-search-input-group' },
            el('label', { htmlFor: 'search-input', className: 'sr-only' }, '영화 검색'),
            input,
            el(
              'button',
              {
                type: 'button',
                id: 'search-clear-btn',
                className: 'header-search-clear',
                'aria-label': '검색어 지우기',
                onclick: () => {
                  searchWrapper.classList.remove('is-active');
                  input.value = '';
                },
              },
              el('img', { src: clearIcon, className: 'icon-clear', 'aria-hidden': 'true' }),
            ),
          ),
        ) || searchWrapper, // append 후 searchWrapper 반환
      ),
      el(
        'div',
        { className: 'header-user-group' },
        props.isLoggedIn
          ? el(
              'a',
              { href: '/mypage', className: 'header-mypage-link' },
              el('img', { src: userIcon, className: 'icon-user', alt: '마이페이지' }),
            )
          : el('a', { href: '/login', className: 'header-login-link' }, '로그인'),
      ),
    ),
  );

  // 화면 렌더링
  while (headerArea.firstChild) headerArea.removeChild(headerArea.firstChild);
  headerArea.appendChild(nav);

  // 스크롤 이벤트
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  });
};
