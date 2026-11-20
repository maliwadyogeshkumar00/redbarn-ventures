import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://redbarn.ventures',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  devToolbar: { enabled: false },
})
