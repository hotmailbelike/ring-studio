import type { RingDimensions } from '../ringDimensions';
import type { OutlineExtent } from './outlineRing';

// How far the head's base sinks into the band so the joint never shows a gap.
const HEAD_BASE_SINK_MM = 0.5;
// The head narrows towards the band; across the finger it may use this share of the stone's width…
const HEAD_BASE_WIDTH_SCALE = 0.45;
// …and along the finger it must stay within this share of the band's width.
const HEAD_BASE_MAX_BAND_WIDTH_SHARE = 0.75;

export interface HeadBase {
  extent: OutlineExtent;
  height: number;
}

/** Footprint where a prong or bezel head meets the top of the band. */
export function computeHeadBase(dimensions: RingDimensions): HeadBase {
  const { stone } = dimensions;
  const maxHalfLength = (dimensions.bandWidthMm / 2) * HEAD_BASE_MAX_BAND_WIDTH_SHARE;

  return {
    extent: {
      halfWidth: (stone.widthMm / 2) * HEAD_BASE_WIDTH_SCALE,
      halfLength: Math.min((stone.lengthMm / 2) * HEAD_BASE_WIDTH_SCALE, maxHalfLength),
    },
    height: dimensions.outerRadiusMm - HEAD_BASE_SINK_MM,
  };
}
