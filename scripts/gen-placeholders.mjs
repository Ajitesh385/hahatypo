// Generates neutral grey 4:5 placeholder SVGs (primary + alt per product) and category tiles.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
mkdirSync('public/img', { recursive: true });
const svg = (w, h, fill, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${fill}"/><text x="50%" y="50%" fill="#b0b0b0" font-family="monospace" font-size="${w / 28}" text-anchor="middle">${label}</text></svg>`;
for (const p of JSON.parse(readFileSync('src/data/products.json', 'utf8'))) {
  writeFileSync(`public/img/${p.handle}-1.svg`, svg(800, 1000, '#6a6a6a', p.title));
  writeFileSync(`public/img/${p.handle}-2.svg`, svg(800, 1000, '#575757', p.title + ' / alt'));
}
for (const c of ['clothing', 'accessories', 'vault']) writeFileSync(`public/img/cat-${c}.svg`, svg(800, 600, '#5e5e5e', c));
