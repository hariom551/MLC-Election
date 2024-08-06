// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  
    port: 5173,      
    ...(process.env.NODE_ENV === 'development' && {
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Your backend server
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '') // Uncomment if needed
        }
      }
    })
  }
});
