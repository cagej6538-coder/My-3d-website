import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative URLs make the production build work at username.github.io/<repo>/
  // as well as at a custom/root domain without hard-coding the repository name.
  base: './',
  plugins: [react()],
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
})
