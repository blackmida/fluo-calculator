const LOCALE = 'sr-RS';

export function formatNumber(value, options = {}) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return '—';
  }

  return numericValue.toLocaleString(LOCALE, options);
}

export function formatMeasurement(value, unit, options = { maximumFractionDigits: 1 }) {
  return `${formatNumber(value, options)} ${unit}`;
}

export function formatCurrency(value, options = { maximumFractionDigits: 2 }) {
  return `${formatNumber(value, options)} €`;
}

export function formatLux(value) {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} lux`;
}

export function formatLumens(value) {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} lm`;
}

