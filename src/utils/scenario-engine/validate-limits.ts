import { Scenario, Validation } from '@/types';

import { has, issue, key } from './issue';
import { meterBounds } from './meter-bounds';
import { nodesOf } from './walk';

const checkMeterRanges = (scenario: Scenario.Definition): Validation.Issue[] =>
  Object.entries(scenario.meters ?? {}).flatMap(([id, meter]) => {
    const { min, max } = meterBounds(meter);
    const path = key('meters', id);
    if (min >= max) {
      return [
        issue(
          Validation.Code.MeterRange,
          path,
          `min ${min} не меньше max ${max}`
        ),
      ];
    }
    const outside = (value: number): boolean => value < min || value > max;
    const issues: Validation.Issue[] = [];
    // initial <= min провалил бы проверку истощения шкалы на первом же ходу
    if (meter.initial <= min || meter.initial > max) {
      issues.push(
        issue(
          Validation.Code.MeterRange,
          key(path, 'initial'),
          `initial ${meter.initial} вне (${min}, ${max}]`
        )
      );
    }
    const threshold = scenario.passCriteria?.meters?.[id];
    if (threshold !== undefined && outside(threshold)) {
      issues.push(
        issue(
          Validation.Code.MeterRange,
          key('passCriteria.meters', id),
          `Порог ${threshold} вне [${min}, ${max}]`
        )
      );
    }
    return issues;
  });

const checkOutcomes = (scenario: Scenario.Definition): Validation.Issue[] => {
  const issues: Validation.Issue[] = [];
  const hasTimer =
    scenario.timeLimitSec !== undefined ||
    nodesOf(scenario).some(
      ({ value }) =>
        value.type === Scenario.NodeType.Choice &&
        value.timeLimitSec !== undefined
    );
  if (hasTimer && scenario.outcomes?.timeout === undefined) {
    issues.push(
      issue(
        Validation.Code.OutcomeTimeoutMissing,
        'outcomes.timeout',
        'Есть таймер, но нет outcomes.timeout'
      )
    );
  }
  Object.keys(scenario.meters ?? {})
    .filter((id) => !has(scenario.outcomes?.meterDepleted, id))
    .forEach((id) =>
      issues.push(
        issue(
          Validation.Code.OutcomeDepletedMissing,
          key('outcomes.meterDepleted', id),
          `Нет реплики истощения шкалы «${id}»`
        )
      )
    );
  return issues;
};

const checkNodeTimers = (scenario: Scenario.Definition): Validation.Issue[] => {
  const limit = scenario.timeLimitSec;
  if (limit === undefined) return [];
  return nodesOf(scenario).flatMap(({ value, path }) =>
    value.type === Scenario.NodeType.Choice &&
    value.timeLimitSec !== undefined &&
    value.timeLimitSec > limit
      ? [
          issue(
            Validation.Code.TimeNodeOverScenario,
            key(path, 'timeLimitSec'),
            `Таймер узла ${value.timeLimitSec} с больше таймера сценария ${limit} с`
          ),
        ]
      : []
  );
};

/** Диапазоны шкал, таймеры и обязательные для них `outcomes` */
export const checkLimits = (
  scenario: Scenario.Definition
): Validation.Issue[] => [
  ...checkMeterRanges(scenario),
  ...checkOutcomes(scenario),
  ...checkNodeTimers(scenario),
];
