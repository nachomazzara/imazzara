# Imazzara personal website

https://imazzara.com

## Build

```bash
npm run build:prerender
```

Generates static HTML files with meta tags for SEO and social sharing.

## Development

```bash
npm run dev
```

## Vercel Deployment

- Build Command: `npm run build:prerender`
- Output Directory: `build`

The prerender script generates static HTML files for:
- `/` (homepage)
- `/blog/:slug` (all blog posts)

Each page includes Open Graph and Twitter Card meta tags for social sharing.
