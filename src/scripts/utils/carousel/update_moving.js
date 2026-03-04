let isMoving = false;
let movingTimerId = null;

export function updateMovingState(delay = 350) {
  if (isMoving) return true;

  isMoving = true;

  if (movingTimerId) clearTimeout(movingTimerId);

  movingTimerId = setTimeout(() => {
    isMoving = false;
    movingTimerId = null;
  }, delay);

  return false;
}
