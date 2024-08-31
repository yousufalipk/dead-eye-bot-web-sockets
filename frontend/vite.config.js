import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,      // Enable polling to reduce the number of file watchers
      interval: 1000,        // Adjust the polling interval if needed
      ignored: ['**/node_modules/**'], // Exclude node_modules from being watched
    },
  },
})
