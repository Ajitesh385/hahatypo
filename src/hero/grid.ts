import { HERO as C } from '../config';

export interface Colors { bg: string; fg: string; dim: string; red: string }
export interface Grid { cols: number; rows: number; mask: Float32Array; heat: Float32Array; trail: Float32Array; staticCh: string[] }

export const readColors = (): Colors => {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return { bg: v('--bg'), fg: v('--fg'), dim: v('--dim'), red: v('--red') };
};

export const rnd = (s: string) => s[(Math.random() * s.length) | 0];

/** Draw one cell. bg === null punches a transparent hole; alpha applies to the glyph only. */
export function drawCell(ctx: CanvasRenderingContext2D, g: Grid, i: number, ch: string, color: string, bg: string | null, alpha = 1) {
  const x = (i % g.cols) * C.CELL_W, y = ((i / g.cols) | 0) * C.CELL_H;
  if (bg === null) ctx.clearRect(x, y, C.CELL_W, C.CELL_H);
  else { ctx.fillStyle = bg; ctx.fillRect(x, y, C.CELL_W, C.CELL_H); }
  if (ch && ch !== ' ') {
    ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.fillText(ch, x + C.CELL_W / 2, y + C.CELL_H / 2 + 1);
    ctx.globalAlpha = 1;
  }
}
