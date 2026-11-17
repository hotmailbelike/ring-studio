import type { StoneType } from './ringOptions';

export interface StoneSpec {
  label: string;
  /** Surface tint used for the transmissive material and the UI swatch. */
  colorHex: string;
  /** Color light takes on as it travels through the stone. */
  attenuationColorHex: string;
  /** Average distance light travels before taking on the attenuation color. */
  attenuationDistanceMm: number;
  indexOfRefraction: number;
  /** three.js dispersion strength; realistic values fall between 0 and 1. */
  dispersion: number;
  /** Illustrative only, not live market data. */
  samplePricePerCaratUsd: number;
}

export const STONES: Record<StoneType, StoneSpec> = {
  diamond: {
    label: 'Diamond',
    colorHex: '#ffffff',
    attenuationColorHex: '#ffffff',
    attenuationDistanceMm: Number.POSITIVE_INFINITY,
    indexOfRefraction: 2.42,
    dispersion: 0.45,
    samplePricePerCaratUsd: 4800,
  },
  sapphire: {
    label: 'Sapphire',
    colorHex: '#4f6fe0',
    attenuationColorHex: '#1537b8',
    attenuationDistanceMm: 3,
    indexOfRefraction: 1.77,
    dispersion: 0.15,
    samplePricePerCaratUsd: 1400,
  },
  ruby: {
    label: 'Ruby',
    colorHex: '#e8475f',
    attenuationColorHex: '#b0102c',
    attenuationDistanceMm: 3,
    indexOfRefraction: 1.77,
    dispersion: 0.15,
    samplePricePerCaratUsd: 2200,
  },
  emerald: {
    label: 'Emerald',
    colorHex: '#3fbf7f',
    attenuationColorHex: '#0b7a45',
    attenuationDistanceMm: 3.5,
    indexOfRefraction: 1.58,
    dispersion: 0.1,
    samplePricePerCaratUsd: 1600,
  },
};
