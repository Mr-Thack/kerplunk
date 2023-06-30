import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [
    sveltekit({ hot: !process.env.VITEST }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
        provider: 'istanbul' // or 'v8'
      },
      browser: {
        enabled: true,
        name: 'chrome', // browser name is required
      },
  },
  server: {
    host: true
  }
})