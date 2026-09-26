import { Attempt, Character, Scenario } from '@/types';
import type { Validation } from '@/types';

import { validateScenario } from '../validate';

const character = (id: string, role: Character.Role): Character.Definition => ({
  id,
  name: id,
  role,
  description: id,
});

export const registries: Validation.Registries = {
  characters: {
    author: character('author', Character.Role.Author),
    anna: character('anna', Character.Role.Mentor),
    oleg: character('oleg', Character.Role.Passenger),
  },
  backgrounds: { hall: { label: 'Зал', asset: '/hall.svg' } },
  topics: { calm: { label: 'Спокойствие' }, safety: { label: 'Безопасность' } },
};

/** Корректный сценарий без ошибок и предупреждений; каждый вызов — новый объект */
export const createScenario = (): Scenario.Definition => ({
  id: 'test',
  version: 1,
  title: 'Тест',
  description: 'Тестовый сценарий',
  topics: ['calm'],
  estimatedMinutes: 5,
  timeLimitSec: 300,
  characters: ['author', 'anna'],
  meters: { trust: { label: 'Доверие', initial: 50 } },
  passCriteria: { meters: { trust: 40 }, flags: ['helped'] },
  outcomes: {
    timeout: { speaker: 'anna', text: 'Время вышло' },
    meterDepleted: { trust: { speaker: 'anna', text: 'Доверие потеряно' } },
  },
  startNodeId: 'intro',
  nodes: {
    intro: {
      type: Scenario.NodeType.Line,
      speaker: 'author',
      text: 'Начало',
      stage: {
        background: 'hall',
        left: { character: 'anna', mood: Character.Mood.Neutral },
        right: null,
      },
      next: 'q1',
    },
    q1: {
      type: Scenario.NodeType.Choice,
      speaker: 'anna',
      text: 'Что делать?',
      timeLimitSec: 30,
      options: [
        {
          id: 'good',
          text: 'Помочь',
          effects: [
            { meter: 'trust', delta: 10 },
            { flag: 'helped', value: true },
          ],
          review: {
            verdict: Scenario.Verdict.Best,
            explanation: 'Верно',
            topic: 'calm',
          },
          next: 'check',
        },
        {
          id: 'bad',
          text: 'Уйти',
          if: { meter: 'trust', gte: 0 },
          effects: [{ meter: 'trust', delta: -20 }],
          review: {
            verdict: Scenario.Verdict.Bad,
            explanation: 'Неверно',
            topic: 'calm',
          },
          next: 'check',
        },
      ],
    },
    check: {
      type: Scenario.NodeType.Line,
      speaker: 'anna',
      text: 'Итак',
      next: [{ if: { flag: 'helped' }, to: 'win' }, { to: 'lose' }],
    },
    win: { type: Scenario.NodeType.End, speaker: 'anna', text: 'Отлично' },
    lose: {
      type: Scenario.NodeType.End,
      speaker: 'anna',
      text: 'Плохо',
      result: Attempt.Status.Failed,
    },
  },
});

export type Mutation = (scenario: Scenario.Definition) => void;

export const broken = (mutate: Mutation): Scenario.Definition => {
  const scenario = createScenario();
  mutate(scenario);
  return scenario;
};

export const lineOf = (
  scenario: Scenario.Definition,
  id: Scenario.NodeId
): Scenario.LineNode => {
  const node = scenario.nodes[id];
  if (node.type !== Scenario.NodeType.Line) throw new Error(`${id}: не line`);
  return node;
};

export const transitionsOf = (
  scenario: Scenario.Definition,
  id: Scenario.NodeId = 'check'
): Scenario.Transition[] => {
  const { next } = lineOf(scenario, id);
  if (typeof next === 'string') throw new Error(`${id}: next не список`);
  return next;
};

export const choiceOf = (
  scenario: Scenario.Definition,
  id: Scenario.NodeId = 'q1'
): Scenario.ChoiceNode => {
  const node = scenario.nodes[id];
  if (node.type !== Scenario.NodeType.Choice)
    throw new Error(`${id}: не choice`);
  return node;
};

type Brief = Pick<Validation.Issue, 'code' | 'path'>;

const brief = (issues: Validation.Issue[]): Brief[] =>
  issues.map(({ code, path }) => ({ code, path }));

export const errorsOf = (input: unknown): Brief[] => {
  const result = validateScenario(input, registries);
  return result.ok ? [] : brief(result.errors);
};

export const warningsOf = (input: unknown): Brief[] =>
  brief(validateScenario(input, registries).warnings);
