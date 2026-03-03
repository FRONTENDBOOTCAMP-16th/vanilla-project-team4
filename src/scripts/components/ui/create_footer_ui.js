import { createElement } from '../../utils/create_element_utils';

export function createFooter() {
  const footer = createElement('footer', ['footer']);

  const footerTitle = createElement('h2', ['sr-only'], null, '서비스 정보 및 정책 영역');

  const supportTitle = createElement('h3', ['footer-group-title'], null, 'Support');
  const supportList = createElement('ul', ['footer-group-list']);

  const faqLi = createElement('li');
  const faqLink = createElement(
    'a',
    ['footer-group-link', 'disabled'],
    { href: '#' },
    '자주 묻는 질문',
  );

  const centerLi = createElement('li');
  const centerLink = createElement(
    'a',
    ['footer-group-link', 'disabled'],
    { href: '#' },
    '고객센터',
  );

  const snsTitle = createElement('h3', ['footer-group-title'], null, 'Follow Us');
  const snsList = createElement('ul', ['footer-group-sns-list']);

  const githubLi = createElement('li');
  const githubLink = createElement('a', ['footer-sns-link'], {
    href: 'https://github.com/FRONTENDBOOTCAMP-16th/vanilla-project-team4',
    'aria-label': '깃허브',
  });
  const githubImg = createElement('img', ['footer-sns-icon'], {
    src: '/src/assets/icon/github.svg',
    alt: '',
  });

  const notionLi = createElement('li');
  const notionLink = createElement('a', ['footer-sns-link'], {
    href: 'https://www.notion.so/4-30273873401a80759fecd397a76c42eb',
    'aria-label': '노션',
  });
  const notionImg = createElement('img', ['footer-sns-icon'], {
    src: '/src/assets/icon/notion.svg',
    alt: '',
  });

  const lionLi = createElement('li');
  const lionLink = createElement('a', ['footer-sns-link'], {
    href: 'https://bootcamp.likelion.net/',
    'aria-label': '멋쟁이사자처럼',
  });
  const lionImg = createElement('img', ['footer-sns-icon'], {
    src: '/src/assets/icon/likelion.svg',
    alt: '',
  });

  const tmdbText = createElement(
    'div',
    ['footer-info-text'],
    null,
    'This product uses the TMDB API but is not endorsed or certified by TMDB.',
  );
  const copyright = createElement(
    'p',
    ['footer-copyright'],
    null,
    `© ${new Date().getFullYear()} SCRIPT DIRECTORS. All rights reserved.`,
  );

  faqLi.append(faqLink);
  centerLi.append(centerLink);
  supportList.append(faqLi, centerLi);

  githubLink.append(githubImg);
  githubLi.append(githubLink);

  notionLink.append(notionImg);
  notionLi.append(notionLink);

  lionLink.append(lionImg);
  lionLi.append(lionLink);

  snsList.append(githubLi, notionLi, lionLi);

  footer.append(footerTitle, supportTitle, supportList, snsTitle, snsList, tmdbText, copyright);

  document.body.append(footer);
}
