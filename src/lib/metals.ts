import type { MetalId } from './ringOptions';

export interface MetalSpec {
  label: string;
  /** sRGB base color approximating the metal's measured reflectance. */
  colorHex: string;
  roughness: number;
  densityGramsPerCm3: number;
  /** Illustrative only, not live market data. */
  samplePricePerGramUsd: number;
}

export const METALS: Record<MetalId, MetalSpec> = {
  yellowGold18k: {
    label: '18k yellow gold',
    colorHex: '#f3cf86',
    roughness: 0.16,
    densityGramsPerCm3: 15.6,
    samplePricePerGramUsd: 74,
  },
  roseGold18k: {
    label: '18k rose gold',
    colorHex: '#efb8a0',
    roughness: 0.18,
    densityGramsPerCm3: 15.6,
    samplePricePerGramUsd: 74,
  },
  whiteGold18k: {
    label: '18k white gold',
    colorHex: '#e2e1dc',
    roughness: 0.12,
    densityGramsPerCm3: 15.6,
    samplePricePerGramUsd: 76,
  },
  platinum: {
    label: 'Platinum',
    colorHex: '#d6d2cb',
    roughness: 0.2,
    densityGramsPerCm3: 21.4,
    samplePricePerGramUsd: 36,
  },
  sterlingSilver: {
    label: 'Sterling silver',
    colorHex: '#f4f2ee',
    roughness: 0.15,
    densityGramsPerCm3: 10.4,
    samplePricePerGramUsd: 1.2,
  },
};
