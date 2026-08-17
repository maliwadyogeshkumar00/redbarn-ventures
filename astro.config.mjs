// @ts-check
import { defineConfig } from 'astro/config';

// Static output — deploys to Cloudflare Pages with zero extra config.
// Build command: `npm run build`  |  Output directory: `dist`
export default defineConfig({
  site: 'https://redbarnventures.com',
  output: 'static',
  compressHTML: true,
});
