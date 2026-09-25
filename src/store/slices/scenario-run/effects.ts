import type { Scenario } from '@/types';

export interface EffectContext {
  scenario: Pick<Scenario.Definition, 'meters'> | null;
  meters: Record<Scenario.MeterId, number>;
  flags: Record<Scenario.FlagId, boolean>;
}

const DEFAULT_METER_MIN = 0;
const DEFAULT_METER_MAX = 100;

export const meterBounds = (
  definition: Scenario.Meter
): { min: number; max: number } => ({
  min: definition.min ?? DEFAULT_METER_MIN,
  max: definition.max ?? DEFAULT_METER_MAX,
});

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

// No `kind` discriminant on Effect: FlagEffect carries `flag`, MeterEffect carries `meter`
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
