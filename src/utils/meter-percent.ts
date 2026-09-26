export const meterPercent = (
  value: number,
  min: number,
  max: number
): number => {
  if (max <= min) return 0;
  const percent = ((value - min) / (max - min)) * 100;
  return Math.min(100, Math.max(0, percent));
};
