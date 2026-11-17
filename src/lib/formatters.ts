const wholeDollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const dollarsAndCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(amount: number): string {
  return wholeDollars.format(amount);
}

export function formatUsdPrecise(amount: number): string {
  return dollarsAndCents.format(amount);
}

export function formatCarat(caratWeight: number): string {
  return `${caratWeight.toFixed(2)} ct`;
}

export function formatMillimeters(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)} mm`;
}

export function formatGrams(value: number): string {
  return `${value.toFixed(2)} g`;
}

export function formatRingSize(ringSizeUs: number): string {
  return `US ${Number.isInteger(ringSizeUs) ? ringSizeUs : ringSizeUs.toFixed(1)}`;
}
