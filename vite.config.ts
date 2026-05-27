import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nfq Staffing - Santander CIB',
        short_name: 'NfqStaff',
        description: 'Control de staffing y upskilling para Santander CIB',
        theme_color: '#0f172a', // Color de la barra superior en móviles
        background_color: '#faf8f5', // Color de fondo al arrancar la app
        display: 'standalone', // Abre la app a pantalla completa sin barras de navegador
        orientation: 'portrait', // Bloquea la app en modo vertical
        icons: [
          {
            src: 'https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://lh3.googleusercontent.com/d/1ZRUArlFz7uZOmsEB8cVRBjTHcEZQejNQ',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
