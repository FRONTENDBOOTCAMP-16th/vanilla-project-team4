// ui 조건
// 영화 이미지, 영화 제목, 개봉일자 데이터를 받아올 것
// createElement를 사용해 케러셀 영역 그리기
// 이벤트 위임 방지코드 작성

const dummyMovies = [
  {
    movieTitle: '인터스텔라 리마스터',
    movieImage: 'https://picsum.photos/256/384?random=1',
    movieStart: '2026-01-15',
  },
  {
    movieTitle: '서울의 밤',
    movieImage: 'https://picsum.photos/256/384?random=2',
    movieStart: '2026-02-03',
  },
  {
    movieTitle: '프로젝트 오로라',
    movieImage: 'https://picsum.photos/256/384?random=3',
    movieStart: '2026-03-21',
  },
  {
    movieTitle: '타임 패러독스',
    movieImage: 'https://picsum.photos/256/384?random=4',
    movieStart: '2026-04-10',
  },
  {
    movieTitle: '라스트 코드',
    movieImage: 'https://picsum.photos/256/384?random=5',
    movieStart: '2026-05-18',
  },
  {
    movieTitle: '심연의 도시',
    movieImage: 'https://picsum.photos/256/384?random=6',
    movieStart: '2026-06-07',
  },
  {
    movieTitle: '리버스 월드',
    movieImage: 'https://picsum.photos/256/384?random=7',
    movieStart: '2026-07-12',
  },
  {
    movieTitle: '디지털 유토피아',
    movieImage: 'https://picsum.photos/256/384?random=8',
    movieStart: '2026-08-29',
  },
  {
    movieTitle: '제로 포인트',
    movieImage: 'https://picsum.photos/256/384?random=9',
    movieStart: '2026-09-14',
  },
  {
    movieTitle: '미래의 기억',
    movieImage: 'https://picsum.photos/256/384?random=10',
    movieStart: '2026-10-02',
  },
];

const recomandCarousel = document.querySelector('.card-carousel');
const recomandList = recomandCarousel.querySelector('.movie-item-list');

const frag = document.createDocumentFragment();

dummyMovies.forEach(({ movieTitle, movieImage, movieStart }) => {
  const li = createElement('li', ['movie-item']);
  const a = createElement('a', ['movie-item-link'], { href: '#' });
  const img = createElement('img', ['movie-item-image'], {
    src: movieImage,
    alt: movieTitle,
  });

  const dl = createElement('dl');
  const dtTitle = createElement('dt', ['sr-only'], null, '영화 제목');
  const ddTitle = createElement('dd', ['movie-title'], null, movieTitle);
  const dtDate = createElement('dt', ['sr-only'], null, '영화 출시일');
  const ddDate = createElement('dd', ['movie-open-date']);
  const time = createElement('time', [], { datetime: movieStart }, movieStart);

  ddDate.appendChild(time);

  dl.append(dtTitle, ddTitle, dtDate, ddDate);
  a.append(img, dl);
  li.appendChild(a);

  frag.appendChild(li);
});

recomandList.replaceChildren(frag);

function createElement(tag, classNames = [], attrs = null, text = '') {
  const element = document.createElement(tag);

  if (Array.isArray(classNames) && classNames.length) {
    element.classList.add(...classNames);
  }

  if (typeof attrs === 'object' && attrs) {
    for (const key in attrs) {
      element.setAttribute(key, attrs[key]);
    }
  }

  element.textContent = text;

  return element;
}
