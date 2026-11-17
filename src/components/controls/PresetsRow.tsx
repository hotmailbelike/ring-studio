import { formatCarat } from '../../lib/formatters';
import { METALS } from '../../lib/metals';
import { RING_PRESETS } from '../../lib/presets';
import { areRingConfigsEqual, type RingConfig } from '../../lib/ringConfig';
import { STONES } from '../../lib/stones';

interface PresetsRowProps {
  currentConfig: RingConfig;
  onSelect: (config: RingConfig) => void;
}

export function PresetsRow({ currentConfig, onSelect }: PresetsRowProps) {
  return (
    <section className="panel-section" aria-labelledby="presets-heading">
      <h2 id="presets-heading" className="section-title">
        Start from a preset
      </h2>
      <ul className="presets">
        {RING_PRESETS.map((preset) => {
          const isActive = areRingConfigsEqual(preset.config, currentConfig);
          const metal = METALS[preset.config.metal];
          const stone = STONES[preset.config.stoneType];
          return (
            <li key={preset.id}>
              <button
                type="button"
                className="preset"
                aria-pressed={isActive}
                onClick={() => onSelect(preset.config)}
              >
                <span className="preset__swatches" aria-hidden="true">
                  <span className="swatch swatch--large" style={{ backgroundColor: metal.colorHex }} />
                  <span className="swatch swatch--large" style={{ backgroundColor: stone.colorHex }} />
                </span>
                <span className="preset__name">{preset.name}</span>
                <span className="preset__meta">
                  {formatCarat(preset.config.caratWeight)} {stone.label.toLowerCase()}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
