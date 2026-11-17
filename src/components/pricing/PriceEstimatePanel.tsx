import { useMemo } from 'react';
import { formatCarat, formatGrams, formatUsd, formatUsdPrecise } from '../../lib/formatters';
import { METALS } from '../../lib/metals';
import { estimatePrice } from '../../lib/pricing/priceEstimate';
import type { RingConfig } from '../../lib/ringConfig';
import type { RingDimensions } from '../../lib/ringDimensions';
import { SETTING_LABELS } from '../../lib/ringOptions';
import { STONES } from '../../lib/stones';
import { EstimateAssumptions } from './EstimateAssumptions';

interface PriceEstimatePanelProps {
  config: RingConfig;
  dimensions: RingDimensions;
}

const MULTIPLIER_DECIMALS = 2;

export function PriceEstimatePanel({ config, dimensions }: PriceEstimatePanelProps) {
  const estimate = useMemo(() => estimatePrice(config, dimensions), [config, dimensions]);
  const metal = METALS[config.metal];
  const stone = STONES[config.stoneType];

  return (
    <section className="panel-section estimate" aria-labelledby="estimate-heading">
      <div className="estimate__header">
        <h2 id="estimate-heading" className="section-title">
          Estimated price
        </h2>
        <span className="badge">Sample prices</span>
      </div>
      <p className="estimate__total">{formatUsd(estimate.totalUsd)}</p>
      <p className="estimate__disclaimer">
        Illustrative numbers to show the math. Not a quote and not live market data.
      </p>

      <dl className="breakdown">
        <div className="breakdown__row">
          <dt>
            Metal
            <span className="breakdown__detail">
              {metal.label} · {formatGrams(estimate.metalWeightGrams)} ×{' '}
              {formatUsdPrecise(estimate.metalPricePerGramUsd)}/g
            </span>
          </dt>
          <dd>{formatUsd(estimate.metalCostUsd)}</dd>
        </div>
        <div className="breakdown__row">
          <dt>
            Center stone
            <span className="breakdown__detail">
              {formatCarat(config.caratWeight)} {stone.label.toLowerCase()} ×{' '}
              {formatUsd(estimate.stoneBasePricePerCaratUsd)}/ct × {estimate.stoneSizeMultiplier.toFixed(MULTIPLIER_DECIMALS)}{' '}
              size premium
            </span>
          </dt>
          <dd>{formatUsd(estimate.stoneCostUsd)}</dd>
        </div>
        <div className="breakdown__row">
          <dt>
            Setting &amp; labor
            <span className="breakdown__detail">{SETTING_LABELS[config.setting]} setting, casting and polish</span>
          </dt>
          <dd>{formatUsd(estimate.laborCostUsd)}</dd>
        </div>
      </dl>

      <EstimateAssumptions config={config} dimensions={dimensions} estimate={estimate} />
    </section>
  );
}
