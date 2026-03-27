import { SPACE_TYPES } from '../constants/data';

function parseNumber(value, fallback = 0) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function getSpaceConfig(spaceValue) {
  return SPACE_TYPES.find((space) => space.value === spaceValue) ?? SPACE_TYPES[0];
}

function getUniformity(spacingRatio) {
  if (spacingRatio <= 1.2) {
    return { label: 'Dobra (Uo ≈ 0.6–0.8)', tone: 'success' };
  }

  if (spacingRatio <= 1.5) {
    return { label: 'Srednja (Uo ≈ 0.4–0.6)', tone: 'warning' };
  }

  return { label: 'Loša (Uo < 0.4)', tone: 'error' };
}

function getHeightRecommendation(height) {
  if (height < 3) {
    return 'Visina ispod 3 m: paneli ili downlight svetiljke su najlogičniji izbor.';
  }

  if (height <= 5) {
    return 'Visina 3–5 m: linearna ili suspenziona rasveta daje dobar balans.';
  }

  if (height <= 8) {
    return 'Visina 5–8 m: razmotrite industrijsku high-bay rasvetu.';
  }

  return 'Visina preko 8 m: potreban je uži snop i specijalna high-bay rasveta.';
}

function getTierData(baseLm, baseW) {
  return [
    {
      name: 'Ekonomično',
      tone: 'neutral',
      lm: Math.round(baseLm * 0.8),
      w: Math.round(baseW * 0.85),
      badge: null,
    },
    {
      name: 'Optimalno',
      tone: 'primary',
      lm: Math.round(baseLm),
      w: Math.round(baseW),
      badge: 'Preporučeno',
    },
    {
      name: 'Premium',
      tone: 'success',
      lm: Math.round(baseLm * 1.15),
      w: Math.round(baseW * 0.9),
      badge: null,
    },
  ];
}

