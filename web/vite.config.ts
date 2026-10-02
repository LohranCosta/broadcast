/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const vendorGroups = [
  { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
  { name: 'firebase', test: /node_modules[\\/](@firebase|firebase)[\\/]/ },
  { name: 'pickers', test: /node_modules[\\/](@mui[\\/]x-date-pickers|dayjs)[\\/]/ },
  { name: 'mui', test: /node_modules[\\/](@mui|@emotion)[\\/]/ },
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: vendorGroups,
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 15_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.test.{ts,tsx}'],
    },
  },
})
