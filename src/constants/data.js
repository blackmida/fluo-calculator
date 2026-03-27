export const APP_TEXT = {
  pageTitle: 'Kalkulator rasvete po prostoru',
  subtitle:
    'Izračunajte potrebnu količinu svetlosti, broj svetiljki, potrošnju energije i procenu povraćaja investicije. Rezultati su zasnovani na EN 12464-1 standardu.',
  contactLine: 'B2B rešenja • Projektovanje • Tehnička podrška',
  disclaimer:
    'Ovaj proračun je informativnog karaktera. Za precizno projektovanje i usklađenost sa standardima neophodan je detaljan svetlotehnički proračun.',
};

export const SPACE_TYPES = [
  { value: 'office', label: 'Kancelarija', lux: 500, smartReduction: 0.25, useCase: 'Kancelarije' },
  { value: 'warehouse', label: 'Magacin', lux: 200, smartReduction: 0.4, useCase: 'Magacini' },
  { value: 'retail', label: 'Prodavnica', lux: 400, smartReduction: 0.3, useCase: 'Prodavnice' },
  { value: 'industrial', label: 'Industrijska hala', lux: 500, smartReduction: 0.35, useCase: 'Industrija' },
  { value: 'classroom', label: 'Učionica', lux: 400, smartReduction: 0.28, useCase: 'Obrazovanje' },
  { value: 'parking', label: 'Parking', lux: 125, smartReduction: 0.5, useCase: 'Parking' },
];

export const REFLECTANCE_OPTIONS = [
  { value: '0.65', label: 'Svetla (UF 0.65)' },
  { value: '0.55', label: 'Srednja (UF 0.55)' },
  { value: '0.45', label: 'Tamna (UF 0.45)' },
];

export const MAINTENANCE_OPTIONS = [
  { value: '0.80', label: 'Čista (MF 0.80)' },
  { value: '0.75', label: 'Standardna (MF 0.75)' },
  { value: '0.70', label: 'Industrijska (MF 0.70)' },
  { value: '0.65', label: 'Iscrpna (MF 0.65)' },
];

export const BEAM_OPTIONS = [
  { value: '60', label: '60° (usko)' },
  { value: '90', label: '90° (standard)' },
  { value: '120', label: '120° (široko)' },
];

export const USE_CASES = [
  'Kancelarije',
  'Industrija',
  'Magacini',
  'Prodavnice',
  'Parking',
  'Obrazovanje',
  'Ugostiteljstvo',
  'Putevi i ulice',
];

export const WHY_FLUO_STATS = [
  { value: '18+', label: 'godina iskustva' },
  { value: '1850+', label: 'završenih projekata' },
  { value: '14000+', label: 'proizvoda' },
  { value: '5500+', label: 'klijenata' },
];

export const DEVELOPER_REFERENCE = [
  '// Glavne formule za proračun rasvete',
  'površina = dužina × širina',
  'adjustedUF = UF × (height > 5 ? 0.9 : 1.0) × (height > 8 ? 0.8 : 1.0)',
  'potrebni_lumeni = površina × lux / (adjustedUF × MF)',
  'broj_svetiljki = ceil(potrebni_lumeni / lumeni_po_svetiljki)',
  'ukupna_snaga = broj_svetiljki × snaga_svetiljke',
  'specifična_snaga = ukupna_snaga / površina',
  'dosegnuta_osvetljenost = (broj_svetiljki × lumeni × adjustedUF × MF) / površina',
  '',
  '// Grid logika',
  'cols = ceil(sqrt(count × (length / width)))',
  'rows = ceil(count / cols)',
  'razmak_x = length / (cols - 1)',
  'razmak_y = width / (rows - 1)',
  'dok je razmak > dozvoljen: povećaj broj kolona ili redova',
  '',
  '// Pravila i preporuke',
  'ako visina < 3m → paneli ili downlight',
  'ako 3–5m → linearna ili suspenziona rasveta',
  'ako 5–8m → high-bay rasveta',
  'ako > 8m → high-bay sa užim snopom',
  'ako kancelarija → UGR < 19',
  'ako industrija → cilj > 130 lm/W',
  'ako MF ≤ 0.70 → preporuka IP65 i plan održavanja',
  'ako lm/W < 120 → preporuka efikasnijeg modela',
];

export const DEFAULT_LIGHTING_INPUTS = {
  length: '12',
  width: '8',
  height: '3',
  space: 'office',
  uf: '0.55',
  mf: '0.75',
  targetLux: 500,
  fixtureLm: 5000,
  fixtureW: 40,
  beamAngle: '90',
};

export const DEFAULT_REPLACEMENT_INPUTS = {
  oldWattage: '60',
  oldCount: '20',
  dailyHours: '10',
  electricityPrice: '0.12',
  newPrice: '45',
  installationPrice: '10',
};

export const DEFAULT_NEW_INSTALLATION_INPUTS = {
  systemType: 'standard',
  newInstallPrice: '45',
  newInstallLabor: '15',
  newDailyHours: '10',
  newElectricityPrice: '0.12',
  controlCost: '500',
};
