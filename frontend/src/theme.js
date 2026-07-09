import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
            secondary: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
            background: {
              default: '#0a0f1e',
              paper: '#111827',
            },
            text: {
              primary: '#f1f5f9',
              secondary: '#94a3b8',
            },
            divider: 'rgba(148, 163, 184, 0.12)',
            success: { main: '#10b981' },
            warning: { main: '#f59e0b' },
            error: { main: '#ef4444' },
            info: { main: '#3b82f6' },
          }
        : {
            primary: { main: '#4f46e5', light: '#6366f1', dark: '#3730a3' },
            secondary: { main: '#0891b2', light: '#06b6d4', dark: '#0e7490' },
            background: {
              default: '#f1f5f9',
              paper: '#ffffff',
            },
            text: {
              primary: '#1e293b',
              secondary: '#64748b',
            },
            divider: 'rgba(0, 0, 0, 0.08)',
            success: { main: '#059669' },
            warning: { main: '#d97706' },
            error: { main: '#dc2626' },
            info: { main: '#2563eb' },
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.9rem',
          },
          contained: {
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: '1px solid',
            borderColor: 'rgba(148, 163, 184, 0.1)',
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          },
        },
      },
    },
  });
