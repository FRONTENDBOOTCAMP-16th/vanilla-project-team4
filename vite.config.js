import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        movies: resolve(__dirname, 'movie_list.html'),
        detail: resolve(__dirname, 'movie_detail.html'),
      },
    },
  },
});
