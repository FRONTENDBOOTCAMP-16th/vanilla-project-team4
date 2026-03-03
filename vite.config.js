import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        list: resolve(__dirname, 'list/index.html'),
        detail: resolve(__dirname, 'detail/index.html'),
      },
    },
  },

  plugins: [
    {
      name: 'mpa-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const path = req.url?.split('?')[0];

          if (path === '/detail' || path === '/detail/') req.url = '/detail/index.html';
          if (path === '/list' || path === '/list/') req.url = '/list/index.html';

          next();
        });
      },
    },
  ],
});
