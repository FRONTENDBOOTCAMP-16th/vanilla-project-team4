/*
HTML : <header id="headerArea"></header> 바디 최상단에 사용해주세요.
*/

import searchIcon from '../../assets/icons/search_icon.svg';
import clearIcon from '../../assets/icons/clear_icon.svg';
import userIcon from '../../assets/icons/user_icon.svg';
import logoImg from '../../assets/images/logo.svg';

export const initHeader = (props = { isLoggedIn: false }) => {
  const headerArea = document.querySelector('#headerArea');
  if (!headerArea) return;

  // 1. 최상위 nav 생성
  const nav = document.createElement('nav');
  nav.className = 'header-nav';
  nav.setAttribute('aria-label', '메인 네비게이션');

  // --- 왼쪽 그룹 (로고, 메뉴) ---
  const leftGroup = document.createElement('div');
  leftGroup.className = 'header-left';

  const logoH1 = document.createElement('h1');
  logoH1.className = 'header-logo';
  const logoLink = document.createElement('a');
  logoLink.href = '/index.html';
  logoLink.setAttribute('aria-label', '스크립트 디렉터스 홈으로 이동');

  const logo = document.createElement('img');
  logo.src = logoImg;
  logo.alt = '스크립트 디렉터스';
  logo.className = 'header-logo-img';

  logoLink.appendChild(logo);
  logoH1.appendChild(logoLink);

  const menuUl = document.createElement('ul');
  menuUl.className = 'header-menu';

  const menuItems = [
    { name: '홈', href: '/index.html', active: true },
    { name: '영화 목록', href: '/movie_list.html', active: false },
  ];

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.className = `header-menu-link ${item.active ? 'active' : ''}`;
    if (item.active) a.setAttribute('aria-current', 'page');
    a.textContent = item.name;
    li.appendChild(a);
    menuUl.appendChild(li);
  });

  leftGroup.append(logoH1, menuUl);

  // --- 오른쪽 그룹 (검색, 유저, 로그인) ---
  const rightGroup = document.createElement('div');
  rightGroup.className = 'header-right';

  const searchForm = document.createElement('form');
  searchForm.className = 'header-search-form';
  searchForm.id = 'search-form';
  searchForm.setAttribute('role', 'search');

  const searchWrapper = document.createElement('div');
  searchWrapper.className = 'header-search-wrapper';
  searchWrapper.id = 'search-wrapper';

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'header-search-toggle';
  toggleBtn.id = 'search-toggle-btn';
  toggleBtn.setAttribute('aria-label', '검색창 열기');

  const sIcon = document.createElement('img');
  sIcon.src = searchIcon;
  sIcon.className = 'icon-search';
  sIcon.setAttribute('aria-hidden', 'true');
  toggleBtn.appendChild(sIcon);

  const inputGroup = document.createElement('div');
  inputGroup.className = 'header-search-input-group';

  const label = document.createElement('label');
  label.htmlFor = 'search-input';
  label.className = 'sr-only';
  label.textContent = '영화 검색';

  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'search-input';
  input.className = 'header-search-input';
  input.placeholder = '제목, 사람, 장르';
  input.autocomplete = 'off';

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'header-search-clear';
  clearBtn.id = 'search-clear-btn';
  clearBtn.setAttribute('aria-label', '검색어 지우기');

  const cIcon = document.createElement('img');
  cIcon.src = clearIcon;
  cIcon.className = 'icon-clear';
  cIcon.setAttribute('aria-hidden', 'true');
  clearBtn.appendChild(cIcon);

  inputGroup.append(label, input, clearBtn);
  searchWrapper.append(toggleBtn, inputGroup);
  searchForm.appendChild(searchWrapper);

  const userGroup = document.createElement('div');
  userGroup.className = 'header-user-group';

  if (props.isLoggedIn) {
    const myPageLink = document.createElement('a');
    myPageLink.href = '/mypage';
    myPageLink.className = 'header-mypage-link';
    const uIcon = document.createElement('img');
    uIcon.src = userIcon;
    uIcon.className = 'icon-user';
    myPageLink.appendChild(uIcon);
    userGroup.appendChild(myPageLink);
  } else {
    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.className = 'header-login-link';
    loginLink.textContent = '로그인';
    userGroup.appendChild(loginLink);
  }

  rightGroup.append(searchForm, userGroup);
  nav.append(leftGroup, rightGroup);

  // 2. 최종 DOM 삽입
  headerArea.innerHTML = '';
  headerArea.appendChild(nav);

  // 3. 내부 이벤트 바인딩 (인터랙션)
  toggleBtn.addEventListener('click', () => {
    searchWrapper.classList.add('is-active');
    input.focus();
  });

  clearBtn.addEventListener('click', () => {
    searchWrapper.classList.remove('is-active');
    input.value = '';
  });

  // 4. 스크롤 이벤트 (위에서 아래로 색이 차오르는 필 효과 대응)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  });
};
