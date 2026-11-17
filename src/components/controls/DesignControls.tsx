import {
  BAND_PROFILE_OPTIONS,
  METAL_OPTIONS,
  SETTING_OPTIONS,
  STONE_SHAPE_OPTIONS,
  STONE_TYPE_OPTIONS,
} from '../../lib/controlOptions';
import { formatCarat, formatMillimeters, formatRingSize } from '../../lib/formatters';
import {
  BAND_WIDTH_RANGE_MM,
  CARAT_RANGE,
  RING_SIZE_RANGE_US,
  type RingConfig,
} from '../../lib/ringConfig';
import { ringSizeToInnerDiameterMm } from '../../lib/ringDimensions';
import { ChoiceGroup } from './ChoiceGroup';
import { RangeField } from './RangeField';

interface DesignControlsProps {
  config: RingConfig;
  /** Omit to render the controls read-only. */
  onChange?: (update: Partial<RingConfig>) => void;
}

export function DesignControls({ config, onChange }: DesignControlsProps) {
  const isReadOnly = onChange === undefined;
  const innerDiameter = formatMillimeters(ringSizeToInnerDiameterMm(config.ringSizeUs));

  return (
    <section className="panel-section" aria-labelledby="design-heading">
      <h2 id="design-heading" className="section-title">
        Design
      </h2>
      <fieldset className="design-controls" disabled={isReadOnly}>
        <legend className="visually-hidden">Ring options</legend>

        <ChoiceGroup
          legend="Metal"
          name="metal"
          options={METAL_OPTIONS}
          value={config.metal}
          onChange={(metal) => onChange?.({ metal })}
        />
        <ChoiceGroup
          legend="Center stone shape"
          name="stoneShape"
          options={STONE_SHAPE_OPTIONS}
          value={config.stoneShape}
          onChange={(stoneShape) => onChange?.({ stoneShape })}
        />
        <ChoiceGroup
          legend="Stone"
          name="stoneType"
          options={STONE_TYPE_OPTIONS}
          value={config.stoneType}
          onChange={(stoneType) => onChange?.({ stoneType })}
        />
        <RangeField
          id="caratWeight"
          label="Carat weight"
          range={CARAT_RANGE}
          value={config.caratWeight}
          onChange={(caratWeight) => onChange?.({ caratWeight })}
          formatValue={formatCarat}
          hint="The stone grows with the cube root of its weight, so 2 ct is only ~26% wider than 1 ct."
        />
        <ChoiceGroup
          legend="Setting"
          name="setting"
          options={SETTING_OPTIONS}
          value={config.setting}
          onChange={(setting) => onChange?.({ setting })}
        />
        <RangeField
          id="bandWidthMm"
          label="Band width"
          range={BAND_WIDTH_RANGE_MM}
          value={config.bandWidthMm}
          onChange={(bandWidthMm) => onChange?.({ bandWidthMm })}
          formatValue={(value) => formatMillimeters(value)}
        />
        <ChoiceGroup
          legend="Band profile"
          name="bandProfile"
          options={BAND_PROFILE_OPTIONS}
          value={config.bandProfile}
          onChange={(bandProfile) => onChange?.({ bandProfile })}
        />
        <RangeField
          id="ringSizeUs"
          label="Ring size"
          range={RING_SIZE_RANGE_US}
          value={config.ringSizeUs}
          onChange={(ringSizeUs) => onChange?.({ ringSizeUs })}
          formatValue={formatRingSize}
          hint={`${innerDiameter} inner diameter`}
        />
      </fieldset>
    </section>
  );
}
