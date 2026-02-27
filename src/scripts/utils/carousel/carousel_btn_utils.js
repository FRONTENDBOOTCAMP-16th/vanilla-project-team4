import { setTransition } from './set_transiton';
import { updateFocusRing } from '../carousel/updateFocus';
import { updateMovingState } from './update_moving';

export function buttonUtil() {
  const carouselWrap = document.querySelector('.carousel-controls');
  if (!carouselWrap) return;

  const prevBtn = carouselWrap.querySelector('.prev');
  const nextBtn = carouselWrap.querySelector('.next');

  const movieItemList = document.querySelector('.movie-item-list');
  if (!prevBtn || !nextBtn || !movieItemList) return;

  const firstItem = movieItemList.querySelector('.movie-item');
  if (!firstItem) return;

  const itemWidth = firstItem.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(movieItemList).gap) || 0;
  const distance = itemWidth + gap;

  const items = movieItemList.querySelectorAll('.movie-item');
  const maxIndex = items.length - 1;
  const baseIndex = Math.floor(items.length / 3);

  let currentIndex = baseIndex;
  const rightResetPoint = baseIndex * 2;
  const leftResetPoint = baseIndex - 1;

  function moveToIndex() {
    movieItemList.style.transform = `translateX(${-currentIndex * distance}px)`;
  }

  setTransition(false, movieItemList);
  moveToIndex();
  updateFocusRing(currentIndex, items, baseIndex);

  setTimeout(() => {
    setTransition(true, movieItemList);
  }, 100);

  // 다음 버튼
  nextBtn.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    if (updateMovingState()) return;
    if (currentIndex >= maxIndex) return;

    currentIndex += 1;
    moveToIndex();
    updateFocusRing(currentIndex, items, baseIndex);

    if (currentIndex >= rightResetPoint) {
      setTimeout(() => {
        setTransition(false, movieItemList);
        currentIndex = baseIndex;
        moveToIndex();
        updateFocusRing(currentIndex, items, baseIndex);

        // ✅ prev와 동일하게 reflow로 transition OFF 적용 보장
        movieItemList.offsetHeight;

        setTransition(true, movieItemList);
      }, 450);
    }
  });

  // 이전 버튼
  prevBtn.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    if (updateMovingState()) return;
    currentIndex -= 1;
    moveToIndex();
    updateFocusRing(currentIndex, items, baseIndex);

    if (currentIndex <= leftResetPoint) {
      setTimeout(() => {
        setTransition(false, movieItemList);
        currentIndex = rightResetPoint - 1;
        moveToIndex();
        updateFocusRing(currentIndex, items, baseIndex);

        movieItemList.offsetHeight;
        setTransition(true, movieItemList);
      }, 450);
    }
  });
}
