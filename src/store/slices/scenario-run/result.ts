import { Attempt, Scenario } from '@/types';
import type { ScenarioRun } from '@/types';

export interface ResultContext {
  scenario: Pick<Scenario.Definition, 'passCriteria'> | null;
  meters: Record<Scenario.MeterId, number>;
  flags: Record<Scenario.FlagId, boolean>;
}

export type EndEvaluation = Pick<
  ScenarioRun.Ending,
  'status' | 'reason' | 'unmetCriteria'
>;

const VERDICT_WEIGHT: Record<Scenario.Verdict, number> = {
  [Scenario.Verdict.Best]: 1,
  [Scenario.Verdict.Ok]: 0.5,
  [Scenario.Verdict.Bad]: 0,
};

const findUnmet = (
  criteria: Scenario.PassCriteria,
  ctx: ResultContext
): Attempt.UnmetCriteria => ({
  meters: Object.entries(criteria.meters ?? {})
    .filter(([id, threshold]) => !(ctx.meters[id] >= threshold))
    .map(([id]) => id),
  flags: (criteria.flags ?? []).filter((flag) => !ctx.flags[flag]),
});

/** Таймаут и истощение шкалы уже разрешены редьюсерами до этого вызова */
export const evaluateEnd = (
  ctx: ResultContext,
  forced?: Attempt.Status
): EndEvaluation => {
  if (forced !== undefined) {
    return { status: forced, reason: Attempt.Reason.EndNode };
  }
  const criteria = ctx.scenario?.passCriteria;
  if (criteria !== undefined) {
    const unmetCriteria = findUnmet(criteria, ctx);
    if (unmetCriteria.meters.length > 0 || unmetCriteria.flags.length > 0) {
      return {
        status: Attempt.Status.Failed,
        reason: Attempt.Reason.Criteria,
        unmetCriteria,
      };
    }
  }
  return { status: Attempt.Status.Passed, reason: Attempt.Reason.Completed };
};

const reviewOf = (
  decision: Attempt.Decision,
  scenario: Pick<Scenario.Definition, 'nodes'>
): Scenario.Review | undefined => {
  const node: Scenario.Node | undefined = scenario.nodes[decision.nodeId];
  if (node?.type !== Scenario.NodeType.Choice) return undefined;
  return node.options.find((option) => option.id === decision.optionId)?.review;
};

export const computeScore = (
  log: Attempt.Decision[],
  scenario: Pick<Scenario.Definition, 'nodes'>
): number | null => {
  const weights = log.flatMap((decision) => {
    const review = reviewOf(decision, scenario);
    return review === undefined ? [] : [VERDICT_WEIGHT[review.verdict]];
  });
  if (weights.length === 0) return null;
  const sum = weights.reduce((total, weight) => total + weight, 0);
  return Math.round((sum / weights.length) * 100);
};
