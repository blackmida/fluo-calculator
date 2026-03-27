import { GridViewRounded } from '@mui/icons-material';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import GridPreview from '../components/GridPreview';
import { formatMeters } from '../utils/formatters';

export default function GridSection({ lightingResults }) {
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
          <GridViewRounded fontSize="small" />
        </Box>
        <Typography variant="h3">Pregled rasporeda svetiljki</Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr 0.95fr' },
          alignItems: 'start',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            UKUPAN RASPORED
          </Typography>
          <GridPreview
            cols={lightingResults.cols}
            rows={lightingResults.rows}
            activeCount={lightingResults.fixtureCount}
            length={lightingResults.inputs.length}
            width={lightingResults.inputs.width}
          />
        </Stack>

        <Stack alignItems="center" justifyContent="center" spacing={3} sx={{ py: { lg: 3 } }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            RAZMAK SVETILJKI
          </Typography>
          <Box textAlign="center">
            <Typography variant="h1" className="mono" color="primary.main">
              {formatMeters(lightingResults.spacing)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              preporučeni razmak
            </Typography>
          </Box>
          <Paper sx={{ p: 2.5, width: '100%', maxWidth: 260, boxShadow: 'none' }}>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Horizontalno
                </Typography>
                <Typography variant="body2" fontWeight={700} className="mono">
                  {formatMeters(lightingResults.spacingX)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Vertikalno
                </Typography>
                <Typography variant="body2" fontWeight={700} className="mono">
                  {formatMeters(lightingResults.spacingY)}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>

        <Stack spacing={2.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={700} textAlign="center">
            RAZMAK IZMEĐU SVETILJKI
          </Typography>
          <Paper sx={{ p: 3, boxShadow: 'none' }}>
            <Stack spacing={4}>
              <Box textAlign="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Box sx={{ flex: 1, height: 2, bgcolor: 'rgba(12,77,179,0.24)', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', left: '50%', top: -4, width: 2, height: 10, bgcolor: 'primary.main' }} />
                    <Box sx={{ position: 'absolute', right: 0, top: -4, width: 2, height: 10, bgcolor: 'primary.main' }} />
                  </Box>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                </Box>
                <Typography variant="h2" className="mono" color="primary.main">
                  {formatMeters(lightingResults.spacingX)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Horizontalno
                </Typography>
              </Box>

              <Box textAlign="center">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    minHeight: 92,
                    mb: 2.5,
                  }}
                >
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  <Box sx={{ width: 2, flex: 1, bgcolor: 'rgba(12,77,179,0.24)', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: -4, width: 10, height: 2, bgcolor: 'primary.main' }} />
                    <Box sx={{ position: 'absolute', bottom: 0, left: -4, width: 10, height: 2, bgcolor: 'primary.main' }} />
                  </Box>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                </Box>
                <Typography variant="h2" className="mono" color="primary.main">
                  {formatMeters(lightingResults.spacingY)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vertikalno
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Razmak obezbeđuje ravnomerno osvetljenje i minimum senčenja.
          </Typography>
        </Stack>
      </Box>

      <Paper
        sx={(theme) => ({
          mt: 3,
          p: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
          boxShadow: 'none',
        })}
      >
        <Typography variant="body2" color="primary.dark">
          Fotometrijski raspored prati EN 12464-1 logiku i koristi razmak koji smanjuje senčenje i
          drži uniformnost u razumnom opsegu.
        </Typography>
      </Paper>
    </Paper>
  );
}
