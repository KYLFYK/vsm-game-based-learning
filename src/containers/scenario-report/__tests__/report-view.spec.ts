import { Attempt } from '@/types';

import { isRetryPrimary, meterEffectLabels, speakerName } from '../report-view';

jest.mock('@/constants/characters', () => ({
  CHARACTERS: {
    author: { id: 'author', name: 'Автор', role: 'author' },
    anna: { id: 'anna', name: 'Анна', role: 'mentor' },
  },
}));

describe(isRetryPrimary.name, () => {
  test('failed attempt puts retry first', () => {
    expect(isRetryPrimary(Attempt.Status.Failed, 100)).toBe(true);
  });

  test('passed attempt below full score puts retry first', () => {
    expect(isRetryPrimary(Attempt.Status.Passed, 99)).toBe(true);
  });

  test('passed attempt with full or no score does not', () => {
    expect(isRetryPrimary(Attempt.Status.Passed, 100)).toBe(false);
    expect(isRetryPrimary(Attempt.Status.Passed, null)).toBe(false);
  });
});

describe(meterEffectLabels.name, () => {
  const labels = { trust: 'Доверие' };

  test('labels meter deltas with a sign and skips flags', () => {
    expect(
      meterEffectLabels(
        [
          { meter: 'trust', delta: 10 },
          { flag: 'helped', value: true },
          { meter: 'trust', delta: -5 },
        ],
        labels
      )
    ).toEqual(['Доверие +10', 'Доверие −5']);
  });

  test('falls back to the meter id without a label', () => {
    expect(meterEffectLabels([{ meter: 'ghost', delta: 1 }], labels)).toEqual([
      'ghost +1',
    ]);
  });
});

describe(speakerName.name, () => {
  test('names a character by the registry', () => {
    expect(speakerName('anna')).toBe('Анна');
  });

  test('the author is not named: the question is the narration itself', () => {
    expect(speakerName('author')).toBeNull();
  });

  test('falls back to the id for an unknown character', () => {
    expect(speakerName('ghost')).toBe('ghost');
  });
});
