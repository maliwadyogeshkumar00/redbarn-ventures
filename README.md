# Redbarn Ventures

Marketing website for **Redbarn Ventures** — a consulting, holding, and investment company.
Built with [Astro](https://astro.build) as a fast static site and deployed on **Cloudflare Pages**.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
```

## Deploy (Cloudflare Pages)

Connected to this GitHub repo via the Cloudflare dashboard:

- **Build command:** `npm run build`
- **Build output directory:** `dist`

Every push to `main` redeploys automatically.

## Editing

The homepage lives in `src/pages/index.astro` (self-contained: styles + all sections).
Brand colors are the CSS variables at the top of that file (`--barn-red`, `--ink`, etc.).
