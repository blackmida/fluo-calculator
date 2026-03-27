import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateLighting, calculateRoi } from '../src/utils/calculations.js';
import { formatCurrency, formatMeters, formatWatts } from '../src/utils/formatters.js';

test('calculateLighting keeps enough grid slots for the recommended fixture count', () => {
  const lighting = calculateLighting({
    length: '18',
    width: '12',
    height: '6',
    space: 'industrial',
    uf: '0.55',
    mf: '0.70',
    targetLux: 500,
    fixtureLm: 12000,
    fixtureW: 90,
    beamAngle: '90',
  });

  assert.equal(lighting.area, 216);
  assert.ok(lighting.fixtureCount >= 1);
  assert.ok(lighting.cols * lighting.rows >= lighting.fixtureCount);
  assert.equal(lighting.inputs.space.value, 'industrial');
});

test('calculateRoi uses the configured control cost when projecting smart-upgrade ROI', () => {
  const lighting = {
    fixtureCount: 10,
    inputs: {
      fixtureW: 40,
      space: {
        smartReduction: 0.25,
      },
    },
  };

  const roi = calculateRoi({
    mode: 'new',
    newInstallationInputs: {
      systemType: 'standard',
      newInstallPrice: '45',
      newInstallLabor: '15',
      newDailyHours: '10',
      newElectricityPrice: '0.12',
      controlCost: '1200',
    },
    replacementInputs: {},
    lighting,
  });

  const expectedSmartSavings = ((40 * 10) / 1000) * (10 * 365) * 0.25 * 0.12;
  const expectedSmartInvestment = (45 + 15) * 10 + 1200;

  assert.ok(roi.smartBenefit);
  assert.equal(roi.smartBenefit.annualSavings, expectedSmartSavings);
  assert.equal(roi.smartBenefit.roi, expectedSmartInvestment / expectedSmartSavings);
});

test('semantic formatters apply the shared display rules', () => {
  assert.equal(formatMeters(1.234), '1,23 m');
  assert.equal(formatWatts(40.4), '40 W');
  assert.match(formatCurrency(45.5), /45,50\s?€/u);
});
