export const HERO_CONFIG = {
  // CSS-pixel dimensions of each character cell.
  cellWidth: 10,
  cellHeight: 16,
  // Maximum logo raster font size; width ratio keeps the wordmark legible on phones.
  logoMaxFontSize: 144,
  logoWidthRatio: 0.9,
  // Thickens sampled strokes and character glyphs so the ASCII wordmark reads clearly.
  logoStrokeWidth: 2.5,
  cellFontSize: 16,
  // Exponential heat decay in milliseconds.
  heatDecayMs: 310,
  // Total burn duration, including the initial ember.
  burnDurationMs: 1640,
  // Spatial frequency used to perturb the burn radius.
  noiseScale: 0.035,
  // Kept in sync with the card hover border treatment.
  glowStrength: '35%',
  heatRadius: 62,
  burnBandWidth: 38,
  ashDurationMs: 540,
  // Empty-space tap ripple: small radius, ASCII-only, with a short outward delay.
  rippleRadius: 46,
  rippleSpeed: 0.28,
  rippleFadeMs: 170,
} as const;