export function calculateLighting(rawInputs) {
  const space = getSpaceConfig(rawInputs.space);
  const length = Math.max(parseNumber(rawInputs.length, 12), 0.1);
  const width = Math.max(parseNumber(rawInputs.width, 8), 0.1);
  const height = Math.max(parseNumber(rawInputs.height, 3), 0.1);
  const ufBase = parseNumber(rawInputs.uf, 0.55);
  const mf = parseNumber(rawInputs.mf, 0.75);
  const targetLux = Math.max(parseNumber(rawInputs.targetLux, space.lux), 50);
  const fixtureLm = Math.max(parseNumber(rawInputs.fixtureLm, 5000), 1000);
  const fixtureW = Math.max(parseNumber(rawInputs.fixtureW, 40), 1);
  const beamAngleDeg = Math.max(parseNumber(rawInputs.beamAngle, 90), 1);

  let adjustedUf = ufBase;
  if (height > 5) adjustedUf *= 0.9;
  if (height > 8) adjustedUf *= 0.8;
  adjustedUf = clamp(adjustedUf, 0.3, 0.8);

  const area = length * width;
  const requiredLumens = (area * targetLux) / (adjustedUf * mf);
  const lumenBasedCount = Math.max(1, Math.ceil(requiredLumens / fixtureLm));

  const beamAngleRad = (beamAngleDeg * Math.PI) / 180;
  const maxSpacingByBeam = Math.max(0.8, 2 * height * Math.tan(beamAngleRad / 2) * 0.6);
  const recommendedSpacing = Math.max(0.8, height * 1.2);
  const designSpacing = Math.min(maxSpacingByBeam, recommendedSpacing);

  let cols = Math.max(1, Math.ceil(Math.sqrt(lumenBasedCount * (length / width))));
  let rows = Math.max(1, Math.ceil(lumenBasedCount / cols));

  let spacingX = cols > 1 ? length / (cols - 1) : length;
  let spacingY = rows > 1 ? width / (rows - 1) : width;

  while ((spacingX > designSpacing || spacingY > designSpacing) && cols * rows < 5000) {
    if (spacingX >= spacingY) {
      cols += 1;
    } else {
      rows += 1;
    }

    rows = Math.max(rows, Math.ceil(lumenBasedCount / cols));
    spacingX = cols > 1 ? length / (cols - 1) : length;
    spacingY = rows > 1 ? width / (rows - 1) : width;
  }

  const fixtureCount = Math.max(lumenBasedCount, cols * rows);
  rows = Math.max(rows, Math.ceil(fixtureCount / cols));
  spacingX = cols > 1 ? length / (cols - 1) : length;
  spacingY = rows > 1 ? width / (rows - 1) : width;

  const spacing = Math.max(spacingX, spacingY);
  const totalPower = fixtureCount * fixtureW;
  const totalFlux = fixtureCount * fixtureLm;
  const wPerM2 = totalPower / area;
  const estimatedLux = (fixtureCount * fixtureLm * adjustedUf * mf) / area;
  const spacingRatio = spacing / Math.max(height, 0.1);
  const efficiency = fixtureLm / Math.max(fixtureW, 1);
  const uniformity = getUniformity(spacingRatio);

  const recommendations = [
    getHeightRecommendation(height),
    space.value === 'office' ? 'Za kancelariju je preporuka UGR < 19.' : null,
    space.value === 'industrial' ? 'Za industrijski prostor ciljajte efikasnost preko 130 lm/W.' : null,
    mf <= 0.7 ? 'Niži faktor održavanja traži IP65 zaštitu i plan održavanja.' : null,
    estimatedLux < targetLux
      ? 'Sistem je ispod ciljne osvetljenosti: povećajte lumene ili broj svetiljki.'
      : null,
    estimatedLux > targetLux * 1.25
      ? 'Sistem je iznad ciljne osvetljenosti: postoji prostor za optimizaciju investicije.'
      : null,
    spacingRatio > 1.5
      ? 'Razmak između svetiljki je velik i može sniziti ravnomernost.'
      : 'Razmak je u prihvatljivom opsegu za ravnomernije osvetljenje.',
    wPerM2 > 15
      ? `Specifična snaga je visoka (${wPerM2.toFixed(1)} W/m²): razmotrite efikasniji model.`
      : null,
    efficiency < 120
      ? `Efikasnost svetiljke je ${efficiency.toFixed(0)} lm/W: preporuka je 150+ lm/W.`
      : null,
    'Za finalni projekat je potreban detaljan svetlotehnički proračun.',
  ].filter(Boolean);

  const tiers = getTierData(fixtureLm, fixtureW).map((tier) => {
    const count = Math.ceil(requiredLumens / tier.lm);
    const totalTierPower = count * tier.w;

    return {
      ...tier,
      count,
      totalPower: totalTierPower,
      efficiency: tier.lm / Math.max(tier.w, 1),
    };
  });

  return {
    inputs: {
      length,
      width,
      height,
      ufBase,
      mf,
      targetLux,
      fixtureLm,
      fixtureW,
      beamAngleDeg,
      space,
    },
    area,
    adjustedUf,
    requiredLumens,
    estimatedLux,
    fixtureCount,
    totalFlux,
    totalPower,
    wPerM2,
    spacing,
    spacingX,
    spacingY,
    cols,
    rows,
    gridRatioLabel: `${cols}×${rows}`,
    uniformity,
    efficiency,
    showEfficiencyOption: efficiency < 120,
    recommendations,
    tiers,
  };
}

function getRoiBadge(roi) {
  if (!Number.isFinite(roi)) {
    return null;
  }

  if (roi < 2) {
    return {
      tone: 'success',
      label: 'Izuzetno isplativo',
      value: roi,
      description: 'Brz povraćaj',
    };
  }

  if (roi <= 4) {
    return {
      tone: 'primary',
      label: 'Dobra investicija',
      value: roi,
      description: 'Solidna ušteda',
    };
  }

  return {
    tone: 'warning',
    label: 'Dugoročan povraćaj',
    value: roi,
    description: 'Ekološka i ekonomska korist',
  };
}

