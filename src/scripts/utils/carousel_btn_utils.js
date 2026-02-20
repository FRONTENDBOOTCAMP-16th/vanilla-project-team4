const buttonContainer = document.querySelector('.button-container');
const slideImageList = document.querySelector('.movie-item-list');
const slideImage = slideImageList.querySelectorAll('.movie-item');
const slideImageWidth = slideImage.item(0).getBoundingClientRect().width;
const slideImageGap = 16;
const startPoint = slideImage;
let currentIndex = 0;
console.log(startPoint.length / 3);
function moveToIndex() {
  const move = (slideImageWidth + slideImageGap) * -currentIndex;
  slideImageList.style.transform = `translateX(${move}px)`;
}

function btn(direction) {
  if (direction === 'next') currentIndex += 1;
  if (direction === 'prev') currentIndex -= 1;

  moveToIndex();
}

buttonContainer.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  if (button.classList.contains('next-btn')) btn('next');
  if (button.classList.contains('prev-btn')) btn('prev');
});
