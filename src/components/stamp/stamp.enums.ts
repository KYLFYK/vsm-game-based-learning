import { Attempt } from '@/types';

export const STAMP_LABELS: Record<Attempt.Status, string> = {
  [Attempt.Status.Passed]: 'Зачтено',
  [Attempt.Status.Failed]: 'Не зачтено',
};
