import { useMemo } from 'react';
import { useDisposable } from '../../hooks/useDisposable';
import { useGemMaterial } from '../../hooks/useGemMaterial';
import { buildFacetedGemGeometry } from '../../lib/geometry/facetedGem';
import type { StoneDimensions } from '../../lib/ringDimensions';
import type { StoneShape, StoneType } from '../../lib/ringOptions';

interface GemstoneProps {
  shape: StoneShape;
  stoneType: StoneType;
  stone: StoneDimensions;
}

export function Gemstone({ shape, stoneType, stone }: GemstoneProps) {
  const geometry = useMemo(() => buildFacetedGemGeometry(shape, stone), [shape, stone]);
  useDisposable(geometry);

  const stoneDepthMm = stone.crownHeightMm + stone.girdleThicknessMm + stone.pavilionDepthMm;
  const material = useGemMaterial(stoneType, stoneDepthMm);

  return <mesh geometry={geometry} material={material} position-y={stone.girdleCenterHeightMm} />;
}
