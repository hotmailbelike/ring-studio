import {
  formatGrams,
  formatMillimeters,
  formatUsd,
  formatUsdPrecise,
} from '../../lib/formatters';
import { METALS } from '../../lib/metals';
import {
  BASE_LABOR_USD,
  SETTING_LABOR_USD,
  STONE_SIZE_PREMIUM_EXPONENT,
} from '../../lib/pricing/pricingConstants';
import type { PriceEstimate } from '../../lib/pricing/priceEstimate';
import type { RingConfig } from '../../lib/ringConfig';
import { ringSizeToInnerDiameterMm, type RingDimensions } from '../../lib/ringDimensions';
import { BAND_PROFILE_LABELS, METAL_IDS, SETTING_LABELS, STONE_TYPES } from '../../lib/ringOptions';
import { STONES } from '../../lib/stones';

interface EstimateAssumptionsProps {
  config: RingConfig;
  dimensions: RingDimensions;
  estimate: PriceEstimate;
}

const PERCENT = 100;

function formatCubicMm(volume: number): string {
  return `${Math.round(volume)} mm³`;
}

export function EstimateAssumptions({ config, dimensions, estimate }: EstimateAssumptionsProps) {
  const metal = METALS[config.metal];
  const fillPercent = Math.round(estimate.bandFillRatio * PERCENT);

  return (
    <details className="disclosure">
      <summary className="disclosure__summary">How this is estimated</summary>
      <div className="disclosure__body">
        <ol className="assumptions">
          <li>
            <strong>Finger size.</strong> US size {config.ringSizeUs} → inner diameter = 11.63 + 0.8128 × size ={' '}
            {formatMillimeters(ringSizeToInnerDiameterMm(config.ringSizeUs), 2)}.
          </li>
          <li>
            <strong>Band volume.</strong> A {formatMillimeters(dimensions.bandWidthMm)} wide ×{' '}
            {formatMillimeters(dimensions.bandThicknessMm)} thick cross-section (the{' '}
            {BAND_PROFILE_LABELS[config.bandProfile].toLowerCase()} profile fills {fillPercent}% of that rectangle) swept
            once around the finger, using Pappus’s theorem: {formatCubicMm(estimate.bandVolumeMm3)}.
          </li>
          <li>
            <strong>Head.</strong> About {formatCubicMm(estimate.settingVolumeMm3)} of metal for a{' '}
            {SETTING_LABELS[config.setting].toLowerCase()} setting, scaled to the stone’s footprint.
          </li>
          <li>
            <strong>Weight.</strong> Volume × density ({metal.densityGramsPerCm3} g/cm³ for {metal.label.toLowerCase()}) ={' '}
            {formatGrams(estimate.metalWeightGrams)}.
          </li>
          <li>
            <strong>Stone.</strong> Carat × sample price per carat × carat<sup>{STONE_SIZE_PREMIUM_EXPONENT}</sup> size
            premium (bigger stones cost more per carat). Cut shape does not change the price here.
          </li>
          <li>
            <strong>Labor.</strong> {formatUsd(BASE_LABOR_USD)} base + {formatUsd(SETTING_LABOR_USD[config.setting])}{' '}
            for the setting.
          </li>
        </ol>

        <div className="sample-tables">
          <table className="sample-table">
            <caption>Sample metal prices</caption>
            <thead>
              <tr>
                <th scope="col">Metal</th>
                <th scope="col">g/cm³</th>
                <th scope="col">Per gram</th>
              </tr>
            </thead>
            <tbody>
              {METAL_IDS.map((id) => (
                <tr key={id}>
                  <th scope="row">{METALS[id].label}</th>
                  <td>{METALS[id].densityGramsPerCm3}</td>
                  <td>{formatUsdPrecise(METALS[id].samplePricePerGramUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="sample-table">
            <caption>Sample stone prices</caption>
            <thead>
              <tr>
                <th scope="col">Stone</th>
                <th scope="col">Per carat (1 ct)</th>
              </tr>
            </thead>
            <tbody>
              {STONE_TYPES.map((type) => (
                <tr key={type}>
                  <th scope="row">{STONES[type].label}</th>
                  <td>{formatUsd(STONES[type].samplePricePerCaratUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="field-hint">
          Not included: taxes, retail markup, side stones, finishing, certification or real market movement.
        </p>
      </div>
    </details>
  );
}
