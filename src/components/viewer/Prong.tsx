import { useMemo } from 'react';
import { Quaternion, Vector3, type Material } from 'three';
import type { Prong as ProngPlacement } from '../../lib/geometry/prongLayout';

const CYLINDER_AXIS = new Vector3(0, 1, 0);
// Prongs thicken slightly towards the band, as cast prongs do.
const BASE_FLARE = 1.12;
const RADIAL_SEGMENTS = 20;
const TIP_WIDTH_SEGMENTS = 20;
const TIP_HEIGHT_SEGMENTS = 14;

interface ProngProps {
  placement: ProngPlacement;
  radiusMm: number;
  tipRadiusMm: number;
  material: Material;
}

export function Prong({ placement, radiusMm, tipRadiusMm, material }: ProngProps) {
  const { base, tip } = placement;

  const { midpoint, orientation, lengthMm } = useMemo(() => {
    const direction = new Vector3().subVectors(tip, base);
    return {
      midpoint: new Vector3().addVectors(base, tip).multiplyScalar(0.5),
      orientation: new Quaternion().setFromUnitVectors(CYLINDER_AXIS, direction.clone().normalize()),
      lengthMm: direction.length(),
    };
  }, [base, tip]);

  return (
    <group>
      <mesh material={material} position={midpoint} quaternion={orientation}>
        <cylinderGeometry args={[radiusMm, radiusMm * BASE_FLARE, lengthMm, RADIAL_SEGMENTS]} />
      </mesh>
      <mesh material={material} position={tip}>
        <sphereGeometry args={[tipRadiusMm, TIP_WIDTH_SEGMENTS, TIP_HEIGHT_SEGMENTS]} />
      </mesh>
    </group>
  );
}