function calculateReplacementRoi(rawInputs, lighting) {
  const oldWattage = parseNumber(rawInputs.oldWattage, 60);
  const oldCount = parseNumber(rawInputs.oldCount, 20);
  const dailyHours = parseNumber(rawInputs.dailyHours, 10);
  const electricityPrice = parseNumber(rawInputs.electricityPrice, 0.12);
  const newPrice = parseNumber(rawInputs.newPrice, 45);
  const installationPrice = parseNumber(rawInputs.installationPrice, 10);

  const annualHours = dailyHours * 365;
  const consumptionA = ((oldWattage * oldCount) / 1000) * annualHours;
  const consumptionB = ((lighting.inputs.fixtureW * lighting.fixtureCount) / 1000) * annualHours;
  const savingsKWh = consumptionA - consumptionB;
  const savingsEur = savingsKWh * electricityPrice;
  const totalInvestment = (newPrice + installationPrice) * lighting.fixtureCount;
  const roi = savingsEur > 0 ? totalInvestment / savingsEur : Infinity;

  return {
    mode: 'replacement',
    scenarioALabel: 'Postojeći sistem',
    scenarioBLabel: 'Nova rasveta',
    consumptionA,
    consumptionB,
    savingsKWh,
    savingsEur,
    totalInvestment,
    roi,
    badge: getRoiBadge(roi),
    highlight:
      savingsEur > 0
        ? {
            titleType: 'savings',
            annualSavings: savingsEur,
            paybackYears: roi,
          }
        : null,
    smartBenefit: null,
    reductionLabel: null,
    dailyHours,
  };
}

function calculateNewInstallationRoi(rawInputs, lighting) {
  const newInstallPrice = parseNumber(rawInputs.newInstallPrice, 45);
  const newInstallLabor = parseNumber(rawInputs.newInstallLabor, 15);
  const newDailyHours = parseNumber(rawInputs.newDailyHours, 10);
  const newElectricityPrice = parseNumber(rawInputs.newElectricityPrice, 0.12);
  const systemType = rawInputs.systemType ?? 'standard';
  const controlCost = systemType === 'smart' ? parseNumber(rawInputs.controlCost, 500) : 0;
  const smartReduction = systemType === 'smart' ? lighting.inputs.space.smartReduction : 0;

  const annualHours = newDailyHours * 365;
  const baseConsumption = ((lighting.inputs.fixtureW * lighting.fixtureCount) / 1000) * annualHours;
  const reducedConsumption = baseConsumption * (1 - smartReduction);
  const savingsKWh = baseConsumption - reducedConsumption;
  const savingsEur = savingsKWh * newElectricityPrice;
  const totalInvestment = (newInstallPrice + newInstallLabor) * lighting.fixtureCount + controlCost;
  const roi = savingsEur > 0 ? totalInvestment / savingsEur : Infinity;

  const potentialReduction = lighting.inputs.space.smartReduction;
  const smartSavings = baseConsumption * potentialReduction * newElectricityPrice;
  const smartRoi = smartSavings > 0 ? (totalInvestment + 500) / smartSavings : Infinity;

  return {
    mode: 'new',
    scenarioALabel: 'Standardna rasveta',
    scenarioBLabel: systemType === 'smart' ? 'Pametna rasveta' : 'Nova rasveta',
    systemType,
    controlReduction: smartReduction,
    consumptionA: baseConsumption,
    consumptionB: reducedConsumption,
    savingsKWh,
    savingsEur,
    totalInvestment,
    roi,
    badge: getRoiBadge(roi),
    highlight:
      systemType === 'smart' && savingsEur > 0
        ? {
            titleType: 'smart',
            annualSavings: savingsEur,
            paybackYears: roi,
            reductionPercent: Math.round(smartReduction * 100),
          }
        : {
            titleType: 'new-installation',
            totalInvestment,
            dailyHours: newDailyHours,
          },
    smartBenefit:
      systemType === 'standard' && smartSavings > 0
        ? {
            potentialReduction: Math.round(potentialReduction * 100),
            annualSavings: smartSavings,
            roi: smartRoi,
          }
        : null,
    reductionLabel:
      systemType === 'smart'
        ? {
            title: 'Ušteda kontrolom',
            percent: Math.round(smartReduction * 100),
            value: savingsKWh,
          }
        : null,
    dailyHours: newDailyHours,
  };
}

export function calculateRoi({ mode, replacementInputs, newInstallationInputs, lighting }) {
  if (mode === 'replacement') {
    return calculateReplacementRoi(replacementInputs, lighting);
  }

  return calculateNewInstallationRoi(newInstallationInputs, lighting);
}

