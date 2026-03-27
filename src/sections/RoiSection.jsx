import {
  AccessTimeRounded,
  BoltRounded,
  CreditCardRounded,
  DeviceHubRounded,
  InsightsRounded,
  RadioButtonCheckedRounded,
  SensorOccupiedRounded,
  TipsAndUpdatesRounded,
  TrendingUpRounded,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import { formatCurrency, formatNumber } from '../utils/formatters';
import SectionCard from '../components/SectionCard';

function SummaryTile({ title, value, subtitle, tone = 'default' }) {
  const toneMap = {
    default: {
      bg: '#f8fbff',
      border: 'rgba(12, 77, 179, 0.14)',
      text: 'primary.main',
      eyebrow: 'text.secondary',
    },
    success: {
      bg: '#eefaf3',
      border: 'rgba(21, 128, 61, 0.18)',
      text: 'success.main',
      eyebrow: 'text.secondary',
    },
    warning: {
      bg: '#fff7ea',
      border: 'rgba(199, 122, 0, 0.22)',
      text: 'warning.main',
      eyebrow: 'text.secondary',
    },
  };

  const styles = toneMap[tone] ?? toneMap.default;

  return (
    <Paper
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: styles.border,
        bgcolor: styles.bg,
        textAlign: 'center',
      }}
    >
      <Typography variant="caption" color={styles.eyebrow} fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="h2" className="mono" color={styles.text} sx={{ mt: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}

function ModeButton({ active, children, onClick }) {
  return (
    <Button
      variant={active ? 'contained' : 'outlined'}
      color="primary"
      onClick={onClick}
      sx={{
        minWidth: 210,
        justifyContent: 'center',
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      }}
    >
      {children}
    </Button>
  );
}

function FieldStackCard({ icon: Icon, title, children }) {
  return (
    <SectionCard icon={Icon} title={title} sx={{ boxShadow: 'none' }}>
      <Stack spacing={2}>{children}</Stack>
    </SectionCard>
  );
}

export default function RoiSection({
  roiMode,
  onRoiModeChange,
  replacementInputs,
  newInstallationInputs,
  onReplacementFieldChange,
  onNewInstallationFieldChange,
  roiResults,
  lightingResults,
}) {
  const badgeTone = roiResults.badge?.tone ?? 'default';
  const highlightAlert =
    roiResults.mode === 'replacement'
      ? {
          severity: 'success',
          title: `Uštedite ${formatCurrency(roiResults.highlight?.annualSavings ?? 0)} godišnje`,
          description: `Investicija se vraća za ${formatNumber(
            roiResults.highlight?.paybackYears,
            { maximumFractionDigits: 1 },
          )} godina. Potom: besplatna rasveta.`,
        }
      : roiResults.systemType === 'smart'
        ? {
            severity: 'success',
            title: `Uštedite ${formatCurrency(roiResults.highlight?.annualSavings ?? 0)} godišnje`,
            description: `Pametna kontrola skida približno ${roiResults.highlight?.reductionPercent ?? 0}% potrošnje, a investicija se vraća za ${formatNumber(
              roiResults.highlight?.paybackYears,
              { maximumFractionDigits: 1 },
            )} godina.`,
          }
        : {
            severity: 'info',
            title: `Pouzdana rasveta za ${formatNumber(roiResults.highlight?.dailyHours ?? 0, {
              maximumFractionDigits: 1,
            })} h/dan`,
            description: `Ukupna investicija: ${formatCurrency(roiResults.highlight?.totalInvestment ?? 0)}.`,
          };

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
        <Box
          sx={(theme) => ({
            width: 36,
            height: 36,
            borderRadius: 1,
            display: 'grid',
            placeItems: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
          })}
        >
          <TrendingUpRounded fontSize="small" />
        </Box>
        <Typography variant="h3">Ušteda i povraćaj investicije</Typography>
      </Stack>

      <Typography variant="caption" color="text.secondary" fontWeight={700}>
        SCENARIJ
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={1.5} mb={3}>
        <ModeButton active={roiMode === 'replacement'} onClick={() => onRoiModeChange('replacement')}>
          Zamena postojeće rasvete
        </ModeButton>
        <ModeButton active={roiMode === 'new'} onClick={() => onRoiModeChange('new')}>
          Nova instalacija
        </ModeButton>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 0.95fr) minmax(320px, 0.8fr)' },
        }}
      >
        <Stack spacing={2.5}>
          {roiMode === 'replacement' ? (
            <>
              <FieldStackCard icon={BoltRounded} title="Postojeći sistem">
                <TextField
                  label="Snaga postojeće svetiljke (W)"
                  type="number"
                  value={replacementInputs.oldWattage}
                  onChange={(event) => onReplacementFieldChange('oldWattage', event.target.value)}
                  inputProps={{ min: 5, max: 500, step: 5 }}
                />
                <TextField
                  label="Broj postojećih svetiljki"
                  type="number"
                  value={replacementInputs.oldCount}
                  onChange={(event) => onReplacementFieldChange('oldCount', event.target.value)}
                  inputProps={{ min: 1, max: 1000, step: 1 }}
                />
              </FieldStackCard>

              <FieldStackCard icon={AccessTimeRounded} title="Radni parametri">
                <TextField
                  label="Radni sati dnevno"
                  type="number"
                  value={replacementInputs.dailyHours}
                  onChange={(event) => onReplacementFieldChange('dailyHours', event.target.value)}
                  inputProps={{ min: 0.5, max: 24, step: 0.5 }}
                />
                <TextField
                  label="Cena struje (€/kWh)"
                  type="number"
                  value={replacementInputs.electricityPrice}
                  onChange={(event) => onReplacementFieldChange('electricityPrice', event.target.value)}
                  inputProps={{ min: 0.01, max: 1, step: 0.01 }}
                />
              </FieldStackCard>

              <FieldStackCard icon={CreditCardRounded} title="Nova rasveta">
                <TextField
                  label="Cena nove svetiljke (€)"
                  type="number"
                  value={replacementInputs.newPrice}
                  onChange={(event) => onReplacementFieldChange('newPrice', event.target.value)}
                  inputProps={{ min: 1, max: 5000, step: 0.5 }}
                />
                <TextField
                  label="Instalacija po svetiljci (€)"
                  type="number"
                  value={replacementInputs.installationPrice}
                  onChange={(event) =>
                    onReplacementFieldChange('installationPrice', event.target.value)
                  }
                  inputProps={{ min: 0, max: 500, step: 0.5 }}
                />
              </FieldStackCard>
            </>
          ) : (
            <>
              <FieldStackCard icon={RadioButtonCheckedRounded} title="Tip sistema">
                <RadioGroup
                  value={newInstallationInputs.systemType}
                  onChange={(event) =>
                    onNewInstallationFieldChange('systemType', event.target.value)
                  }
                >
                  <FormControlLabel
                    value="standard"
                    control={<Radio />}
                    label="Standardna rasveta bez kontrole"
                  />
                  <FormControlLabel
                    value="smart"
                    control={<Radio />}
                    label="Pametna rasveta sa DALI kontrolom"
                  />
                </RadioGroup>
              </FieldStackCard>

              <FieldStackCard icon={CreditCardRounded} title="Investicija">
                <TextField
                  label="Cena svetiljke (€)"
                  type="number"
                  value={newInstallationInputs.newInstallPrice}
                  onChange={(event) =>
                    onNewInstallationFieldChange('newInstallPrice', event.target.value)
                  }
                  inputProps={{ min: 1, max: 5000, step: 0.5 }}
                />
                <TextField
                  label="Instalacija (€/kom)"
                  type="number"
                  value={newInstallationInputs.newInstallLabor}
                  onChange={(event) =>
                    onNewInstallationFieldChange('newInstallLabor', event.target.value)
                  }
                  inputProps={{ min: 0, max: 500, step: 0.5 }}
                />
                {newInstallationInputs.systemType === 'smart' ? (
                  <TextField
                    label="Kontrolni sistem (€)"
                    type="number"
                    value={newInstallationInputs.controlCost}
                    onChange={(event) =>
                      onNewInstallationFieldChange('controlCost', event.target.value)
                    }
                    inputProps={{ min: 100, max: 5000, step: 50 }}
                  />
                ) : null}
              </FieldStackCard>

              <FieldStackCard icon={AccessTimeRounded} title="Radni parametri">
                <TextField
                  label="Radni sati dnevno"
                  type="number"
                  value={newInstallationInputs.newDailyHours}
                  onChange={(event) =>
                    onNewInstallationFieldChange('newDailyHours', event.target.value)
                  }
                  inputProps={{ min: 0.5, max: 24, step: 0.5 }}
                />
                <TextField
                  label="Cena struje (€/kWh)"
                  type="number"
                  value={newInstallationInputs.newElectricityPrice}
                  onChange={(event) =>
                    onNewInstallationFieldChange('newElectricityPrice', event.target.value)
                  }
                  inputProps={{ min: 0.01, max: 1, step: 0.01 }}
                />
              </FieldStackCard>
            </>
          )}
        </Stack>

        <Stack spacing={2.5}>
          <Paper
            sx={(theme) => ({
              p: 3,
              background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
                theme.palette.primary.main,
                0.02,
              )} 100%)`,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.12),
            })}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <InsightsRounded color="primary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700}>
                Aktivni scenario
              </Typography>
            </Stack>

            <Stack spacing={1.2}>
              <Typography variant="body2" color="text.secondary">
                Nova konfiguracija trenutno predlaže{' '}
                <Box component="span" fontWeight={800} color="text.primary">
                  {formatNumber(lightingResults.fixtureCount, { maximumFractionDigits: 0 })}
                </Box>{' '}
                svetiljki od{' '}
                <Box component="span" fontWeight={800} color="text.primary">
                  {formatNumber(lightingResults.inputs.fixtureW, { maximumFractionDigits: 0 })} W
                </Box>
                .
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ukupna instalirana snaga je{' '}
                <Box component="span" fontWeight={800} color="text.primary">
                  {formatNumber(lightingResults.totalPower, { maximumFractionDigits: 0 })} W
                </Box>
                , a ciljna osvetljenost{' '}
                <Box component="span" fontWeight={800} color="text.primary">
                  {formatNumber(lightingResults.inputs.targetLux, { maximumFractionDigits: 0 })} lux
                </Box>
                .
              </Typography>
              {roiMode === 'new' ? (
                <Typography variant="body2" color="text.secondary">
                  {newInstallationInputs.systemType === 'smart'
                    ? 'Pametna kontrola je uključena, pa ROI računa i dodatno smanjenje potrošnje.'
                    : 'Standardni scenario je aktivan; dole dobijaš i procenu šta bi smart kontrola dodala.'}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Upoređujemo postojeći sistem sa novim projektovanim rasporedom i snagom.
                </Typography>
              )}
            </Stack>
          </Paper>

          <Paper
            sx={(theme) => ({
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, rgba(255,255,255,0.92) 100%)`,
              border: '1px solid',
              borderColor: alpha(theme.palette.secondary.main, 0.16),
            })}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <TipsAndUpdatesRounded color="secondary" fontSize="small" />
              <Typography variant="subtitle2" fontWeight={700}>
                Operativni savet
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Najbolji ROI obično dolazi iz kombinacije korektnog broja svetiljki, više efikasnosti
              po vatu i, kada ima smisla, pametne kontrole sa senzorima.
            </Typography>
          </Paper>
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 4,
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={2}>
            Godišnja potrošnja energije
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" gap={2}>
              <Typography variant="body2" color="text.secondary">
                {roiResults.scenarioALabel}
              </Typography>
              <Typography variant="body2" fontWeight={700} className="mono">
                {formatNumber(roiResults.consumptionA, { maximumFractionDigits: 0 })} kWh
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" gap={2}>
              <Typography variant="body2" color="text.secondary">
                {roiResults.scenarioBLabel}
              </Typography>
              <Typography variant="body2" fontWeight={700} className="mono">
                {formatNumber(roiResults.consumptionB, { maximumFractionDigits: 0 })} kWh
              </Typography>
            </Stack>
            {roiResults.reductionLabel ? (
              <Stack
                direction="row"
                justifyContent="space-between"
                gap={2}
                pt={1.5}
                borderTop="1px solid"
                borderColor="divider"
              >
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {roiResults.reductionLabel.title}
                </Typography>
                <Typography variant="body2" color="success.main" fontWeight={800} className="mono">
                  {formatNumber(roiResults.reductionLabel.value, { maximumFractionDigits: 0 })} kWh
                  {' '}(-{roiResults.reductionLabel.percent}%)
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={2}>
            Godišnja ušteda
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Energija (kWh)
              </Typography>
              <Typography variant="body2" fontWeight={700} color="success.main" className="mono">
                {formatNumber(roiResults.savingsKWh, { maximumFractionDigits: 0 })} kWh
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Novčana ušteda (€)
              </Typography>
              <Typography variant="body2" fontWeight={800} color="success.main" className="mono">
                {formatCurrency(roiResults.savingsEur)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Box>

      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        <SummaryTile
          title="Ukupna investicija"
          value={formatCurrency(roiResults.totalInvestment)}
          subtitle="svetiljke + instalacija"
        />
        <SummaryTile
          title="Povraćaj investicije"
          value={
            Number.isFinite(roiResults.roi)
              ? `${formatNumber(roiResults.roi, { maximumFractionDigits: 1 })}`
              : '—'
          }
          subtitle="godina"
          tone="success"
        />
        <SummaryTile
          title={roiResults.badge?.label ?? 'Procena povraćaja'}
          value={
            roiResults.badge
              ? `${formatNumber(roiResults.badge.value, { maximumFractionDigits: 1 })} god.`
              : '—'
          }
          subtitle={roiResults.badge?.description ?? 'Nije dostupno bez uštede'}
          tone={badgeTone}
        />
      </Box>

      {roiResults.highlight ? (
        <Alert severity={highlightAlert.severity} sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {highlightAlert.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {highlightAlert.description}
          </Typography>
        </Alert>
      ) : null}

      {roiResults.smartBenefit ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Pametna kontrola može dodatno povećati uštedu
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Očekivano smanjenje potrošnje je oko {roiResults.smartBenefit.potentialReduction}%,
            što donosi približno {formatCurrency(roiResults.smartBenefit.annualSavings)} godišnje.
            Procena ROI za smart sistem je {formatNumber(roiResults.smartBenefit.roi, {
              maximumFractionDigits: 1,
            })} godina.
          </Typography>
        </Alert>
      ) : null}

      <Paper
        sx={(theme) => ({
          mt: 3,
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
            theme.palette.secondary.main,
            0.08,
          )} 100%)`,
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
        })}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
          <SensorOccupiedRounded color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Kako povećati uštedu?
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          <Paper sx={{ p: 2.5, boxShadow: 'none' }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <DeviceHubRounded color="primary" fontSize="small" />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  DALI pametna kontrola
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Dimovanje i automatski senzori prisustva.
                </Typography>
                <Typography variant="caption" color="success.main" fontWeight={800} sx={{ mt: 1, display: 'block' }}>
                  25–40% manje potrošnje
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {lightingResults.showEfficiencyOption ? (
            <Paper sx={{ p: 2.5, boxShadow: 'none' }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <BoltRounded color="primary" fontSize="small" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Efikasnije svetiljke
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    Ciljajte 150+ lm/W umesto trenutnih{' '}
                    {formatNumber(lightingResults.efficiency, { maximumFractionDigits: 0 })} lm/W.
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight={800} sx={{ mt: 1, display: 'block' }}>
                    15–20% manje snage
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          ) : (
            <Paper sx={{ p: 2.5, boxShadow: 'none' }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <TipsAndUpdatesRounded color="primary" fontSize="small" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Efikasnost je već dobra
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    Trenutni odnos lumen/vat je u zdravom rasponu.
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight={800} sx={{ mt: 1, display: 'block' }}>
                    Fokus stavite na raspored i kontrolu
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          <Paper sx={{ p: 2.5, boxShadow: 'none' }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <InsightsRounded color="primary" fontSize="small" />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Optimizacija rasporeda
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Fotometrijski plan često spusti broj svetiljki bez gubitka kvaliteta.
                </Typography>
                <Typography variant="caption" color="success.main" fontWeight={800} sx={{ mt: 1, display: 'block' }}>
                  10–15% manje svetiljki
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Paper>
    </Paper>
  );
}
