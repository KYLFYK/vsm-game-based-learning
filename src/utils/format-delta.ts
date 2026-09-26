const MINUS = '−';

export const formatDelta = (amount: number): string => {
  if (amount > 0) return `+${amount}`;
  if (amount < 0) return `${MINUS}${Math.abs(amount)}`;
  return '0';
};
