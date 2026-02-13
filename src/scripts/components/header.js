/* [팀 가이드: 헤더 적용 방법]
1. HTML: <body> 최상단에 <div id="header"></div>를 추가해주세요.
2. CSS: _base.css, _theme.css, _animation.css 로드 후 header.css를 로드해주세요.
3. JS: 아래 예시 코드를 js에 넣어서 활성화합니다.
// 예시 코드
import { header } from './scripts/components/header.js';

const headerArea = document.querySelector('#header');

if (headerArea) {
  // 1. 헤더 컴포넌트 삽입
  headerArea.appendChild(header({ isLoggedIn: false }));

  // 2. 검색 인터랙션 관련 요소 찾기
  const searchWrapper = document.querySelector('#search-wrapper');
  const searchBtn = document.querySelector('#search-toggle-btn');
  const clearBtn = document.querySelector('#search-clear-btn');
  const input = document.querySelector('#search-input');

  // 3. 스크롤 감지를 위한 헤더 본체 찾기
  const nav = document.querySelector('.header__nav');

  // [검색 인터랙션] 돋보기 클릭 시 확장
  if (searchBtn && searchWrapper) {
    searchBtn.addEventListener('click', () => {
      searchWrapper.classList.add('is-active');
      input.focus();
    });
  }

  // [검색 인터랙션] X 버튼 클릭 시 축소
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchWrapper.classList.remove('is-active');
      input.value = '';
    });
  }

  // [스크롤 인터랙션] 배경색 전환 요소 추가
  if (nav) {
    window.addEventListener('scroll', () => {
      // 스크롤이 20px 이상 내려가면 'is-scrolled' 클래스 추가
      if (window.scrollY > 20) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    });
  }
}
*/

import searchIcon from '../../assets/icons/search_icon.svg';
import clearIcon from '../../assets/icons/clear_icon.svg';
import userIcon from '../../assets/icons/user_icon.svg';
import logoImg from '../../assets/images/logo.svg';

export const header = function (props = { isLoggedIn: false }) {
  const searchPlaceholder = '제목, 사람, 장르';
  const serviceName = '스크립트 디렉터스';

  const headerTemplate = `
    <nav class="header__nav" aria-label="메인 네비게이션">
      <div class="header__left">
        <h1 class="header__logo">
          <a href="/index.html" aria-label="${serviceName} 홈으로 이동">
            <img src="${logoImg}" alt="${serviceName}" class="header__logo-img">
          </a>
        </h1>
        <ul class="header__menu">
          <li><a href="/index.html" class="header__menu-link active" aria-current="page">홈</a></li>
          <li><a href="/movie_list.html" class="header__menu-link">영화 목록</a></li>
        </ul>
      </div>

      <div class="header__right">
        <form class="header__search-form" id="search-form" role="search">
          <div class="header__search-wrapper" id="search-wrapper">
            <button type="button" class="header__search-toggle" id="search-toggle-btn" aria-label="검색창 열기">
              <img src="${searchIcon}" alt="" class="icon-search" aria-hidden="true">
            </button>

            <div class="header__search-input-group">
              <label for="search-input" class="sr-only">영화 검색</label>
              <input
                type="search"
                id="search-input"
                class="header__search-input"
                placeholder="${searchPlaceholder}"
                autocomplete="off"
              >
              <button type="button" class="header__search-clear" id="search-clear-btn" aria-label="검색어 지우기">
                <img src="${clearIcon}" alt="" class="icon-clear" aria-hidden="true">
              </button>
            </div>
          </div>
        </form>

        <div class="header__user-group">
          ${
            props.isLoggedIn
              ? `<a href="/mypage" class="header__mypage-link">
                  <img src="${userIcon}" alt="마이페이지" class="icon-user">
                </a>`
              : `<a href="/login" class="header__login-link">로그인</a>`
          }
        </div>
      </div>
    </nav>
  `;

  const parser = new DOMParser();
  return parser.parseFromString(headerTemplate, 'text/html').querySelector('nav');
};
