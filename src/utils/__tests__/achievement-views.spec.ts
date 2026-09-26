import type { Achievement } from '@/types';

import { achievementViews } from '../achievement-views';

const definition = (id: string): Achievement.Definition => ({
  id,
  title: id.toUpperCase(),
  description: `Описание ${id}`,
  howTo: `Условие ${id}`,
  image: `/${id}.svg`,
});

const catalog = ['a', 'b', 'c'].map(definition);

describe(achievementViews.name, () => {
  test('keeps catalog order and attaches earned dates', () => {
    const { all } = achievementViews(catalog, [
      { achievementId: 'c', earnedAt: 200 },
      { achievementId: 'a', earnedAt: 100 },
    ]);

    expect(all).toMatchSnapshot();
  });

  test('lists only earned achievements, newest first', () => {
    const { mine } = achievementViews(catalog, [
      { achievementId: 'a', earnedAt: 100 },
      { achievementId: 'c', earnedAt: 300 },
    ]);

    expect(mine.map(({ id }) => id)).toEqual(['c', 'a']);
  });

  test('ignores earned achievements missing from the catalog', () => {
    const { all, mine } = achievementViews(catalog, [
      { achievementId: 'ghost', earnedAt: 100 },
    ]);

    expect(all.every(({ earnedAt }) => earnedAt === null)).toBe(true);
    expect(mine).toEqual([]);
  });

  test('returns empty lists for an empty catalog', () => {
    expect(achievementViews([], [])).toEqual({ all: [], mine: [] });
  });
});
