import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:5000",
      "/pets": "http://localhost:5000",
      "/vets": "http://localhost:5000",
      "/appointments": "http://localhost:5000",
      "/admin": "http://localhost:5000",
      "/users": "http://localhost:5000",
    }
  }
})