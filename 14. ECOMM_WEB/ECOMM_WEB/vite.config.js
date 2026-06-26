import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/WEB_DEV_2_Capstone_Ecomm_website/', // Add this line
})