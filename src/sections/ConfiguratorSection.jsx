import {
  AutoAwesomeRounded,
  StraightenRounded,
  TuneRounded,
  BoltRounded,
} from '@mui/icons-material';
import {
  Box,
  Chip,
  MenuItem,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import {
  BEAM_OPTIONS,
  MAINTENANCE_OPTIONS,
  REFLECTANCE_OPTIONS,
  SPACE_TYPES,
  USE_CASES,
} from '../constants/data';
import { formatLumens, formatLux, formatMeasurement, formatNumber } from '../utils/formatters';
import MetricRow from '../components/MetricRow';
import SectionCard from '../components/SectionCard';

function SliderField({ label, valueLabel, value, min, max, step, onChange }) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.25} gap={1}>
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        <Chip label={valueLabel} color="primary" variant="outlined" size="small" />
      </Stack>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_, nextValue) => onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)}
      />
    </Box>
  );
}

export default function ConfiguratorSection({
  lightingInputs,
  lightingResults,
  activeSpace,
  onLightingFieldChange,
  onSpaceChange,
}) {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1fr) minmax(0, 1fr) minmax(320px, 0.9fr)',
          },
        }}
      >
        <SectionCard icon={StraightenRounded} title="Dimenzije i prostor">
          <Stack spacing={2}>
            <TextField
              label="Dužina (m)"
              type="number"
              value={lightingInputs.length}
              onChange={(event) => onLightingFieldChange('length', event.target.value)}
              inputProps={{ min: 1, max: 500, step: 0.5 }}
            />
            <TextField
              label="Širina (m)"
              type="number"
              value={lightingInputs.width}
              onChange={(event) => onLightingFieldChange('width', event.target.value)}
              inputProps={{ min: 1, max: 500, step: 0.5 }}
            />
            <TextField
              label="Visina montaže (m)"
              type="number"
              value={lightingInputs.height}
              onChange={(event) => onLightingFieldChange('height', event.target.value)}
              inputProps={{ min: 1, max: 30, step: 0.5 }}
            />
            <TextField
              select
              label="Tip prostora"
              value={lightingInputs.space}
              onChange={(event) => onSpaceChange(event.target.value)}
            >
              {SPACE_TYPES.map((space) => (
                <MenuItem key={space.value} value={space.value}>
                  {space.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </SectionCard>

        <SectionCard icon={TuneRounded} title="Okruženje i cilj">
          <Stack spacing={2.5}>
            <TextField
              select
              label="Refleksivnost površine"
              value={lightingInputs.uf}
              onChange={(event) => onLightingFieldChange('uf', event.target.value)}
            >
              {REFLECTANCE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Faktor održavanja"
              value={lightingInputs.mf}
              onChange={(event) => onLightingFieldChange('mf', event.target.value)}
            >
              {MAINTENANCE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <SliderField
              label="Ciljna osvetljenost"
              valueLabel={formatLux(lightingResults.inputs.targetLux)}
              value={lightingResults.inputs.targetLux}
              min={50}
              max={1500}
              step={25}
              onChange={(value) => onLightingFieldChange('targetLux', value)}
            />

            <SliderField
              label="Lumeni po svetiljci"
              valueLabel={formatLumens(lightingResults.inputs.fixtureLm)}
              value={lightingResults.inputs.fixtureLm}
              min={1000}
              max={50000}
              step={50}
              onChange={(value) => onLightingFieldChange('fixtureLm', value)}
            />

            <SliderField
              label="Snaga svetiljke"
              valueLabel={`${formatNumber(lightingResults.inputs.fixtureW, {
                maximumFractionDigits: 0,
              })} W`}
              value={lightingResults.inputs.fixtureW}
              min={5}
              max={500}
              step={1}
              onChange={(value) => onLightingFieldChange('fixtureW', value)}
            />

            <TextField
              select
              label="Ugao isijavanja"
              value={lightingInputs.beamAngle}
              onChange={(event) => onLightingFieldChange('beamAngle', event.target.value)}
            >
              {BEAM_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </SectionCard>

        <Paper
          sx={(theme) => ({
            p: 3,
            height: '100%',
            color: '#ffffff',
            background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: '0 16px 40px rgba(12, 77, 179, 0.22)',
          })}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
            <Box
              sx={(theme) => ({
                width: 34,
                height: 34,
                borderRadius: 1,
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(theme.palette.common.white, 0.14),
              })}
            >
              <BoltRounded fontSize="small" />
            </Box>
            <Typography variant="subtitle2" fontWeight={700}>
              Rezultati proračuna
            </Typography>
          </Stack>

          <Box sx={{ mb: 2.5 }}>
            <MetricRow
              label="Površina"
              value={formatMeasurement(lightingResults.area, 'm²')}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Ciljna osvetljenost"
              value={formatLux(lightingResults.inputs.targetLux)}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Potrebni lumeni"
              value={formatLumens(lightingResults.requiredLumens)}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Dosegnuta osvetljenost"
              value={formatLux(lightingResults.estimatedLux)}
              divider={false}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
          </Box>

          <Typography variant="caption" sx={{ color: 'rgba(226, 238, 255, 0.84)', fontWeight: 700 }}>
            REZULTAT SISTEMA
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            <MetricRow
              label="Broj svetiljki"
              value={formatNumber(lightingResults.fixtureCount, { maximumFractionDigits: 0 })}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Lumeni / svetiljka"
              value={formatLumens(lightingResults.inputs.fixtureLm)}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Ukupan fluks"
              value={formatLumens(lightingResults.totalFlux)}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Ukupna snaga"
              value={`${formatNumber(lightingResults.totalPower, { maximumFractionDigits: 0 })} W`}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Specifična snaga"
              value={`${formatNumber(lightingResults.wPerM2, { maximumFractionDigits: 1 })} W/m²`}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Razmak svetiljki"
              value={formatMeasurement(lightingResults.spacing, 'm', { maximumFractionDigits: 2 })}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
            <MetricRow
              label="Ravnomernost osvetljenja"
              value={lightingResults.uniformity.label}
              labelColor="rgba(255,255,255,0.72)"
              valueColor={
                lightingResults.uniformity.tone === 'success'
                  ? '#8ef0b2'
                  : lightingResults.uniformity.tone === 'warning'
                    ? '#ffd970'
                    : '#ffb8a0'
              }
            />
            <MetricRow
              label="Preporučeni raspored"
              value={lightingResults.gridRatioLabel}
              divider={false}
              labelColor="rgba(255,255,255,0.72)"
              valueColor="#ffffff"
              mono
            />
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
          <Box
            sx={(theme) => ({
              width: 34,
              height: 34,
              borderRadius: 1,
              display: 'grid',
              placeItems: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            })}
          >
            <AutoAwesomeRounded fontSize="small" />
          </Box>
          <Typography variant="subtitle2" fontWeight={700}>
            Gde se može primeniti?
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {USE_CASES.map((useCase) => (
            <Chip
              key={useCase}
              label={useCase}
              color={useCase === activeSpace.useCase ? 'primary' : 'default'}
              variant={useCase === activeSpace.useCase ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      </Paper>
    </>
  );
}
