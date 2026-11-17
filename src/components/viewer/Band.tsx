import { useMemo } from 'react';
import { Vector2, type Material } from 'three';
import { bandCrossSection } from '../../lib/geometry/bandProfile';
import type { RingDimensions } from '../../lib/ringDimensions';
import type { BandProfile } from '../../lib/ringOptions';

const CROSS_SECTION_SEGMENTS = 64;
const AROUND_FINGER_SEGMENTS = 180;
// LatheGeometry spins around Y; tipping it onto its side stands the ring upright.
const STAND_UPRIGHT_ROTATION = Math.PI / 2;

interface BandProps {
  dimensions: RingDimensions;
  profile: BandProfile;
  material: Material;
}

export function Band({ dimensions, profile, material }: BandProps) {
  const { innerRadiusMm, bandThicknessMm, bandWidthMm } = dimensions;

  const latheProfile = useMemo(() => {
    const centerRadius = innerRadiusMm + bandThicknessMm / 2;
    const points = bandCrossSection(profile, bandWidthMm, bandThicknessMm, CROSS_SECTION_SEGMENTS).map(
      (point) => new Vector2(centerRadius + point.x, point.y),
    );
    const [firstPoint] = points;
    return firstPoint ? [...points, firstPoint.clone()] : points;
  }, [innerRadiusMm, bandThicknessMm, bandWidthMm, profile]);

  return (
    <mesh material={material} rotation-x={STAND_UPRIGHT_ROTATION}>
      <latheGeometry args={[latheProfile, AROUND_FINGER_SEGMENTS]} />
    </mesh>
  );
}
