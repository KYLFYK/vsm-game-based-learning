import type { Scenario } from '@/types';

export const DEFAULT_METER_MIN = 0;
export const DEFAULT_METER_MAX = 100;

export const meterBounds = (
  definition: Scenario.Meter
): { min: number; max: number } => ({
  min: definition.min ?? DEFAULT_METER_MIN,
  max: definition.max ?? DEFAULT_METER_MAX,
});
