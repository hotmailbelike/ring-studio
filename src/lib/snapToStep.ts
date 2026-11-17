import type { NumericRange } from './ringConfig';

/** Snaps to the range's step and clamps, removing floating-point noise such as 1.1500000000000001. */
export function snapToStep(value: number, range: NumericRange): number {
  const stepDecimals = (range.step.toString().split('.')[1] ?? '').length;
  const stepsFromMin = Math.round((value - range.min) / range.step);
  const snapped = range.min + stepsFromMin * range.step;
  const clamped = Math.min(Math.max(snapped, range.min), range.max);
  return Number(clamped.toFixed(stepDecimals));
}
