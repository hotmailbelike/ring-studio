import { useMetalMaterial } from '../../hooks/useMetalMaterial';
import { PRONG_COUNTS } from '../../lib/geometry/prongLayout';
import type { RingConfig } from '../../lib/ringConfig';
import type { RingDimensions } from '../../lib/ringDimensions';
import { SCENE_UNITS_PER_MM } from '../../lib/sceneSettings';
import { Band } from './Band';
import { BezelHead } from './BezelHead';
import { Gemstone } from './Gemstone';
import { ProngHead } from './ProngHead';

interface RingModelProps {
  config: RingConfig;
  dimensions: RingDimensions;
  /** Vertical shift (mm) that centers the whole ring on the orbit target. */
  verticalOffsetMm: number;
}

export function RingModel({ config, dimensions, verticalOffsetMm }: RingModelProps) {
  const metalMaterial = useMetalMaterial(config.metal);

  const head =
    config.setting === 'bezel' ? (
      <BezelHead shape={config.stoneShape} dimensions={dimensions} material={metalMaterial} />
    ) : (
      <ProngHead
        shape={config.stoneShape}
        prongCount={PRONG_COUNTS[config.setting]}
        dimensions={dimensions}
        material={metalMaterial}
      />
    );

  return (
    <group scale={SCENE_UNITS_PER_MM}>
      <group position-y={verticalOffsetMm}>
        <Band dimensions={dimensions} profile={config.bandProfile} material={metalMaterial} />
        {head}
        <Gemstone shape={config.stoneShape} stoneType={config.stoneType} stone={dimensions.stone} />
      </group>
    </group>
  );
}
