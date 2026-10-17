# hahatypo storefront

A static Astro storefront with a dependency-free Canvas 2D ASCII landing experience.
Product content is stored in a Shopify-shaped JSON file so its source can be
replaced later without changing the card interface.

## Requirements

- Node.js 22.22 or newer
- npm

## Setup

```sh
npm install
npm run dev
```

Open the local URL printed by Astro. `/` shows the interactive ASCII hero,
`/shop` opens the store directly, and `/about` introduces the brand's philosophy.
The shop includes a discreet About link below the product sections.

## Build and preview

```sh
npm run check
npm run build
npm run preview
```

The static site is emitted into `dist/`.

## Structure

- `src/config.ts` — the single brand-name constant.
- `src/hero/` — Canvas 2D hero, ASCII interaction, and burn-to-store transition.
- `src/components/` — shared header, category navigation, and product cards.
- `src/pages/about.astro` — the brand philosophy page.
- `src/data/products.json` — Shopify Storefront API-compatible product fields.
- `src/styles/tokens.css` — theme colors, typography, and layout tokens.
- `public/fonts/` — self-hosted Latin-subset IBM Plex Mono webfonts.
- `public/images/` — generated neutral-grey 4:5 SVG placeholders.
