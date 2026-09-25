/* Нейтральная светлая палитра: один акцент, серые фоны и текст.
   Заменяется палитрой продукта после решения о брендинге. */
export const colors = {
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  bgBase: '#FFFFFF',
  bgMuted: '#F3F4F6',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#4B5563',
  textTertiary: '#9CA3AF',
  success: '#16A34A',
  danger: '#DC2626',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const;

export const fontSizes = {
  sm: '12px',
  md: '15px',
  lg: '20px',
  xl: '28px',
} as const;

export const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const radii = {
  base: '8px',
  card: '12px',
} as const;

export const theme = {
  colors,
  spacing,
  fontSizes,
  fontFamily,
  radii,
} as const;

export type AppTheme = typeof theme;
