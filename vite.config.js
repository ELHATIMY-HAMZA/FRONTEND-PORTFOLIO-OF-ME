import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        /* Split long-lived vendor code from app code. React and motion change
           far less often than the portfolio content, so giving them their own
           hashed chunks means a copy edit no longer busts the whole cache. */
        manualChunks: {
          /* react-dom/client and react/jsx-runtime are separate entry points
             from 'react-dom' / 'react' — omitting them left the ~130 KB DOM
             renderer in the app chunk. */
          react: [
            'react',
            'react/jsx-runtime',
            'react-dom',
            'react-dom/client',
          ],
          motion: ['motion'],
          scroll: ['lenis'],
        },
      },
    },
  },
});
