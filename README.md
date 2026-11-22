# Vijetha L — Cinematic AI/ML Portfolio

A premium, fully responsive single-page portfolio built with **React + TypeScript + Vite + Tailwind CSS + Framer Motion + GSAP ScrollTrigger + Lenis**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the build
```

## Deploy to Vercel

`vercel.json` is pre-configured. Push to GitHub and import the repo on Vercel, or run `vercel`.

## Customization

- **Portrait** — add your photo at `public/images/portrait.jpg` (or `.webp` / `.png`). Until then, a side-view SVG placeholder at `public/images/portrait.svg` is used so the hero never looks empty.
- **Content** — edit the files in `src/data/` (`personal.ts`, `projects.ts`, `skills.ts`, `education.ts`).
- **Accent colour** — change `accent` in `tailwind.config.js` and `--accent` in `src/index.css`.
- **Contact form** — copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT` to your Formspree endpoint. Without it, the form opens the user's mail client.
- **Social links** — edit `linkedin` / `github` in `src/data/personal.ts`. LinkedIn: [vijetha-l-12b16a27a](https://www.linkedin.com/in/vijetha-l-12b16a27a/), GitHub: [vijetha7777](https://github.com/vijetha7777).
- **SEO** — update the canonical URL in `index.html`, `public/sitemap.xml` and `public/robots.txt` after deployment.

## Notes

- No fabricated achievements, metrics, repositories or demo links are included. All project details are derived from the supplied resume.
- Motion respects `prefers-reduced-motion`.
