import type { Scenario } from '@/types';

export interface ConditionContext {
  meters: Record<Scenario.MeterId, number>;
  flags: Record<Scenario.FlagId, boolean>;
}

const flagHolds = (
  condition: Scenario.FlagCondition,
  ctx: ConditionContext
): boolean => (ctx.flags[condition.flag] ?? false) === (condition.is ?? true);

const meterHolds = (
  condition: Scenario.MeterCondition,
  ctx: ConditionContext
): boolean => {
  const value = ctx.meters[condition.meter];
  return (
    (condition.gte === undefined || value >= condition.gte) &&
    (condition.gt === undefined || value > condition.gt) &&
    (condition.lte === undefined || value <= condition.lte) &&
    (condition.lt === undefined || value < condition.lt)
  );
};

// No `kind` discriminant on Condition: FlagCondition carries `flag`, MeterCondition carries `meter`
const holdsOne = (
  condition: Scenario.Condition,
  ctx: ConditionContext
): boolean =>
  'flag' in condition ? flagHolds(condition, ctx) : meterHolds(condition, ctx);

export const holds = (
  condition: Scenario.Condition | Scenario.Condition[] | undefined,
  ctx: ConditionContext
): boolean => {
  if (condition === undefined) return true;
  const conditions = Array.isArray(condition) ? condition : [condition];
  return conditions.every((item) => holdsOne(item, ctx));
};

export const resolveNext = (
  next: Scenario.Next,
  ctx: ConditionContext
): Scenario.NodeId => {
  if (typeof next === 'string') return next;
  // The validator guarantees the last transition has no `if`, so it is a safe fallback
  const matched =
    next.find((transition) => holds(transition.if, ctx)) ??
    next[next.length - 1];
  return matched.to;
};
