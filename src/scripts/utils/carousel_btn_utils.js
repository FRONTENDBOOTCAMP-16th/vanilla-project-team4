export function buttonUtil() {
  const carouselWrap = document.querySelector('.carousel-controls');
  if (!carouselWrap) return;

  const prevBtn = carouselWrap.querySelector('.prev');
  const nextBtn = carouselWrap.querySelector('.next');

  const movieItemList = document.querySelector('.movie-item-list');
  if (!prevBtn || !nextBtn) return;

  const firstItem = movieItemList.querySelector('.movie-item');
  if (!firstItem) return;

  const itemWidth = firstItem.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(movieItemList).gap) || 0;
  const distance = itemWidth + gap;

  let currentIndex = 0;
  const maxIndex = movieItemList.querySelectorAll('.movie-item').length - 1;

  movieItemList.style.transition = 'transform 0.3s ease';

  function moveToIndex() {
    movieItemList.style.transform = `translateX(${-currentIndex * distance}px)`;
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex >= maxIndex) return;
    currentIndex += 1;
    moveToIndex();
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex <= 0) return;
    currentIndex -= 1;
    moveToIndex();
  });
}
