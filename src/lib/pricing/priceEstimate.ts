import { bandCrossSection } from '../geometry/bandProfile';
import { polygonArea } from '../geometry/polygon';
import { METALS } from '../metals';
import type { RingConfig } from '../ringConfig';
import type { RingDimensions } from '../ringDimensions';
import { STONES } from '../stones';
import {
  BASE_LABOR_USD,
  CUBIC_MM_PER_CUBIC_CM,
  SETTING_LABOR_USD,
  SETTING_METAL_VOLUME_MM3,
  SETTING_REFERENCE_STONE_WIDTH_MM,
  STONE_SIZE_PREMIUM_EXPONENT,
} from './pricingConstants';

const CROSS_SECTION_SAMPLES = 256;

export interface PriceEstimate {
  bandVolumeMm3: number;
  settingVolumeMm3: number;
  /** Share of the width × thickness rectangle the band's cross-section fills. */
  bandFillRatio: number;
  metalWeightGrams: number;
  metalPricePerGramUsd: number;
  metalCostUsd: number;
  stoneBasePricePerCaratUsd: number;
  stoneSizeMultiplier: number;
  stoneCostUsd: number;
  laborCostUsd: number;
  totalUsd: number;
}

/**
 * Pappus's theorem: a cross-section swept around the finger encloses
 * area × distance travelled by its centroid. The section is symmetric,
 * so its centroid sits mid-way through the band's thickness.
 */
function computeBandVolumeMm3(config: RingConfig, dimensions: RingDimensions) {
  const crossSection = bandCrossSection(
    config.bandProfile,
    dimensions.bandWidthMm,
    dimensions.bandThicknessMm,
    CROSS_SECTION_SAMPLES,
  );
  const crossSectionAreaMm2 = polygonArea(crossSection);
  const centroidRadiusMm = dimensions.innerRadiusMm + dimensions.bandThicknessMm / 2;

  return {
    volumeMm3: crossSectionAreaMm2 * 2 * Math.PI * centroidRadiusMm,
    fillRatio: crossSectionAreaMm2 / (dimensions.bandWidthMm * dimensions.bandThicknessMm),
  };
}

function computeSettingVolumeMm3(config: RingConfig, dimensions: RingDimensions): number {
  const stoneFootprintRatio =
    (dimensions.stone.widthMm * dimensions.stone.lengthMm) / SETTING_REFERENCE_STONE_WIDTH_MM ** 2;
  return SETTING_METAL_VOLUME_MM3[config.setting] * stoneFootprintRatio;
}

export function estimatePrice(config: RingConfig, dimensions: RingDimensions): PriceEstimate {
  const metal = METALS[config.metal];
  const stone = STONES[config.stoneType];

  const band = computeBandVolumeMm3(config, dimensions);
  const settingVolumeMm3 = computeSettingVolumeMm3(config, dimensions);
  const metalVolumeCm3 = (band.volumeMm3 + settingVolumeMm3) / CUBIC_MM_PER_CUBIC_CM;
  const metalWeightGrams = metalVolumeCm3 * metal.densityGramsPerCm3;
  const metalCostUsd = metalWeightGrams * metal.samplePricePerGramUsd;

  const stoneSizeMultiplier = config.caratWeight ** STONE_SIZE_PREMIUM_EXPONENT;
  const stoneCostUsd = config.caratWeight * stone.samplePricePerCaratUsd * stoneSizeMultiplier;

  const laborCostUsd = BASE_LABOR_USD + SETTING_LABOR_USD[config.setting];

  return {
    bandVolumeMm3: band.volumeMm3,
    settingVolumeMm3,
    bandFillRatio: band.fillRatio,
    metalWeightGrams,
    metalPricePerGramUsd: metal.samplePricePerGramUsd,
    metalCostUsd,
    stoneBasePricePerCaratUsd: stone.samplePricePerCaratUsd,
    stoneSizeMultiplier,
    stoneCostUsd,
    laborCostUsd,
    totalUsd: metalCostUsd + stoneCostUsd + laborCostUsd,
  };
}
