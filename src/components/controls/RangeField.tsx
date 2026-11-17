import type { CSSProperties } from 'react';
import type { NumericRange } from '../../lib/ringConfig';
import { snapToStep } from '../../lib/snapToStep';

interface RangeFieldProps {
  id: string;
  label: string;
  range: NumericRange;
  value: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  hint?: string;
}

const PERCENT = 100;

export function RangeField({ id, label, range, value, onChange, formatValue, hint }: RangeFieldProps) {
  const formattedValue = formatValue(value);
  const filledPercent = ((value - range.min) / (range.max - range.min)) * PERCENT;
  // Custom property drives the filled part of the track in CSS.
  const trackStyle = { '--range-fill': `${filledPercent}%` } as CSSProperties;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="range-field">
      <div className="range-field__header">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        <output htmlFor={id} className="range-field__value">
          {formattedValue}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range-field__input"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        style={trackStyle}
        aria-valuetext={formattedValue}
        aria-describedby={hintId}
        onChange={(event) => onChange(snapToStep(Number(event.target.value), range))}
      />
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
