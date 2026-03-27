import { useRef, useState } from 'react';
import {
  ArchitectureRounded,
  CodeRounded,
  DownloadRounded,
  ExpandMoreRounded,
  LightbulbOutlined,
  MailOutlineRounded,
  WbIncandescentOutlined,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import {
  APP_TEXT,
  DEFAULT_LIGHTING_INPUTS,
  DEFAULT_NEW_INSTALLATION_INPUTS,
  DEFAULT_REPLACEMENT_INPUTS,
  DEVELOPER_REFERENCE,
  WHY_FLUO_STATS,
} from './constants/data';
import {
  calculateLighting,
  calculateRoi,
  getSpaceConfig,
} from './utils/calculations';
import ConfiguratorSection from './sections/ConfiguratorSection';
import GridSection from './sections/GridSection';
import RoiSection from './sections/RoiSection';
import SolutionTiersSection from './sections/SolutionTiersSection';

function RecommendationItem({ text, index }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={(theme) => ({
          width: 24,
          height: 24,
          mt: 0.25,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          fontWeight: 800,
          fontSize: 12,
        })}
      >
        {index + 1}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Stack>
  );
}

export default function App() {
  const [lightingInputs, setLightingInputs] = useState(DEFAULT_LIGHTING_INPUTS);
  const [roiMode, setRoiMode] = useState('replacement');
  const [replacementInputs, setReplacementInputs] = useState(DEFAULT_REPLACEMENT_INPUTS);
  const [newInstallationInputs, setNewInstallationInputs] = useState(
    DEFAULT_NEW_INSTALLATION_INPUTS,
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const appRef = useRef(null);

  const lightingResults = calculateLighting(lightingInputs);
  const roiResults = calculateRoi({
    mode: roiMode,
    replacementInputs,
    newInstallationInputs,
    lighting: lightingResults,
  });
  const activeSpace = getSpaceConfig(lightingInputs.space);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLightingFieldChange = (field, value) => {
    setLightingInputs((current) => ({ ...current, [field]: value }));
  };

  const handleSpaceChange = (spaceValue) => {
    const nextSpace = getSpaceConfig(spaceValue);
    setLightingInputs((current) => ({
      ...current,
      space: spaceValue,
      targetLux: nextSpace.lux,
    }));
  };

  const handleReplacementFieldChange = (field, value) => {
    setReplacementInputs((current) => ({ ...current, [field]: value }));
  };

  const handleNewInstallationFieldChange = (field, value) => {
    setNewInstallationInputs((current) => ({ ...current, [field]: value }));
  };

  const handlePdfExport = async () => {
    if (!appRef.current) {
      return;
    }

    showSnackbar('Generisanje PDF izveštaja...', 'info');

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(appRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = 0;

      while (heightLeft > 0) {
        pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight);
        heightLeft -= pageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
          position -= pageHeight;
        }
      }

      pdf.save('Fluoelektro_proracun_rasvete.pdf');
      showSnackbar('PDF je uspešno preuzet.', 'success');
    } catch (error) {
      showSnackbar('Greška pri generisanju PDF-a.', 'error');
    }
  };

  return (
    <>
      <Box ref={appRef}>
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ maxWidth: 1320, mx: 'auto', px: { xs: 2, md: 4 }, py: 2.5 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#ffffff',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: '0 14px 28px rgba(12, 77, 179, 0.22)',
                  })}
                >
                  <WbIncandescentOutlined />
                </Box>
                <Box>
                  <Typography variant="h1">{APP_TEXT.pageTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760, mt: 0.5 }}>
                    {APP_TEXT.subtitle}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{ letterSpacing: '0.08em' }}
              >
                {APP_TEXT.contactLine}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 1320, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
          <Stack spacing={3}>
            <ConfiguratorSection
              lightingInputs={lightingInputs}
              lightingResults={lightingResults}
              activeSpace={activeSpace}
              onLightingFieldChange={handleLightingFieldChange}
              onSpaceChange={handleSpaceChange}
            />

            <RoiSection
              roiMode={roiMode}
              onRoiModeChange={setRoiMode}
              replacementInputs={replacementInputs}
              newInstallationInputs={newInstallationInputs}
              onReplacementFieldChange={handleReplacementFieldChange}
              onNewInstallationFieldChange={handleNewInstallationFieldChange}
              roiResults={roiResults}
              lightingResults={lightingResults}
            />

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
                  <LightbulbOutlined fontSize="small" />
                </Box>
                <Typography variant="h3">Pametne preporuke</Typography>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                }}
              >
                {lightingResults.recommendations.map((recommendation, index) => (
                  <RecommendationItem key={recommendation} text={recommendation} index={index} />
                ))}
              </Box>
            </Paper>

            <Paper
              sx={(theme) => ({
                p: { xs: 3, md: 4 },
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${alpha(
                  theme.palette.secondary.main,
                  0.05,
                )} 100%)`,
              })}
            >
              <Typography variant="h3" mb={2.5}>
                Zašto Fluoelektro?
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
                }}
              >
                {WHY_FLUO_STATS.map((stat) => (
                  <Paper key={stat.label} sx={{ p: 2.5, boxShadow: 'none' }}>
                    <Typography variant="h2" color="primary.main" className="mono">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>

            <GridSection lightingResults={lightingResults} />

            <SolutionTiersSection tiers={lightingResults.tiers} />

            <Paper sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h3" mb={1.5}>
                Sledeći korak
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760 }}>
                Pošaljite upit i tim može dalje da razradi detaljniji svetlotehnički proračun,
                predlog opreme i investicioni scenario za konkretan objekat.
              </Typography>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} mt={3}>
                <Button
                  variant="contained"
                  startIcon={<MailOutlineRounded />}
                  onClick={() =>
                    showSnackbar(
                      'Dugme je spremno za povezivanje sa CRM formom ili lead endpointom.',
                      'info',
                    )
                  }
                >
                  Zatraži ponudu
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ArchitectureRounded />}
                  onClick={() =>
                    showSnackbar(
                      'Dugme je spremno za povezivanje sa formom za svetlotehnički proračun.',
                      'info',
                    )
                  }
                >
                  Pošalji za svetlotehnički proračun
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadRounded />}
                  onClick={handlePdfExport}
                >
                  Preuzmi PDF izveštaj
                </Button>
              </Stack>
            </Paper>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CodeRounded color="action" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Calculation Model — Developer Reference
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#09111f', color: '#9ef0be' }}>
                <Box
                  component="pre"
                  className="code-block"
                  sx={{
                    m: 0,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                    fontSize: 13,
                  }}
                >
                  {DEVELOPER_REFERENCE.join('\n')}
                </Box>
              </AccordionDetails>
            </Accordion>

            <Alert severity="info">
              <Typography variant="body2">{APP_TEXT.disclaimer}</Typography>
            </Alert>
          </Stack>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3200}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
