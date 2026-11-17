import { useMemo } from 'react';
import type { Material } from 'three';
import { useDisposable } from '../../hooks/useDisposable';
import { buildBezelCupGeometry } from '../../lib/geometry/bezelCup';
import type { RingDimensions } from '../../lib/ringDimensions';
import type { StoneShape } from '../../lib/ringOptions';

interface BezelHeadProps {
  shape: StoneShape;
  dimensions: RingDimensions;
  material: Material;
}

export function BezelHead({ shape, dimensions, material }: BezelHeadProps) {
  const geometry = useMemo(() => buildBezelCupGeometry(shape, dimensions), [shape, dimensions]);
  useDisposable(geometry);
  return <mesh geometry={geometry} material={material} />;
}
