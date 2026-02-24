export function upcomingBtn() {
  const movieContainer = document.querySelector('.upcoming-movie-container');
  const upcomingButtons = document.querySelectorAll('.upcoming-date-button button');
  const moviePoster = document.querySelectorAll('.movie-poster').item(0);
  const movieImgHeight = moviePoster.getBoundingClientRect().height;
  upcomingButtons.forEach((button, index) => {
    const isButton = button.closest('button');

    if (!isButton) return;
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', 'true');
      resetButton(upcomingButtons);
      const moveValue = -movieImgHeight * index;
      movieContainer.style.transform = `translateY(${moveValue}px)`;
    });
  });

  function resetButton(element) {
    element.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
  }
}
