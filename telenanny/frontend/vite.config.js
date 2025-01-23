import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginRadar } from 'vite-plugin-radar'

export default defineConfig({
  plugins: [
    react(),
    VitePluginRadar({
      // Enable in development
      enableDev: true,

      // Google Analytics configuration
      analytics: {
        id: 'GTM-WB8F26QG', // Replace with your actual tracking ID
        config: {
          send_page_view: true,
        }
      }
    })
  ],
})