import type { ChoiceOption } from '../../lib/controlOptions';

interface ChoiceGroupProps<T extends string> {
  legend: string;
  name: string;
  options: readonly ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A native radio group styled as chips, so arrow-key navigation and screen readers work as expected. */
export function ChoiceGroup<T extends string>({ legend, name, options, value, onChange }: ChoiceGroupProps<T>) {
  return (
    <fieldset className="choice-group">
      <legend className="field-label">{legend}</legend>
      <div className="choice-group__options">
        {options.map((option) => (
          <label key={option.value} className="chip">
            <input
              type="radio"
              className="chip__input"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            <span className="chip__face">
              {option.swatchColor && (
                <span className="swatch" style={{ backgroundColor: option.swatchColor }} aria-hidden="true" />
              )}
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
