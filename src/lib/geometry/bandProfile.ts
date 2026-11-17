import type { BandProfile } from '../ringOptions';
import { sampleClosedCurve, signedPower, type Point2 } from './polygon';

/**
 * Both profiles are superellipses: a high exponent gives a flat band with
 * softened edges, a low one gives the domed inside and outside of a court band.
 */
const BAND_PROFILE_EXPONENTS: Record<BandProfile, number> = {
  flat: 8,
  court: 2.6,
};

const FULL_TURN = Math.PI * 2;

/**
 * Closed cross-section of the band, counter-clockwise, centered on the band's mid-line.
 * x is the radial offset (outward positive), y runs along the finger.
 */
export function bandCrossSection(
  profile: BandProfile,
  bandWidthMm: number,
  bandThicknessMm: number,
  segmentCount: number,
): Point2[] {
  const exponent = 2 / BAND_PROFILE_EXPONENTS[profile];
  const halfThickness = bandThicknessMm / 2;
  const halfWidth = bandWidthMm / 2;

  return sampleClosedCurve((t) => {
    const angle = t * FULL_TURN;
    return {
      x: halfThickness * signedPower(Math.cos(angle), exponent),
      y: halfWidth * signedPower(Math.sin(angle), exponent),
    };
  }, segmentCount);
}
