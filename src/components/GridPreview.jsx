import { Box } from '@mui/material';

export default function GridPreview({ cols, rows, activeCount, length, width }) {
  const totalCount = cols * rows;
  const aspectRatio = Math.max(0.9, Math.min(length / Math.max(width, 0.1), 2.2));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 320,
        aspectRatio,
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        border: '2px solid rgba(20, 45, 98, 0.12)',
        background:
          'linear-gradient(180deg, rgba(12, 77, 179, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(12,77,179,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(12,77,179,0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {Array.from({ length: totalCount }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const xPct = ((col + 0.5) / cols) * 100;
        const yPct = ((row + 0.5) / rows) * 100;
        const active = index < activeCount;

        return (
          <Box
            key={`${row}-${col}`}
            sx={{
              position: 'absolute',
              left: `calc(${xPct}% - 5px)`,
              top: `calc(${yPct}% - 5px)`,
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: active ? 'primary.main' : 'rgba(103, 116, 142, 0.25)',
              boxShadow: active ? '0 0 0 4px rgba(12, 77, 179, 0.14)' : 'none',
            }}
          />
        );
      })}
    </Box>
  );
}
