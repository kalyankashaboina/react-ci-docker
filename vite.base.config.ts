// vite.base.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@router': path.resolve(__dirname, 'src/router'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:color";
          @use "@styles/_variables.scss" as *;
          @use "@styles/_mixins.scss" as *;
        `,
      },
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
