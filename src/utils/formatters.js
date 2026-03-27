const LOCALE = 'sr-RS';
const EMPTY_VALUE = '—';

const INTEGER_FORMAT = { maximumFractionDigits: 0 };
const ONE_DECIMAL_FORMAT = { maximumFractionDigits: 1 };
const TWO_DECIMAL_FORMAT = { maximumFractionDigits: 2 };

export function formatNumber(value, options = {}) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return EMPTY_VALUE;
  }

  return new Intl.NumberFormat(LOCALE, options).format(numericValue);
}

function formatWithUnit(value, unit, options) {
  const formattedValue = formatNumber(value, options);
  return formattedValue === EMPTY_VALUE ? formattedValue : `${formattedValue} ${unit}`;
}

export function formatMeasurement(value, unit, options = ONE_DECIMAL_FORMAT) {
  return formatWithUnit(value, unit, options);
}

export function formatCount(value) {
  return formatNumber(value, INTEGER_FORMAT);
}

export function formatMeters(value) {
  return formatWithUnit(value, 'm', TWO_DECIMAL_FORMAT);
}

export function formatSquareMeters(value) {
  return formatWithUnit(value, 'm²', ONE_DECIMAL_FORMAT);
}

export function formatCurrency(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return EMPTY_VALUE;
  }

  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function formatWatts(value) {
  return formatWithUnit(value, 'W', INTEGER_FORMAT);
}

export function formatPowerDensity(value) {
  return formatWithUnit(value, 'W/m²', ONE_DECIMAL_FORMAT);
}

export function formatLux(value) {
  return formatWithUnit(value, 'lux', INTEGER_FORMAT);
}

export function formatLumens(value) {
  return formatWithUnit(value, 'lm', INTEGER_FORMAT);
}

export function formatKilowattHours(value) {
  return formatWithUnit(value, 'kWh', INTEGER_FORMAT);
}

export function formatLumensPerWatt(value) {
  return formatWithUnit(value, 'lm/W', INTEGER_FORMAT);
}

export function formatYears(value) {
  return formatNumber(value, ONE_DECIMAL_FORMAT);
}

export function formatHoursPerDay(value) {
  return formatWithUnit(value, 'h/dan', ONE_DECIMAL_FORMAT);
}

export function formatPercent(value) {
  const formattedValue = formatNumber(value, INTEGER_FORMAT);
  return formattedValue === EMPTY_VALUE ? formattedValue : `${formattedValue}%`;
}
