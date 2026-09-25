import type { Scenario } from '@/types';

import { holds, resolveNext } from '../conditions';

import type { ConditionContext } from '../conditions';

const ctx = (
  meters: Record<Scenario.MeterId, number> = {},
  flags: Record<Scenario.FlagId, boolean> = {}
): ConditionContext => ({ meters, flags });

describe(holds.name, () => {
  test('undefined condition holds', () => {
    expect(holds(undefined, ctx())).toBe(true);
  });

  test('empty condition list holds', () => {
    expect(holds([], ctx())).toBe(true);
  });

  describe('flag condition', () => {
    test('missing flag is treated as false', () => {
      expect(holds({ flag: 'seen' }, ctx())).toBe(false);
    });

    test('is defaults to true', () => {
      expect(holds({ flag: 'seen' }, ctx({}, { seen: true }))).toBe(true);
    });

    test('is: false matches a false flag', () => {
      expect(holds({ flag: 'seen', is: false }, ctx({}, { seen: false }))).toBe(
        true
      );
    });

    test('is: false matches a missing flag', () => {
      expect(holds({ flag: 'seen', is: false }, ctx())).toBe(true);
    });

    test('is: false fails a true flag', () => {
      expect(holds({ flag: 'seen', is: false }, ctx({}, { seen: true }))).toBe(
        false
      );
    });
  });

  describe('meter condition', () => {
    test('gte holds at the boundary value', () => {
      expect(holds({ meter: 'trust', gte: 50 }, ctx({ trust: 50 }))).toBe(true);
      expect(holds({ meter: 'trust', gte: 51 }, ctx({ trust: 50 }))).toBe(
        false
      );
    });

    test('gt fails at the boundary value', () => {
      expect(holds({ meter: 'trust', gt: 50 }, ctx({ trust: 50 }))).toBe(false);
      expect(holds({ meter: 'trust', gt: 49 }, ctx({ trust: 50 }))).toBe(true);
    });

    test('lte holds at the boundary value', () => {
      expect(holds({ meter: 'trust', lte: 50 }, ctx({ trust: 50 }))).toBe(true);
      expect(holds({ meter: 'trust', lte: 49 }, ctx({ trust: 50 }))).toBe(
        false
      );
    });

    test('lt fails at the boundary value', () => {
      expect(holds({ meter: 'trust', lt: 50 }, ctx({ trust: 50 }))).toBe(false);
      expect(holds({ meter: 'trust', lt: 51 }, ctx({ trust: 50 }))).toBe(true);
    });

    test('several comparisons combine into a range', () => {
      const range: Scenario.MeterCondition = {
        meter: 'trust',
        gte: 10,
        lte: 90,
      };
      expect(holds(range, ctx({ trust: 50 }))).toBe(true);
      expect(holds(range, ctx({ trust: 5 }))).toBe(false);
      expect(holds(range, ctx({ trust: 95 }))).toBe(false);
    });
  });

  describe('list of conditions', () => {
    test('one false condition makes the whole list false', () => {
      const list: Scenario.Condition[] = [
        { flag: 'seen', is: true },
        { meter: 'trust', gte: 100 },
      ];
      expect(holds(list, ctx({ trust: 50 }, { seen: true }))).toBe(false);
    });

    test('all-true conditions hold', () => {
      const list: Scenario.Condition[] = [
        { flag: 'seen', is: true },
        { meter: 'trust', gte: 10 },
      ];
      expect(holds(list, ctx({ trust: 50 }, { seen: true }))).toBe(true);
    });
  });
});

describe(resolveNext.name, () => {
  test('a string next resolves to itself', () => {
    expect(resolveNext('next-node', ctx())).toBe('next-node');
  });

  test('the first matching transition wins over later matches', () => {
    const next: Scenario.Transition[] = [
      { if: { flag: 'seen' }, to: 'first' },
      { if: { flag: 'seen' }, to: 'second' },
      { to: 'fallback' },
    ];
    expect(resolveNext(next, ctx({}, { seen: true }))).toBe('first');
  });

  test('falls back to the last transition when none match', () => {
    const next: Scenario.Transition[] = [
      { if: { flag: 'seen' }, to: 'first' },
      { to: 'fallback' },
    ];
    expect(resolveNext(next, ctx())).toBe('fallback');
  });

  test('conditions are evaluated against the passed state', () => {
    const next: Scenario.Transition[] = [
      { if: { meter: 'trust', gte: 50 }, to: 'high-trust' },
      { to: 'low-trust' },
    ];
    expect(resolveNext(next, ctx({ trust: 60 }))).toBe('high-trust');
    expect(resolveNext(next, ctx({ trust: 10 }))).toBe('low-trust');
  });
});
