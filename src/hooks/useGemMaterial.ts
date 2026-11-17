import { useMemo } from 'react';
import { MeshPhysicalMaterial } from 'three';
import type { StoneType } from '../lib/ringOptions';
import { SCENE_UNITS_PER_MM } from '../lib/sceneSettings';
import { STONES } from '../lib/stones';
import { useDisposable } from './useDisposable';

// Strong reflections are what make facets flash as the view turns.
const GEM_ENVIRONMENT_INTENSITY = 2.6;

export function useGemMaterial(stoneType: StoneType, stoneDepthMm: number): MeshPhysicalMaterial {
  const material = useMemo(() => {
    const spec = STONES[stoneType];
    return new MeshPhysicalMaterial({
      color: spec.colorHex,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      ior: spec.indexOfRefraction,
      // thickness is measured in the mesh's own (millimeter) space…
      thickness: stoneDepthMm,
      dispersion: spec.dispersion,
      attenuationColor: spec.attenuationColorHex,
      // …while attenuation distance is in world units.
      attenuationDistance: spec.attenuationDistanceMm * SCENE_UNITS_PER_MM,
      specularIntensity: 1,
      envMapIntensity: GEM_ENVIRONMENT_INTENSITY,
      flatShading: true,
    });
  }, [stoneType, stoneDepthMm]);
  useDisposable(material);
  return material;
}
