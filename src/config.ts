/** Single source of truth for the brand name and every tunable constant. */
export const BRAND = 'BRANDNAME';

export const HERO = {
  CELL_W: 10,            // px, character cell width
  CELL_H: 16,            // px, character cell height
  LOGO_WIDTH: 0.7,       // logo width as a fraction of viewport width
  LOGO_RAMP: ' .:-=+*#%@', // coverage -> static logo character
  GLITCH_CHARS: '#%@&01/\\<>',
  HEAT_RADIUS: 6,        // cells; cursor influence on the logo
  HEAT_DECAY: 0.004,     // per ms (exponential). higher = cools faster
  TRAIL_RAMP: '@#*+:.',  // trail fades through this, then vanishes
  TRAIL_LIFE: 650,       // ms
  IDLE_MS: 3000,         // idle before flicker / touch ghost cursor
  FLICKER_EVERY: 260,    // ms between faint idle flickers
  SHOCK_RADIUS: 7,       // cells; click-on-empty-space shockwave
  // Burn transition
  BURN_MS: 1600,         // total duration (1400-1800 recommended)
  EMBER_EXP: 2.2,        // radius = p^EMBER_EXP. higher = slower ember, faster finish
  EDGE_PX: 10,           // leading edge band thickness
  BAND_PX: 46,           // burning band thickness
  ASH_PX: 70,            // ash thinning thickness
  ANGLE_NOISE: 0.12,     // per-angle front perturbation (fraction of screen diagonal)
  CELL_NOISE: 0.03,      // per-cell jitter (fraction of screen diagonal)
  ASH_RAMP: '@+.',
} as const;

export const CARD = {
  TEXTURE_CELL_W: 8,
  TEXTURE_CELL_H: 12,
  TEXTURE_CHARS: ".:+'`",
  TEXTURE_DENSITY: 0.22, // share of cells that get a character
  // Texture opacity (--tex-opacity) and glow strength (--glow-alpha) live in styles/tokens.css
} as const;
