/* Нейтральная светлая палитра приложения и игровая палитра сценария
   (docs/specs/scenario-engine/ui-visual.md). */
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
  ink: '#0E1224',
  paper: '#FFF9EE',
  accentRed: '#E5262D',
  accentNavy: '#14285A',
  meterTrack: '#D9DEEA',
  bubbleBg: '#FFFFFF',
  bubbleText: '#0E1224',
  onAccent: '#FFFFFF',
  onAccentMuted: '#E4E9F7',
  chipBg: '#EEF1FA',
  raysLight: 'rgba(255, 255, 255, 0.18)',
  halftone: 'rgba(255, 255, 255, 0.14)',
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

/* Внутри игровой зоны размеры в cqw: текст масштабируется вместе со сценой */
export const gameFontSizes = {
  hudTitle: '13px',
  hudLabel: '10px',
  hudValue: '14px',
  delta: '12px',
  timerHud: '17px',
  timerInline: '13px',
  buttonSm: '12px',
  buttonMd: '14px',
  buttonLg: '18px',
  text: 'clamp(14px, 1.3cqw, 22px)',
  name: 'clamp(11px, 0.9cqw, 15px)',
  choiceNumber: 'clamp(12px, 1cqw, 16px)',
  stamp: 'clamp(28px, 3.2cqw, 56px)',
  introKicker: '12px',
  introTitle: 'clamp(32px, 4.4vw, 72px)',
  introText: 'clamp(15px, 1.3vw, 20px)',
  chip: '13px',
  cardTitle: '17px',
  tag: '11px',
} as const;

export const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const fontFamilyDisplay = `'Unbounded', ${fontFamily}`;

export const radii = {
  base: '8px',
  card: '12px',
  bubble: '22px',
  bubbleCorner: '4px',
} as const;

export const borders = {
  ink: `3px solid ${colors.ink}`,
  inkThin: `2.5px solid ${colors.ink}`,
  stamp: `5px solid ${colors.accentRed}`,
  focus: `3px solid ${colors.accentRed}`,
} as const;

export const shadows = {
  navySm: `4px 4px 0 ${colors.accentNavy}`,
  navyMd: `5px 5px 0 ${colors.accentNavy}`,
  navyLg: `8px 8px 0 ${colors.accentNavy}`,
  redSm: `4px 4px 0 ${colors.accentRed}`,
  redMd: `6px 6px 0 ${colors.accentRed}`,
  inkLg: `8px 8px 0 ${colors.ink}`,
  // filter, а не box-shadow: тень повторяет облако вместе с именной плашкой
  redDrop: `drop-shadow(6px 6px 0 ${colors.accentRed})`,
} as const;

export const tilts = {
  sm: '1deg',
  md: '2deg',
  plate: '4deg',
  lg: '6deg',
  stamp: '7deg',
} as const;

export const filters = {
  dimmed: 'brightness(0.55) saturate(0.6)',
} as const;

export const offsets = {
  lift: 'translate(-2px, -2px)',
  press: 'translate(3px, 3px)',
  focus: '3px',
} as const;

export const zIndices = {
  backdrop: 1,
  slots: 2,
  bubble: 3,
  choices: 4,
  hud: 5,
  stamp: 6,
} as const;

/** Длительности анимаций, мс */
export const durations = {
  press: 80,
  pop: 150,
  meter: 400,
  delta: 1000,
  stamp: 250,
  pulse: 1000,
} as const;

/* Геометрия игрового экрана: зона 16:9 вписана в окно, внутри — cqw/cqh */
export const stage = {
  zoneWidth: 'min(100vw, calc(100dvh * 16 / 9))',
  zoneHeight: 'min(100dvh, calc(100vw * 9 / 16))',
  slotWidth: '24cqw',
  slotInset: '4cqw',
  bubbleOffset: '26cqw',
  bubbleTop: '22cqh',
  bubbleMaxWidth: '40cqw',
  captionTop: '12cqh',
  captionMaxWidth: '60cqw',
  choicesWidth: '50cqw',
  choicesBottom: '4cqh',
  hintInset: '3cqw',
  stampBottom: '23cqh',
  actionsBottom: '9cqh',
  hudInset: '16px',
  iconButton: '36px',
  iconSize: '18px',
  iconStroke: '2.5px',
  meterTrackWidth: '110px',
  meterTrackHeight: '12px',
  thresholdWidth: '3px',
  thresholdOverhang: '-6px',
  namePlateOffset: '-14px',
  namePlateDrop: '-16px',
  deltaTop: '-12px',
  deltaRight: '-8px',
  cardWidth: '340px',
  introPadding: '9vw',
  introTextWidth: '60%',
  choiceIndexSize: '1.9em',
  halftoneDot: '1.3px',
  halftoneFade: '1.7px',
  halftoneTile: '9px',
  stampTracking: '0.04em',
} as const;

export const theme = {
  colors,
  spacing,
  fontSizes,
  gameFontSizes,
  fontFamily,
  fontFamilyDisplay,
  radii,
  borders,
  shadows,
  tilts,
  filters,
  offsets,
  zIndices,
  durations,
  stage,
} as const;

export type AppTheme = typeof theme;
