import { ptBR } from '@mui/material/locale'
import { createTheme } from '@mui/material/styles'

import { brand, neutral } from './tokens'

export const theme = createTheme(
  {
    cssVariables: true,
    palette: {
      primary: {
        main: brand.green,
        dark: brand.greenDark,
        light: brand.greenLight,
        contrastText: '#FFFFFF',
      },
      background: {
        default: neutral.canvas,
        paper: neutral.surface,
      },
      text: {
        primary: neutral.text,
        secondary: neutral.textMuted,
      },
      divider: neutral.border,
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: '"Inter Variable", system-ui, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiTextField: {
        defaultProps: { fullWidth: true },
      },
    },
  },
  ptBR,
)
