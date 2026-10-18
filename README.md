# BRANDNAME

Astro (static) + TypeScript, vanilla Canvas 2D hero, plain CSS.

    npm install
    npm run placeholders   # (re)generate grey placeholder SVGs in public/img
    npm run dev            # http://localhost:4321
    npm run build          # static output in dist/
    npm run preview

- Brand name and all tunables: `src/config.ts` (CSS-side tunables: `src/styles/tokens.css`)
- Hero engine + burn: `src/hero/` · Components: `src/components/` · Data: `src/data/products.json`
- Product photos in `public/img/` are illustrative Unsplash stock images, bundled locally under the Unsplash License. They are not photos of actual inventory; replace them with owned product photography before presenting them as exact items for sale.
- Product detail pages are generated at `/products/<handle>` from `src/data/products.json`. Hovering text shows a small animated ASCII cursor; it is disabled for touch and reduced-motion preferences.
- Swap `products.json` for Shopify Storefront API nodes later; the shape (handle, title, price, images[]) already matches.
- Serve with `/shop` resolving to `shop/index.html` (default on most static hosts).
