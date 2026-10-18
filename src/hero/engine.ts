import { BRAND, HERO as C } from '../config';
import { drawCell, readColors, rnd, type Grid } from './grid';
import { startBurn } from './burn';

export function initHero(canvas: HTMLCanvasElement, onDone: () => void) {
  const ctx = canvas.getContext('2d')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const col = readColors();
  let g: Grid, logo: number[] = [], active = new Set<number>();
  let last = performance.now(), lastInput = last, lastFlick = 0, raf = 0, burning = false, logoHover = false;
  let prev: [number, number] | null = null, resizeT = 0;

  const paintAll = () => {
    ctx.fillStyle = col.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const c = logoHover ? col.red : col.dim;
    for (const i of logo) drawCell(ctx, g, i, g.staticCh[i], c, col.bg);
  };

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2), w = innerWidth, h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${C.CELL_H - 2}px "JetBrains Mono", monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const cols = Math.ceil(w / C.CELL_W), rows = Math.ceil(h / C.CELL_H), n = cols * rows;
    // Rasterize the brand name 1 pixel = 1 cell; downscaling gives per-cell coverage.
    const off = document.createElement('canvas'); off.width = cols; off.height = rows;
    const o = off.getContext('2d', { willReadFrequently: true })!;
    const r = C.CELL_W / C.CELL_H; o.setTransform(1, 0, 0, r, 0, 0);
    const s = Math.min((C.LOGO_WIDTH * cols) / (0.6 * BRAND.length), (0.35 * rows) / r);
    o.font = `700 ${s}px "JetBrains Mono", monospace`; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillStyle = '#fff';
    o.fillText(BRAND, cols / 2, rows / 2 / r);
    const px = o.getImageData(0, 0, cols, rows).data;
    g = { cols, rows, mask: new Float32Array(n), heat: new Float32Array(n), trail: new Float32Array(n), staticCh: new Array(n).fill('') };
    logo = [];
    const L = C.LOGO_RAMP.length;
    for (let i = 0; i < n; i++) {
      const cov = px[i * 4 + 3] / 255;
      if (cov > 0.12) { g.mask[i] = cov; g.staticCh[i] = C.LOGO_RAMP[Math.min(L - 1, (cov * L) | 0)]; logo.push(i); }
    }
    active.clear(); prev = null; paintAll();
  }

  function move(x: number, y: number, synthetic = false) {
    if (burning) return;
    if (!synthetic) lastInput = performance.now();
    const cx = (x / C.CELL_W) | 0, cy = (y / C.CELL_H) | 0, { cols, rows } = g;
    if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;
    const onLogo = g.mask[cy * cols + cx] > 0;
    if (!synthetic) canvas.style.cursor = onLogo ? 'pointer' : 'default';
    if (reduce) { if (onLogo !== logoHover) { logoHover = onLogo; paintAll(); } return; }
    const [px, py] = prev ?? [cx, cy];
    const steps = Math.max(Math.abs(cx - px), Math.abs(cy - py), 1);
    for (let k = 1; k <= steps; k++) {
      const i = Math.round(py + ((cy - py) * k) / steps) * cols + Math.round(px + ((cx - px) * k) / steps);
      if (g.mask[i] === 0) { g.trail[i] = 1; active.add(i); }
    }
    prev = [cx, cy];
    const R = C.HEAT_RADIUS;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const X = cx + dx, Y = cy + dy; if (X < 0 || Y < 0 || X >= cols || Y >= rows) continue;
      const d = Math.hypot(dx * C.CELL_W, dy * C.CELL_H) / C.CELL_W, i = Y * cols + X;
      if (d <= R && g.mask[i] > 0) { g.heat[i] = Math.max(g.heat[i], 1 - d / R); active.add(i); }
    }
  }

  function frame(t: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(t - last, 50); last = t;
    if (burning || reduce) return;
    if (t - lastInput > C.IDLE_MS) {
      if (coarse) move(innerWidth / 2 + Math.sin(t / 1700) * innerWidth * 0.3, innerHeight / 2 + Math.cos(t / 2300) * innerHeight * 0.12, true);
      else if (t - lastFlick > C.FLICKER_EVERY && logo.length) { lastFlick = t; const i = logo[(Math.random() * logo.length) | 0]; g.heat[i] = 0.3; active.add(i); }
    }
    const k = Math.exp(-dt * C.HEAT_DECAY), td = dt / C.TRAIL_LIFE, rl = C.TRAIL_RAMP.length;
    for (const i of active) {
      let h = g.heat[i], a = g.trail[i];
      if (h > 0) { h *= k; if (h < 0.03) h = 0; g.heat[i] = h; }
      if (a > 0) { a -= td; if (a < 0) a = 0; g.trail[i] = a; }
      if (h > 0) drawCell(ctx, g, i, rnd(C.GLITCH_CHARS), col.red, col.bg);
      else if (a > 0) drawCell(ctx, g, i, C.TRAIL_RAMP[Math.min(rl - 1, ((1 - a) * rl) | 0)], col.fg, col.bg);
      else { drawCell(ctx, g, i, g.staticCh[i], col.dim, col.bg); active.delete(i); }
    }
  }

  const finish = () => {
    cancelAnimationFrame(raf); burning = true;
    removeEventListener('resize', onResize); canvas.remove(); onDone();
  };

  function onDown(e: PointerEvent) {
    if (burning) return;
    const x = e.clientX, y = e.clientY, i = ((y / C.CELL_H) | 0) * g.cols + ((x / C.CELL_W) | 0);
    if (g.mask[i] > 0) {
      burning = true; history.pushState({}, '', '/shop');
      if (reduce) { canvas.style.transition = 'opacity 400ms linear'; canvas.style.opacity = '0'; setTimeout(finish, 420); }
      else startBurn(ctx, g, col, x, y, finish);
    } else if (!reduce) { // shockwave on empty space
      const cx = (x / C.CELL_W) | 0, cy = (y / C.CELL_H) | 0, R = C.SHOCK_RADIUS;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const X = cx + dx, Y = cy + dy; if (X < 0 || Y < 0 || X >= g.cols || Y >= g.rows) continue;
        if (Math.hypot(dx * C.CELL_W, dy * C.CELL_H) / C.CELL_W > R) continue;
        const j = Y * g.cols + X;
        if (g.mask[j] > 0) g.heat[j] = 0.9; else g.trail[j] = 0.2 + Math.random() * 0.5;
        active.add(j);
      }
    }
  }

  const onResize = () => { clearTimeout(resizeT); resizeT = window.setTimeout(() => !burning && build(), 150); };
  build();
  addEventListener('resize', onResize);
  canvas.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
  canvas.addEventListener('pointerdown', (e) => { move(e.clientX, e.clientY); onDown(e); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!burning) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
  raf = requestAnimationFrame(frame);
}
