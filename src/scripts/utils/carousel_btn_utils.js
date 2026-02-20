const buttonContainer = document.querySelector('.button-container');
const slideImageList = document.querySelector('.movie-item-list');
const slideImage = slideImageList.querySelectorAll('.movie-item');
const slideImageWidth = slideImage.item(0).getBoundingClientRect().width;
const slideImageGap = 24;
const setIndex = slideImage.length / 3;
let currentIndex = setIndex;
const startPoint = (slideImageWidth + slideImageGap) * currentIndex;

function isAnimate(bool) {
  if (bool) {
    return (slideImageList.style.transition = `all 0.3s ease-in`);
  }
  return (slideImageList.style.transition = `none`);
}

slideImageList.style.transform = `translateX(-${startPoint}px)`;
function moveToIndex() {
  const move = (slideImageWidth + slideImageGap) * -currentIndex;
  slideImageList.style.transform = `translateX(${move}px)`;
}

function btn(direction) {
  if (direction === 'next') {
    currentIndex += 1;

    if (currentIndex >= setIndex * 2) {
      setTimeout(() => {
        isAnimate(false);
        currentIndex = setIndex;
        moveToIndex();
      }, 350);
    }
  }
  if (direction === 'prev') {
    currentIndex -= 1;

    if (currentIndex < 1) {
      setTimeout(() => {
        isAnimate(false);
        currentIndex = setIndex;
        moveToIndex();
      }, 350);
    }
  }

  moveToIndex();
}

buttonContainer.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  isAnimate(true);

  if (!button) return;
  if (button.classList.contains('next-btn')) btn('next');
  if (button.classList.contains('prev-btn')) btn('prev');
});
