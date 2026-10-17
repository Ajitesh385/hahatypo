export const HERO_CONFIG = {
  // CSS-pixel dimensions of each character cell.
  cellWidth: 10,
  cellHeight: 16,
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
} as const;
