import type { Scenario } from '@/types';

export interface MeterThreshold {
  id: Scenario.MeterId;
  label: string;
  value: number;
}

/** Пороги зачёта шкал с подписями — для заставки. */
export const meterThresholds = ({
  meters,
  passCriteria,
}: Pick<Scenario.Definition, 'meters' | 'passCriteria'>): MeterThreshold[] =>
  Object.entries(passCriteria?.meters ?? {}).flatMap(([id, value]) => {
    const meter = meters?.[id];
    return meter === undefined ? [] : [{ id, label: meter.label, value }];
  });
