import { lightColors } from './colors';

export const theme = {
  colors: lightColors, // This will be overridden by theme store
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    fontWeights: {
      normal: '400' as '400',
      medium: '500' as '500',
      semibold: '600' as '600',
      bold: '700' as '700',
    },
  },
};