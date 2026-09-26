const pad = (value: number): string => String(value).padStart(2, '0');

/** Остаток времени `мм:сс`; секунды вверх, чтобы `00:00` значило «время вышло». */
export const formatRemaining = (ms: number): string => {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  return `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;
};
