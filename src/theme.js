import { alpha, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0c4db3',
      dark: '#08378a',
      light: '#dce9ff',
    },
    secondary: {
      main: '#1f76d2',
      dark: '#105ba8',
      light: '#dcedff',
    },
    success: {
      main: '#15803d',
      dark: '#166534',
      light: '#e9f8ef',
    },
    warning: {
      main: '#c77a00',
      dark: '#9a5d00',
      light: '#fff5e4',
    },
    error: {
      main: '#c2410c',
      dark: '#9a3412',
      light: '#fff0eb',
    },
    background: {
      default: '#f5f8fd',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#66758f',
    },
    divider: 'rgba(20, 45, 98, 0.1)',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    h1: {
      fontSize: '1.9rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '1.2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    body2: {
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(20, 45, 98, 0.08)',
          boxShadow: '0 14px 40px rgba(12, 38, 84, 0.06)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          paddingInline: 18,
          paddingBlock: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& fieldset': {
            borderColor: 'rgba(20, 45, 98, 0.14)',
          },
          '&:hover fieldset': {
            borderColor: alpha('#0c4db3', 0.45),
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#0c4db3',
          paddingBlock: 12,
        },
        thumb: {
          width: 16,
          height: 16,
          boxShadow: '0 0 0 4px rgba(12, 77, 179, 0.14)',
        },
        rail: {
          opacity: 1,
          backgroundColor: '#d2d9e7',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          border: '1px solid rgba(20, 45, 98, 0.1)',
          boxShadow: '0 14px 40px rgba(12, 38, 84, 0.05)',
          '&:before': {
            display: 'none',
          },
        },
      },
    },
  },
});

export default theme;
