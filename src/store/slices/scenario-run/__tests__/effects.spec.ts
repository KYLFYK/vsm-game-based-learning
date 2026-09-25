import type { Scenario } from '@/types';

import { applyEffect, applyEffects } from '../effects';

import type { EffectContext } from '../effects';

const ctx = (
  meterDefs: Record<Scenario.MeterId, Scenario.Meter>,
  meters: Record<Scenario.MeterId, number>,
  flags: Record<Scenario.FlagId, boolean> = {}
): EffectContext => ({ scenario: { meters: meterDefs }, meters, flags });

describe(applyEffect.name, () => {
  test('clamps a meter at its default max of 100', () => {
    const state = ctx(
      { trust: { label: 'Trust', initial: 90 } },
      { trust: 90 }
    );
    applyEffect({ meter: 'trust', delta: 20 }, state);
    expect(state.meters.trust).toBe(100);
  });

  test('clamps a meter at its default min of 0', () => {
    const state = ctx(
      { trust: { label: 'Trust', initial: 10 } },
      { trust: 10 }
    );
    applyEffect({ meter: 'trust', delta: -50 }, state);
    expect(state.meters.trust).toBe(0);
  });

  test('clamps a meter at custom bounds', () => {
    const state = ctx(
      { trust: { label: 'Trust', initial: 5, min: -10, max: 10 } },
      { trust: 8 }
    );
    applyEffect({ meter: 'trust', delta: 20 }, state);
    expect(state.meters.trust).toBe(10);

    applyEffect({ meter: 'trust', delta: -100 }, state);
    expect(state.meters.trust).toBe(-10);
  });

  test('ignores a meter effect for a meter absent from scenario.meters', () => {
    const state = ctx({}, { trust: 50 });
    applyEffect({ meter: 'trust', delta: 20 }, state);
    expect(state.meters.trust).toBe(50);
  });

  test('sets a flag to true', () => {
    const state = ctx({}, {}, { seen: false });
    applyEffect({ flag: 'seen', value: true }, state);
    expect(state.flags.seen).toBe(true);
  });

  test('sets a flag to false', () => {
    const state = ctx({}, {}, { seen: true });
    applyEffect({ flag: 'seen', value: false }, state);
    expect(state.flags.seen).toBe(false);
  });
});

describe(applyEffects.name, () => {
  test('applies effects in order, so an intermediate clamp affects the result', () => {
    const state = ctx(
      { trust: { label: 'Trust', initial: 90 } },
      { trust: 90 }
    );
    // +20 clamps to 100 first, then -5 gives 95 — a raw sum (90+20-5=105)
    // clamped once at the end would incorrectly give 100.
    const effects: Scenario.Effect[] = [
      { meter: 'trust', delta: 20 },
      { meter: 'trust', delta: -5 },
    ];
    applyEffects(effects, state);
    expect(state.meters.trust).toBe(95);
  });

  test('applies a mix of meter and flag effects', () => {
    const state = ctx(
      { trust: { label: 'Trust', initial: 50 } },
      { trust: 50 },
      { seen: false }
    );
    const effects: Scenario.Effect[] = [
      { meter: 'trust', delta: 10 },
      { flag: 'seen', value: true },
    ];
    applyEffects(effects, state);
    expect(state.meters.trust).toBe(60);
    expect(state.flags.seen).toBe(true);
  });
});
