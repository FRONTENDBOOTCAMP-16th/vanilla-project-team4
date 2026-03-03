import '/src/main.js';
import '/src/styles/movie_main.css';

import { today } from '/main/render_upcoming_movies';
import { trand } from '/main/render_trend_movies';
import { createLoadingOverlay } from '/src/scripts/utils/loading.js';

const loading = createLoadingOverlay('영화 목록을 불러오는 중...');

(async () => {
  loading.show();

  try {
    await Promise.all([trand(), today()]);
  } catch (e) {
    console.log(e);
  } finally {
    loading.hide();
  }
})();
