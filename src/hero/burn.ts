import { HERO as C } from '../config';
import { drawCell, rnd, type Colors, type Grid } from './grid';

/** ASCII "paper burn" rippling out from (ox, oy). Only cells in the active band are touched each frame. */
export function startBurn(ctx: CanvasRenderingContext2D, g: Grid, col: Colors, ox: number, oy: number, done: () => void) {
  const { cols, rows } = g, n = cols * rows, W = C.CELL_W, H = C.CELL_H;
  const diag = Math.hypot(cols * W, rows * H);
  const ph = [Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28];
  const dist = new Float32Array(n);
  let maxD = 0;
  for (let i = 0; i < n; i++) {
    const dx = (i % cols + 0.5) * W - ox, dy = ((i / cols | 0) + 0.5) * H - oy;
    const a = Math.atan2(dy, dx);
    const nn = Math.sin(a * 3 + ph[0]) * 0.5 + Math.sin(a * 7 + ph[1]) * 0.3 + Math.sin(a * 13 + ph[2]) * 0.2; // tongues / stalls
    const hs = Math.sin(i * 12.9898) * 43758.5453, h = hs - Math.floor(hs);
    dist[i] = Math.max(0, Math.hypot(dx, dy) - (nn * C.ANGLE_NOISE + (h - 0.5) * C.CELL_NOISE) * diag);
    if (dist[i] > maxD) maxD = dist[i];
  }
  const order = Uint32Array.from({ length: n }, (_, i) => i).sort((a, b) => dist[a] - dist[b]);
  const E = C.EDGE_PX, B = E + C.BAND_PX, A = B + C.ASH_PX;
  const endR = maxD + A; // guarantees the farthest corner burns out
  let head = 0, tail = 0;
  const t0 = performance.now();

  const frame = (t: number) => {
    const p = Math.min(1, (t - t0) / C.BURN_MS);
    const R = endR * Math.pow(p, C.EMBER_EXP);
    while (head < n && dist[order[head]] <= R) head++;
    for (let j = tail; j < head; j++) {
      const i = order[j], s = R - dist[i];
      if (s < E) drawCell(ctx, g, i, rnd(C.GLITCH_CHARS), col.red, col.bg);                 // leading edge
      else if (s < B) drawCell(ctx, g, i, rnd(C.GLITCH_CHARS), col.red, col.bg, 0.6);       // burning band
      else if (s < A) {                                                                      // ash, thinning
        const q = (s - B) / C.ASH_PX;
        drawCell(ctx, g, i, C.ASH_RAMP[Math.min(2, (q * 3) | 0)], col.red, null, 0.5 * (1 - q));
      } else drawCell(ctx, g, i, '', col.red, null);                                         // gone
    }
    while (tail < head && R - dist[order[tail]] >= A) tail++;
    if (p < 1) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, cols * W, rows * H); done(); }
  };
  requestAnimationFrame(frame);
}
