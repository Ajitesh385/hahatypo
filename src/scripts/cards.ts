import { CARD } from '../config';

const seedOf = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const mulberry32 = (a: number) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

function init(card: HTMLElement) {
  const alt = card.querySelector<HTMLImageElement>('img[data-src]');
  if (alt) alt.src = alt.dataset.src!; // lazy-preload alternate so the flip never flashes empty
  const cv = card.querySelector<HTMLCanvasElement>('canvas.tex');
  if (!cv) return;
  const w = card.clientWidth, h = card.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = w * dpr; cv.height = h * dpr;
  const ctx = cv.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.font = `${CARD.TEXTURE_CELL_H - 2}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#808080';
  const rnd = mulberry32(seedOf(card.dataset.seed || 'x'));
  for (let y = 0; y < h; y += CARD.TEXTURE_CELL_H)
    for (let x = 0; x < w; x += CARD.TEXTURE_CELL_W)
      if (rnd() < CARD.TEXTURE_DENSITY) ctx.fillText(CARD.TEXTURE_CHARS[(rnd() * CARD.TEXTURE_CHARS.length) | 0], x + CARD.TEXTURE_CELL_W / 2, y + CARD.TEXTURE_CELL_H / 2);
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); init(e.target as HTMLElement); }
}, { rootMargin: '200px' });
const cards = document.querySelectorAll<HTMLElement>('.card');
cards.forEach((c) => io.observe(c));

// Touch: first tap highlights + flips, second tap opens.
if (matchMedia('(hover: none)').matches) {
  cards.forEach((card) =>
    card.addEventListener('click', (e) => {
      if (card.classList.contains('is-active')) return;
      e.preventDefault();
      document.querySelectorAll('.card.is-active').forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
    }),
  );
}
