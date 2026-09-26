import type { Achievement } from '@/types';

export interface AchievementViews {
  /** Весь каталог в его порядке */
  all: Achievement.View[];
  /** Только полученные, новые первыми */
  mine: Achievement.View[];
}

const isEarned = (
  view: Achievement.View
): view is Achievement.View & { earnedAt: number } => view.earnedAt !== null;

/** Каталог достижений с датами получения; полученные не из каталога отбрасываются */
export const achievementViews = (
  catalog: Achievement.Definition[],
  earned: Achievement.Earned[]
): AchievementViews => {
  const earnedAt = new Map(
    earned.map((item) => [item.achievementId, item.earnedAt])
  );
  const all = catalog.map((definition) => ({
    ...definition,
    earnedAt: earnedAt.get(definition.id) ?? null,
  }));
  const mine = all
    .filter(isEarned)
    .sort((left, right) => right.earnedAt - left.earnedAt);
  return { all, mine };
};
