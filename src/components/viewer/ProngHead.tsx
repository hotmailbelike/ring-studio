import { useMemo } from 'react';
import { CatmullRomCurve3, type Material } from 'three';
import { computeProngLayout, type ProngCount } from '../../lib/geometry/prongLayout';
import type { RingDimensions } from '../../lib/ringDimensions';
import type { StoneShape } from '../../lib/ringOptions';
import { Prong } from './Prong';

const RAIL_TUBULAR_SEGMENTS = 128;
const RAIL_RADIAL_SEGMENTS = 12;
const CLOSED_CURVE = true;

interface ProngHeadProps {
  shape: StoneShape;
  prongCount: ProngCount;
  dimensions: RingDimensions;
  material: Material;
}

export function ProngHead({ shape, prongCount, dimensions, material }: ProngHeadProps) {
  const layout = useMemo(() => computeProngLayout(shape, prongCount, dimensions), [shape, prongCount, dimensions]);
  const railCurve = useMemo(() => new CatmullRomCurve3(layout.railPoints, CLOSED_CURVE), [layout]);

  return (
    <group>
      {layout.prongs.map((placement, index) => (
        <Prong
          key={index}
          placement={placement}
          radiusMm={layout.prongRadiusMm}
          tipRadiusMm={layout.clawTipRadiusMm}
          material={material}
        />
      ))}
      <mesh material={material}>
        <tubeGeometry
          args={[railCurve, RAIL_TUBULAR_SEGMENTS, layout.railRadiusMm, RAIL_RADIAL_SEGMENTS, CLOSED_CURVE]}
        />
      </mesh>
    </group>
  );
}
