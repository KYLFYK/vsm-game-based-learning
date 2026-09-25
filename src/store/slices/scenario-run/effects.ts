import type { Scenario } from '@/types';
import { meterBounds } from '@/utils';

export interface EffectContext {
  scenario: Pick<Scenario.Definition, 'meters'> | null;
  meters: Record<Scenario.MeterId, number>;
  flags: Record<Scenario.FlagId, boolean>;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const applyMeterEffect = (
  effect: Scenario.MeterEffect,
  ctx: EffectContext
): void => {
  const definition = ctx.scenario?.meters?.[effect.meter];
  if (definition === undefined) return;
  const { min, max } = meterBounds(definition);
  ctx.meters[effect.meter] = clamp(
    ctx.meters[effect.meter] + effect.delta,
    min,
    max
  );
};

// У Effect нет дискриминанта `kind`: FlagEffect несёт `flag`, MeterEffect — `meter`
export const applyEffect = (
  effect: Scenario.Effect,
  ctx: EffectContext
): void => {
  if ('flag' in effect) {
    ctx.flags[effect.flag] = effect.value;
    return;
  }
  applyMeterEffect(effect, ctx);
};

export const applyEffects = (
  effects: Scenario.Effect[],
  ctx: EffectContext
): void => {
  effects.forEach((effect) => applyEffect(effect, ctx));
};
