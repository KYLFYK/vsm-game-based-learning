import { Scenario, Validation } from '@/types';

import { index, issue, key } from './issue';
import {
  allConditions,
  allEffects,
  allOptions,
  nextsOf,
  nodesOf,
  targetsOf,
} from './walk';

import type { At } from './walk';

const checkBest = (scenario: Scenario.Definition): Validation.Issue[] =>
  nodesOf(scenario).flatMap(({ value, path }) =>
    value.type === Scenario.NodeType.Choice &&
    value.options.filter(
      (option) => option.review?.verdict === Scenario.Verdict.Best
    ).length !== 1
      ? [
          issue(
            Validation.Code.ReviewNoBest,
            key(path, 'options'),
            'Нет ровно одного варианта с verdict best'
          ),
        ]
      : []
  );

const checkOptions = (scenario: Scenario.Definition): Validation.Issue[] => {
  const declared = new Set(scenario.topics);
  return allOptions(scenario).flatMap(({ value, path }) => {
    const { review, effects = [] } = value;
    if (review === undefined) {
      return effects.some((effect) => 'meter' in effect)
        ? [
            issue(
              Validation.Code.OptionNoReviewWithEffects,
              path,
              'Вариант меняет шкалы, но не имеет review'
            ),
          ]
        : [];
    }
    const reviewPath = key(path, 'review');
    if (review.topic === undefined) {
      return [
        issue(Validation.Code.ReviewNoTopic, reviewPath, 'review без topic'),
      ];
    }
    return declared.has(review.topic)
      ? []
      : [
          issue(
            Validation.Code.ReviewTopicNotDeclared,
            key(reviewPath, 'topic'),
            `Тема «${review.topic}» не входит в topics сценария`
          ),
        ];
  });
};

/** Первое упоминание каждого флага в порядке обхода */
const firstByFlag = (
  sites: At<Scenario.FlagId>[]
): Map<Scenario.FlagId, string> => {
  const first = new Map<Scenario.FlagId, string>();
  sites.forEach(({ value, path }) => {
    if (!first.has(value)) first.set(value, path);
  });
  return first;
};

const flagsIn = (
  sites: At<Scenario.Condition | Scenario.Effect>[]
): At<Scenario.FlagId>[] =>
  sites.flatMap(({ value, path }) =>
    'flag' in value ? [{ value: value.flag, path: key(path, 'flag') }] : []
  );

const checkFlags = (scenario: Scenario.Definition): Validation.Issue[] => {
  const read = firstByFlag([
    ...flagsIn(allConditions(scenario)),
    ...(scenario.passCriteria?.flags ?? []).map((value, position) => ({
      value,
      path: index('passCriteria.flags', position),
    })),
  ]);
  const set = firstByFlag(flagsIn(allEffects(scenario)));
  const neverSet = [...read]
    .filter(([flag]) => !set.has(flag))
    .map(([flag, path]) =>
      issue(
        Validation.Code.FlagNeverSet,
        path,
        `Флаг «${flag}» не устанавливается ни одним effects`
      )
    );
  const neverRead = [...set]
    .filter(([flag]) => !read.has(flag))
    .map(([flag, path]) =>
      issue(
        Validation.Code.FlagNeverRead,
        path,
        `Флаг «${flag}» устанавливается, но нигде не читается`
      )
    );
  return [...neverSet, ...neverRead];
};

const checkSelfLoops = (scenario: Scenario.Definition): Validation.Issue[] =>
  nodesOf(scenario)
    .filter(({ value }) => value.type === Scenario.NodeType.Line)
    .flatMap((node) =>
      nextsOf(node)
        .flatMap(targetsOf)
        .filter(({ value }) => value === node.id)
        .map(({ path }) =>
          issue(
            Validation.Code.GraphSelfLoopWithoutChoice,
            path,
            `Реплика «${node.id}» ведёт сама в себя`
          )
        )
    );

/** Предупреждения: не влияют на `ok` */
export const collectWarnings = (
  scenario: Scenario.Definition
): Validation.Issue[] => [
  ...checkBest(scenario),
  ...checkOptions(scenario),
  ...checkFlags(scenario),
  ...checkSelfLoops(scenario),
];
