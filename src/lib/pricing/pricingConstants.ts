import type { SettingStyle } from '../ringOptions';

// Every number in this file is an illustrative sample, not live market data.

/** Per-carat price grows with size; a 0.5 exponent makes a 3 ct stone ~1.7× pricier per carat than a 1 ct. */
export const STONE_SIZE_PREMIUM_EXPONENT = 0.5;

/** Approximate metal in the head (prongs and gallery, or bezel cup) for a 6.5 mm stone. */
export const SETTING_METAL_VOLUME_MM3: Record<SettingStyle, number> = {
  fourProng: 22,
  sixProng: 30,
  bezel: 48,
};
export const SETTING_REFERENCE_STONE_WIDTH_MM = 6.5;

export const BASE_LABOR_USD = 260;
export const SETTING_LABOR_USD: Record<SettingStyle, number> = {
  fourProng: 90,
  sixProng: 140,
  bezel: 190,
};

export const CUBIC_MM_PER_CUBIC_CM = 1000;
