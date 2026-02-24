import { drawButton } from './button_component';
import { drawUpcoming } from './upcoming_component';
export function rederUpcoming(data, el1, el2, buttonEl) {
  let renderData = data;
  drawUpcoming(renderData, el1, el2);
  drawButton(renderData, buttonEl);
}
