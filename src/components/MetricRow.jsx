import { Box, Typography } from '@mui/material';

export default function MetricRow({
  label,
  value,
  divider = true,
  labelColor = 'text.secondary',
  valueColor = 'text.primary',
  mono = false,
  valueFontWeight = 700,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        py: 1.35,
        borderBottom: divider ? '1px solid' : 'none',
        borderColor: 'divider',
      }}
    >
      <Typography variant="body2" color={labelColor}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        color={valueColor}
        fontWeight={valueFontWeight}
        className={mono ? 'mono' : undefined}
        textAlign="right"
      >
        {value}
      </Typography>
    </Box>
  );
}

