import { Character, Scenario } from '@/types';

import { index, key } from './issue';

/** Значение из сценария вместе с путём до него */
export interface At<T> {
  value: T;
  path: string;
}

export interface NodeAt extends At<Scenario.Node> {
  id: Scenario.NodeId;
}

export const nodesOf = (scenario: Scenario.Definition): NodeAt[] =>
  Object.entries(scenario.nodes).map(([id, value]) => ({
    id,
    value,
    path: key('nodes', id),
  }));

export const optionsOf = (node: NodeAt): At<Scenario.Option>[] =>
  node.value.type === Scenario.NodeType.Choice
    ? node.value.options.map((value, position) => ({
        value,
        path: index(key(node.path, 'options'), position),
      }))
    : [];

export const allOptions = (
  scenario: Scenario.Definition
): At<Scenario.Option>[] => nodesOf(scenario).flatMap(optionsOf);

/** Все `next` сценария: у `line` и у вариантов `choice` */
export const nextsOf = (node: NodeAt): At<Scenario.Next>[] =>
  node.value.type === Scenario.NodeType.Line
    ? [{ value: node.value.next, path: key(node.path, 'next') }]
    : optionsOf(node).map((option) => ({
        value: option.value.next,
        path: key(option.path, 'next'),
      }));

/** Идентификаторы узлов, на которые ссылается `next`, с путём до строки */
export const targetsOf = (next: At<Scenario.Next>): At<Scenario.NodeId>[] =>
  typeof next.value === 'string'
    ? [{ value: next.value, path: next.path }]
    : next.value.map((transition, position) => ({
        value: transition.to,
        path: key(index(next.path, position), 'to'),
      }));

export const exitsOf = (node: NodeAt): At<Scenario.NodeId>[] =>
  nextsOf(node).flatMap(targetsOf);

const conditionsAt = (
  owner: At<{ if?: Scenario.Condition | Scenario.Condition[] }>
): At<Scenario.Condition>[] => {
  const value = owner.value.if;
  const path = key(owner.path, 'if');
  if (value === undefined) return [];
  return Array.isArray(value)
    ? value.map((condition, position) => ({
        value: condition,
        path: index(path, position),
      }))
    : [{ value, path }];
};

/** Условия вариантов и переходов */
export const allConditions = (
  scenario: Scenario.Definition
): At<Scenario.Condition>[] => {
  const options = allOptions(scenario);
  const transitions = nodesOf(scenario)
    .flatMap(nextsOf)
    .flatMap((next) =>
      typeof next.value === 'string'
        ? []
        : next.value.map((value, position) => ({
            value,
            path: index(next.path, position),
          }))
    );
  return [...options, ...transitions].flatMap(conditionsAt);
};

export const allEffects = (
  scenario: Scenario.Definition
): At<Scenario.Effect>[] =>
  allOptions(scenario).flatMap((option) =>
    (option.value.effects ?? []).map((value, position) => ({
      value,
      path: index(key(option.path, 'effects'), position),
    }))
  );

/** Где персонаж появляется в сценарии: реплики, слоты сцены, `outcomes` */
export const characterUsages = (
  scenario: Scenario.Definition
): At<Character.Id>[] => {
  const usages: At<Character.Id>[] = [];
  nodesOf(scenario).forEach((node) => {
    usages.push({ value: node.value.speaker, path: key(node.path, 'speaker') });
    const stage = node.value.stage;
    const stagePath = key(node.path, 'stage');
    [Character.Side.Left, Character.Side.Right].forEach((side) => {
      const slot = stage?.[side];
      if (slot) {
        usages.push({
          value: slot.character,
          path: key(key(stagePath, side), 'character'),
        });
      }
    });
  });
  const { timeout, meterDepleted = {} } = scenario.outcomes ?? {};
  if (timeout) {
    usages.push({ value: timeout.speaker, path: 'outcomes.timeout.speaker' });
  }
  Object.entries(meterDepleted).forEach(([meterId, line]) =>
    usages.push({
      value: line.speaker,
      path: key(key('outcomes.meterDepleted', meterId), 'speaker'),
    })
  );
  return usages;
};
