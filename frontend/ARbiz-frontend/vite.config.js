import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['281c-2400-adc1-154-aa00-b0ff-fbd5-2f4b-7fb0.ngrok-free.app', 'all'],

    // Move proxy INSIDE server configuration
    proxy: {
      '/api': {
        target: 'http://localhost:3020',
        changeOrigin: true,
        secure: false,
        // Add some debugging
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    },

    hmr: {
      protocol: 'wss',
      host: '281c-2400-adc1-154-aa00-b0ff-fbd5-2f4b-7fb0.ngrok-free.app',
      clientPort: 443,
      // Add timeout and retry options
      timeout: 60000,
      overlay: false  // Disable error overlay if WebSocket fails
    }
  }
});