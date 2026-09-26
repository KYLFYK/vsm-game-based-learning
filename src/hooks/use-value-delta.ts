import { useEffect, useRef, useState } from 'react';

export interface ValueDelta {
  amount: number;
  /** Растёт с каждым изменением, чтобы та же дельта перезапускала анимацию */
  key: number;
}

/** Разница с предыдущим значением; живёт `durationMs` после изменения. */
export const useValueDelta = (
  value: number,
  durationMs: number
): ValueDelta | null => {
  const previous = useRef(value);
  const [delta, setDelta] = useState<ValueDelta | null>(null);

  useEffect(() => {
    const amount = value - previous.current;
    previous.current = value;
    if (amount === 0) return undefined;

    setDelta((current) => ({ amount, key: (current?.key ?? 0) + 1 }));
    const id = setTimeout(() => setDelta(null), durationMs);
    return () => clearTimeout(id);
  }, [value, durationMs]);

  return delta;
};
