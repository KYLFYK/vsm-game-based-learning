import { formatRemaining } from './format-remaining';

/** Лимит времени из секунд сценария в `мм:сс` */
export const formatTimeLimit = (seconds: number): string =>
  formatRemaining(seconds * 1000);
