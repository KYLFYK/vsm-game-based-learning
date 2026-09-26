import type { Achievement } from '@/types';

/** Заглушка полученных достижений до появления API: начисления пока нет */
export const EARNED_ACHIEVEMENTS_MOCK: Achievement.Earned[] = [
  {
    achievementId: 'first-trip',
    earnedAt: new Date(2026, 8, 2, 10, 15).getTime(),
  },
  {
    achievementId: 'persistence',
    earnedAt: new Date(2026, 8, 9, 18, 40).getTime(),
  },
  {
    achievementId: 'calm-voice',
    earnedAt: new Date(2026, 8, 21, 14, 5).getTime(),
  },
];
