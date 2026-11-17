import type { Vector3 } from 'three';
import type { RingDimensions } from '../ringDimensions';
import type { StoneShape } from '../ringOptions';
import { computeHeadBase } from './headLayout';
import { outlinePoint, outlineRing, type OutlineExtent } from './outlineRing';
import { STONE_SHAPE_SPECS } from './stoneShapes';

export const PRONG_COUNTS = { fourProng: 4, sixProng: 6 } as const;
export type ProngCount = (typeof PRONG_COUNTS)[keyof typeof PRONG_COUNTS];

const PRONG_RADIUS_TO_STONE_WIDTH = 0.065;
const MIN_PRONG_RADIUS_MM = 0.32;
const MAX_PRONG_RADIUS_MM = 0.6;
const SIX_PRONG_THINNING = 0.85;
// Claw tips rise this share of the crown height above the girdle to hold the stone.
const CLAW_TIP_CROWN_SHARE = 0.35;
const CLAW_TIP_RADIUS_SCALE = 1.15;
// The gallery rail sits this far down the pavilion, tying the prongs together.
const GALLERY_RAIL_PAVILION_SHARE = 0.55;
const GALLERY_RAIL_RADIUS_SCALE = 0.7;
const GALLERY_RAIL_SAMPLES = 64;

export interface Prong {
  base: Vector3;
  tip: Vector3;
}

export interface ProngLayout {
  prongs: Prong[];
  prongRadiusMm: number;
  clawTipRadiusMm: number;
  railPoints: Vector3[];
  railRadiusMm: number;
}

function lerpExtent(from: OutlineExtent, to: OutlineExtent, amount: number): OutlineExtent {
  return {
    halfWidth: from.halfWidth + (to.halfWidth - from.halfWidth) * amount,
    halfLength: from.halfLength + (to.halfLength - from.halfLength) * amount,
  };
}

/** Places straight prongs from the band up to just over the girdle, plus a gallery rail joining them. */
export function computeProngLayout(
  shape: StoneShape,
  prongCount: ProngCount,
  dimensions: RingDimensions,
): ProngLayout {
  const { stone } = dimensions;
  const shapeSpec = STONE_SHAPE_SPECS[shape];
  const thinning = prongCount === PRONG_COUNTS.sixProng ? SIX_PRONG_THINNING : 1;
  const prongRadiusMm =
    Math.min(Math.max(stone.widthMm * PRONG_RADIUS_TO_STONE_WIDTH, MIN_PRONG_RADIUS_MM), MAX_PRONG_RADIUS_MM) *
    thinning;

  const base = computeHeadBase(dimensions);
  // Tips sit half a prong outside the girdle so the claw wraps over the stone's edge.
  const tipExtent: OutlineExtent = {
    halfWidth: stone.widthMm / 2 + prongRadiusMm / 2,
    halfLength: stone.lengthMm / 2 + prongRadiusMm / 2,
  };
  const tipHeight = stone.girdleCenterHeightMm + stone.crownHeightMm * CLAW_TIP_CROWN_SHARE;

  const prongs = Array.from({ length: prongCount }, (_, index) => {
    const t = shapeSpec.prongPhase + index / prongCount;
    return {
      base: outlinePoint(shapeSpec.outlineAt, t, base.extent, base.height),
      tip: outlinePoint(shapeSpec.outlineAt, t, tipExtent, tipHeight),
    };
  });

  const railHeight =
    stone.girdleCenterHeightMm - stone.girdleThicknessMm / 2 - stone.pavilionDepthMm * GALLERY_RAIL_PAVILION_SHARE;
  const railProgress = (railHeight - base.height) / (tipHeight - base.height);
  const railPoints = outlineRing(
    shapeSpec.outlineAt,
    GALLERY_RAIL_SAMPLES,
    lerpExtent(base.extent, tipExtent, railProgress),
    railHeight,
  );

  return {
    prongs,
    prongRadiusMm,
    clawTipRadiusMm: prongRadiusMm * CLAW_TIP_RADIUS_SCALE,
    railPoints,
    railRadiusMm: prongRadiusMm * GALLERY_RAIL_RADIUS_SCALE,
  };
}
