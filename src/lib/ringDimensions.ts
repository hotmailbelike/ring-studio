import { CUT_PROPORTIONS, STONE_SHAPE_SPECS, outlineFillRatio } from './geometry/stoneShapes';
import type { RingConfig } from './ringConfig';

// Standard US sizing: inner diameter grows 0.8128 mm per size from 11.63 mm at size 0.
const US_SIZE_ZERO_DIAMETER_MM = 11.63;
const US_SIZE_STEP_DIAMETER_MM = 0.8128;

// A 1 ct round brilliant measures about 6.5 mm across.
const ROUND_DIAMETER_AT_ONE_CARAT_MM = 6.5;
const CIRCLE_FILL_RATIO = Math.PI / 4;

const BAND_THICKNESS_MM = 1.7;

// Gap between the culet and the top of the band in a prong or bezel head.
const CULET_CLEARANCE_MM = 0.3;

export interface StoneDimensions {
  widthMm: number;
  lengthMm: number;
  crownHeightMm: number;
  girdleThicknessMm: number;
  pavilionDepthMm: number;
  /** Height of the girdle's center above the ring's center. */
  girdleCenterHeightMm: number;
}

export interface RingDimensions {
  innerRadiusMm: number;
  outerRadiusMm: number;
  bandThicknessMm: number;
  bandWidthMm: number;
  stone: StoneDimensions;
}

export function ringSizeToInnerDiameterMm(ringSizeUs: number): number {
  return US_SIZE_ZERO_DIAMETER_MM + US_SIZE_STEP_DIAMETER_MM * ringSizeUs;
}

/**
 * Stone volume scales with carat, so linear size scales with its cube root.
 * Elongated or squarer outlines are resized so their volume matches a round
 * stone of the same weight.
 */
function computeStoneDimensions(config: RingConfig, outerRadiusMm: number): StoneDimensions {
  const shapeSpec = STONE_SHAPE_SPECS[config.stoneShape];
  const proportions = CUT_PROPORTIONS[shapeSpec.cutStyle];

  const roundEquivalentDiameterMm = ROUND_DIAMETER_AT_ONE_CARAT_MM * Math.cbrt(config.caratWeight);
  const shapeVolumeCorrection = Math.cbrt(
    CIRCLE_FILL_RATIO / (shapeSpec.lengthToWidthRatio * outlineFillRatio(config.stoneShape)),
  );

  const widthMm = roundEquivalentDiameterMm * shapeVolumeCorrection;
  const pavilionDepthMm = widthMm * proportions.pavilionDepthToWidth;
  const girdleThicknessMm = widthMm * proportions.girdleThicknessToWidth;

  return {
    widthMm,
    lengthMm: widthMm * shapeSpec.lengthToWidthRatio,
    crownHeightMm: widthMm * proportions.crownHeightToWidth,
    girdleThicknessMm,
    pavilionDepthMm,
    girdleCenterHeightMm: outerRadiusMm + pavilionDepthMm + girdleThicknessMm / 2 + CULET_CLEARANCE_MM,
  };
}

export function computeRingDimensions(config: RingConfig): RingDimensions {
  const innerRadiusMm = ringSizeToInnerDiameterMm(config.ringSizeUs) / 2;
  const outerRadiusMm = innerRadiusMm + BAND_THICKNESS_MM;

  return {
    innerRadiusMm,
    outerRadiusMm,
    bandThicknessMm: BAND_THICKNESS_MM,
    bandWidthMm: config.bandWidthMm,
    stone: computeStoneDimensions(config, outerRadiusMm),
  };
}
