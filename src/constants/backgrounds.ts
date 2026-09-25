import type { Scenario } from '@/types';

/** Фоны сцены сценария; `asset` — путь к SVG-заглушке в `public/backgrounds/` */
export const BACKGROUNDS: Record<
  Scenario.BackgroundId,
  { label: string; asset: string }
> = {
  'car-interior-day': {
    label: 'Салон вагона днём',
    asset: '/backgrounds/car-interior-day.svg',
  },
  'car-interior-smoke': {
    label: 'Салон вагона в дыму',
    asset: '/backgrounds/car-interior-smoke.svg',
  },
  vestibule: {
    label: 'Тамбур',
    asset: '/backgrounds/vestibule.svg',
  },
  platform: {
    label: 'Платформа',
    asset: '/backgrounds/platform.svg',
  },
};
