import type { Scenario } from '@/types';
import { Validation } from '@/types';

import { has, index, issue, key } from './issue';
import {
  allConditions,
  allEffects,
  allOptions,
  characterUsages,
  nodesOf,
} from './walk';

import type { At } from './walk';

const checkCharacters = (
  scenario: Scenario.Definition,
  registries: Validation.Registries
): Validation.Issue[] => {
  const listed = new Set(scenario.characters);
  const unknown = (id: string, path: string): Validation.Issue[] =>
    has(registries.characters, id)
      ? []
      : [
          issue(
            Validation.Code.RefCharacter,
            path,
            `Персонажа «${id}» нет в реестре`
          ),
        ];
  const declared = scenario.characters.flatMap((id, position) =>
    unknown(id, index('characters', position))
  );
  const used = characterUsages(scenario).flatMap(({ value, path }) => [
    ...unknown(value, path),
    ...(listed.has(value)
      ? []
      : [
          issue(
            Validation.Code.RefCharacterNotListed,
            path,
            `Персонаж «${value}» не перечислен в characters`
          ),
        ]),
  ]);
  return [...declared, ...used];
};

const checkBackgrounds = (
  scenario: Scenario.Definition,
  registries: Validation.Registries
): Validation.Issue[] =>
  nodesOf(scenario).flatMap((node) => {
    const background = node.value.stage?.background;
    return background === undefined || has(registries.backgrounds, background)
      ? []
      : [
          issue(
            Validation.Code.RefBackground,
            key(key(node.path, 'stage'), 'background'),
            `Фона «${background}» нет в реестре`
          ),
        ];
  });

const checkTopics = (
  scenario: Scenario.Definition,
  registries: Validation.Registries
): Validation.Issue[] => {
  const declared = scenario.topics.map((value, position) => ({
    value,
    path: index('topics', position),
  }));
  const reviewed = allOptions(scenario).flatMap(({ value, path }) =>
    value.review?.topic === undefined
      ? []
      : [{ value: value.review.topic, path: key(path, 'review.topic') }]
  );
  return [...declared, ...reviewed]
    .filter(({ value }) => !has(registries.topics, value))
    .map(({ value, path }) =>
      issue(Validation.Code.RefTopic, path, `Темы «${value}» нет в реестре`)
    );
};

const meterUsages = (scenario: Scenario.Definition): At<Scenario.MeterId>[] => {
  const tagged = [...allEffects(scenario), ...allConditions(scenario)];
  const fromNodes = tagged.flatMap(({ value, path }) =>
    'meter' in value ? [{ value: value.meter, path: key(path, 'meter') }] : []
  );
  const recordKeys = (
    record: Record<Scenario.MeterId, unknown> | undefined,
    path: string
  ): At<Scenario.MeterId>[] =>
    Object.keys(record ?? {}).map((id) => ({ value: id, path: key(path, id) }));
  return [
    ...fromNodes,
    ...recordKeys(scenario.passCriteria?.meters, 'passCriteria.meters'),
    ...recordKeys(scenario.outcomes?.meterDepleted, 'outcomes.meterDepleted'),
  ];
};

const checkMeterRefs = (scenario: Scenario.Definition): Validation.Issue[] =>
  meterUsages(scenario)
    .filter(({ value }) => !has(scenario.meters, value))
    .map(({ value, path }) =>
      issue(Validation.Code.RefMeter, path, `Шкалы «${value}» нет в meters`)
    );

/** Ссылки на реестры и на шкалы сценария */
export const checkRefs = (
  scenario: Scenario.Definition,
  registries: Validation.Registries
): Validation.Issue[] => [
  ...checkCharacters(scenario, registries),
  ...checkBackgrounds(scenario, registries),
  ...checkTopics(scenario, registries),
  ...checkMeterRefs(scenario),
];
