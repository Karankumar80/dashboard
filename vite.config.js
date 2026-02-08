import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/aio': 'http://localhost:3000',
      '/ws/aio': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  }
};
