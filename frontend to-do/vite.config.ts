import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // 🔖 Injecté au build : permet de détecter une nouvelle version au chargement
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
