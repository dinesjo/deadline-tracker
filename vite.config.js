import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react(), VitePWA({
      registerType: 'autoUpdate', 
      devOptions: {
        enabled: true
      },
      manifest: {
        icons: [
          {
            src: '/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    })
    ],
  }

  if (command !== 'serve') {
    config.base = '/deadline-tracker/'
  }

  return config
})