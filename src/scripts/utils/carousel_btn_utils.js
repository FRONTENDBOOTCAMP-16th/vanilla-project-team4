export function buttonUtil() {
  const carouselWrap = document.querySelector('.carousel-controls');
  const prevBtn = carouselWrap.querySelector('.prev-btn');
  const nextBtn = carouselWrap.querySelector('.next-btn');
  const movieItem = document.querySelector('.movie-item');
  const movieItemWidht = movieItem.getBoundingClientRect().width;
  const style = getComputedStyle(movieItem);
  const gap = style.getPropertyValue('gap');
  console.log(movieItemWidht);
  console.log(gap);
}
