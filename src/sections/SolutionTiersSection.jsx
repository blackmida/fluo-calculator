import {
  Battery1BarRounded,
  CheckCircleRounded,
  LayersRounded,
  StarRounded,
} from '@mui/icons-material';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { formatLumens, formatNumber } from '../utils/formatters';

const tierMeta = {
  Ekonomično: {
    icon: Battery1BarRounded,
    color: '#66758f',
    bg: '#f7f9fd',
    border: 'rgba(103, 117, 143, 0.22)',
  },
  Optimalno: {
    icon: CheckCircleRounded,
    color: '#0c4db3',
    bg: '#edf4ff',
    border: 'rgba(12, 77, 179, 0.28)',
  },
  Premium: {
    icon: StarRounded,
    color: '#15803d',
    bg: '#eefaf3',
    border: 'rgba(21, 128, 61, 0.24)',
  },
};

export default function SolutionTiersSection({ tiers }) {
  return (
    <Box>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
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
          <LayersRounded fontSize="small" />
        </Box>
        <Typography variant="h3">Nivoi rešenja</Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {tiers.map((tier) => {
          const meta = tierMeta[tier.name];
          const Icon = meta.icon;

          return (
            <Paper
              key={tier.name}
              sx={{
                p: 3,
                position: 'relative',
                bgcolor: meta.bg,
                border: '2px solid',
                borderColor: meta.border,
                boxShadow: tier.badge ? `0 0 0 4px ${alpha('#0c4db3', 0.08)}` : 'none',
              }}
            >
              {tier.badge ? (
                <Chip
                  label={tier.badge}
                  color="primary"
                  size="small"
                  sx={{ position: 'absolute', top: 14, right: 14 }}
                />
              ) : null}

              <Stack direction="row" spacing={1.25} alignItems="center" mb={3}>
                <Icon sx={{ color: meta.color }} fontSize="small" />
                <Typography variant="subtitle1" fontWeight={800}>
                  {tier.name}
                </Typography>
              </Stack>

              <Stack spacing={1.35}>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    Svetiljki
                  </Typography>
                  <Typography variant="body2" fontWeight={700} className="mono">
                    {formatNumber(tier.count, { maximumFractionDigits: 0 })}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    Lumeni/kom
                  </Typography>
                  <Typography variant="body2" fontWeight={700} className="mono">
                    {formatLumens(tier.lm)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    Snaga/kom
                  </Typography>
                  <Typography variant="body2" fontWeight={700} className="mono">
                    {formatNumber(tier.w, { maximumFractionDigits: 0 })} W
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography variant="body2" color="text.secondary">
                    Efikasnost
                  </Typography>
                  <Typography variant="body2" fontWeight={700} className="mono">
                    {formatNumber(tier.efficiency, { maximumFractionDigits: 0 })} lm/W
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  gap={2}
                  pt={1.5}
                  borderTop="1px solid"
                  borderColor="divider"
                >
                  <Typography variant="body2" color="text.secondary" fontWeight={700}>
                    Ukupna snaga
                  </Typography>
                  <Typography variant="body2" fontWeight={800} className="mono">
                    {formatNumber(tier.totalPower, { maximumFractionDigits: 0 })} W
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
