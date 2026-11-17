import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { METALS } from '../lib/metals';
import type { MetalId } from '../lib/ringOptions';
import { useDisposable } from './useDisposable';

const METAL_ENVIRONMENT_INTENSITY = 1.15;

/** One shared material for the band and head, so a metal change updates every part at once. */
export function useMetalMaterial(metal: MetalId): MeshStandardMaterial {
  const material = useMemo(() => {
    const spec = METALS[metal];
    return new MeshStandardMaterial({
      color: spec.colorHex,
      metalness: 1,
      roughness: spec.roughness,
      envMapIntensity: METAL_ENVIRONMENT_INTENSITY,
    });
  }, [metal]);
  useDisposable(material);
  return material;
}
