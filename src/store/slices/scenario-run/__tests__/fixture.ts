import { Attempt, Character, Scenario } from '@/types';

import { initialState, scenarioRunReducer } from '../slice';

import type { ScenarioRunState } from '../slice';
import type { Action } from '@reduxjs/toolkit';

export const T0 = 1_000_000;
export const SCENARIO_LIMIT_MS = 600_000;
export const NODE_LIMIT_MS = 30_000;

/**
 * intro (line) → ask (choice, 30 с) → branch (next по флагу) → check (next
 * по шкале) → forced-pass / forced-fail / finale (без result)
 */
export const createFixture = (): Scenario.Definition => ({
  id: 'fixture',
  version: 1,
  title: 'Фикстура',
  description: 'Сценарий для тестов редьюсера',
  topics: ['calm'],
  estimatedMinutes: 5,
  timeLimitSec: SCENARIO_LIMIT_MS / 1000,
  characters: ['author', 'anna', 'oleg'],
  meters: {
    trust: { label: 'Доверие', initial: 50 },
    calm: { label: 'Спокойствие', initial: 8, min: 2, max: 10 },
  },
  passCriteria: { meters: { trust: 60 }, flags: ['helped'] },
  outcomes: {
    timeout: { speaker: 'anna', text: 'Время вышло' },
    meterDepleted: {
      trust: { speaker: 'oleg', text: 'Доверие потеряно' },
      calm: { speaker: 'oleg', text: 'Паника' },
    },
  },
  startNodeId: 'intro',
  nodes: {
    intro: {
      type: Scenario.NodeType.Line,
      speaker: 'author',
      text: 'Вагон, утро',
      stage: {
        background: 'hall',
        left: { character: 'anna', mood: Character.Mood.Neutral },
        metersVisible: false,
      },
      next: 'ask',
    },
    ask: {
      type: Scenario.NodeType.Choice,
      speaker: 'oleg',
      text: 'Что происходит?',
      timeLimitSec: NODE_LIMIT_MS / 1000,
      stage: {
        right: { character: 'oleg', mood: Character.Mood.Worried },
        metersVisible: true,
      },
      options: [
        {
          id: 'calm-down',
          text: 'Успокоить',
          effects: [
            { meter: 'calm', delta: 5 },
            { meter: 'trust', delta: 20 },
            { flag: 'helped', value: true },
          ],
          review: { verdict: Scenario.Verdict.Best, explanation: 'Верно' },
          next: 'branch',
        },
        {
          id: 'retry',
          text: 'Переспросить',
          effects: [{ meter: 'trust', delta: 10 }],
          review: { verdict: Scenario.Verdict.Ok, explanation: 'Можно' },
          next: 'ask',
        },
        {
          id: 'hesitate',
          text: 'Замяться',
          effects: [{ meter: 'trust', delta: -5 }],
          review: { verdict: Scenario.Verdict.Bad, explanation: 'Плохо' },
          next: 'check',
        },
        { id: 'wait', text: 'Промолчать', next: 'branch' },
        {
          id: 'ignore',
          text: 'Отмахнуться',
          effects: [{ meter: 'trust', delta: -60 }],
          review: { verdict: Scenario.Verdict.Bad, explanation: 'Плохо' },
          next: 'branch',
        },
        {
          id: 'panic',
          text: 'Запаниковать',
          effects: [
            { meter: 'calm', delta: -20 },
            { meter: 'trust', delta: -60 },
          ],
          next: 'branch',
        },
        {
          id: 'secret',
          text: 'Скрытый вариант',
          if: { flag: 'helped' },
          next: 'forced-pass',
        },
      ],
    },
    branch: {
      type: Scenario.NodeType.Line,
      speaker: 'anna',
      text: 'Посмотрим',
      next: [{ if: { flag: 'helped' }, to: 'check' }, { to: 'forced-fail' }],
    },
    check: {
      type: Scenario.NodeType.Line,
      speaker: 'anna',
      text: 'Итоги',
      stage: { left: null },
      next: [
        { if: { meter: 'trust', gte: 80 }, to: 'forced-pass' },
        { to: 'finale' },
      ],
    },
    'forced-pass': {
      type: Scenario.NodeType.End,
      speaker: 'anna',
      text: 'Отлично',
      result: Attempt.Status.Passed,
    },
    'forced-fail': {
      type: Scenario.NodeType.End,
      speaker: 'anna',
      text: 'Провал',
      result: Attempt.Status.Failed,
    },
    finale: {
      type: Scenario.NodeType.End,
      speaker: 'anna',
      text: 'Конец',
      stage: { background: 'platform' },
    },
  },
});

export const reduce = (
  actions: Action[],
  state: ScenarioRunState = initialState
): ScenarioRunState => actions.reduce(scenarioRunReducer, state);
