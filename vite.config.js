import { defineConfig } from 'vite'
import { resolve } from 'node:path'

const page = (f) => resolve(import.meta.dirname, f)

export default defineConfig({
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        main: page('index.html'),
        privacy: page('privacy.html'),
        terms: page('terms.html'),
        cookies: page('cookies.html'),
        notfound: page('404.html'),
      },
    },
  },
})
