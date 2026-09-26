import { Scenario, Validation } from '@/types';

import { has, index, issue, key } from './issue';
import { exitsOf, nextsOf, nodesOf, optionsOf } from './walk';

import type { NodeAt } from './walk';

/** UI отображает варианты клавишами 1–4 (см. ui.md), больше показать нечем */
export const MAX_CHOICE_OPTIONS = 4;

const checkTransitions = (node: NodeAt): Validation.Issue[] =>
  nextsOf(node).flatMap((next) => {
    if (typeof next.value === 'string') return [];
    const last = next.value.at(-1);
    if (last === undefined) {
      return [
        issue(
          Validation.Code.GraphNoFallback,
          next.path,
          'Пустой список переходов'
        ),
      ];
    }
    return last.if === undefined
      ? []
      : [
          issue(
            Validation.Code.GraphNoFallback,
            index(next.path, next.value.length - 1),
            'Последний переход должен быть без if'
          ),
        ];
  });

const checkOptions = (node: NodeAt): Validation.Issue[] => {
  if (node.value.type !== Scenario.NodeType.Choice) return [];
  const issues: Validation.Issue[] = [];
  if (node.value.options.length < 2) {
    issues.push(
      issue(
        Validation.Code.GraphTooFewOptions,
        key(node.path, 'options'),
        'У выбора меньше двух вариантов'
      )
    );
  }
  if (node.value.options.length > MAX_CHOICE_OPTIONS) {
    issues.push(
      issue(
        Validation.Code.GraphTooManyOptions,
        key(node.path, 'options'),
        `У выбора больше ${MAX_CHOICE_OPTIONS} вариантов`
      )
    );
  }
  const seen = new Set<Scenario.OptionId>();
  optionsOf(node).forEach(({ value, path }) => {
    if (seen.has(value.id)) {
      issues.push(
        issue(
          Validation.Code.GraphDuplicateOptionId,
          key(path, 'id'),
          `Повтор id варианта «${value.id}»`
        )
      );
    }
    seen.add(value.id);
  });
  return issues;
};

const reachableFrom = (
  scenario: Scenario.Definition,
  startNodeId: Scenario.NodeId
): Set<Scenario.NodeId> => {
  const byId = new Map(nodesOf(scenario).map((node) => [node.id, node]));
  const reached = new Set<Scenario.NodeId>([startNodeId]);
  const queue = [startNodeId];
  for (let id = queue.shift(); id !== undefined; id = queue.shift()) {
    const node = byId.get(id);
    if (node === undefined) continue;
    exitsOf(node)
      .filter(({ value }) => has(scenario.nodes, value) && !reached.has(value))
      .forEach(({ value }) => {
        reached.add(value);
        queue.push(value);
      });
  }
  return reached;
};

const checkReachability = (
  scenario: Scenario.Definition
): Validation.Issue[] => {
  const reached = reachableFrom(scenario, scenario.startNodeId);
  const nodes = nodesOf(scenario);
  const issues = nodes
    .filter((node) => !reached.has(node.id))
    .map((node) =>
      issue(
        Validation.Code.GraphUnreachable,
        node.path,
        `Узел «${node.id}» недостижим из startNodeId`
      )
    );
  const endReached = nodes.some(
    (node) => reached.has(node.id) && node.value.type === Scenario.NodeType.End
  );
  if (!endReached) {
    issues.push(
      issue(
        Validation.Code.GraphNoEnd,
        'startNodeId',
        'Из startNodeId не достижим ни один узел end'
      )
    );
  }
  return issues;
};

/** Граф узлов: старт, ссылки, переходы, варианты, достижимость */
export const checkGraph = (
  scenario: Scenario.Definition
): Validation.Issue[] => {
  const nodes = nodesOf(scenario);
  // Без узлов остальные проверки графа повторяют одну и ту же причину
  if (nodes.length === 0) {
    return [
      issue(Validation.Code.GraphEmptyNodes, 'nodes', 'Нет ни одного узла'),
    ];
  }
  const dangling = nodes.flatMap((node) =>
    exitsOf(node)
      .filter(({ value }) => !has(scenario.nodes, value))
      .map(({ value, path }) =>
        issue(
          Validation.Code.GraphDanglingRef,
          path,
          `Ссылка на несуществующий узел «${value}»`
        )
      )
  );
  const structure = nodes.flatMap((node) => [
    ...checkTransitions(node),
    ...checkOptions(node),
  ]);
  const start = has(scenario.nodes, scenario.startNodeId)
    ? checkReachability(scenario)
    : [
        issue(
          Validation.Code.GraphStartMissing,
          'startNodeId',
          `Узла «${scenario.startNodeId}» нет в nodes`
        ),
      ];
  return [...start, ...dangling, ...structure];
};
