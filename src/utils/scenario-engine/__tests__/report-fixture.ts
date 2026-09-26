import { Attempt, Scenario } from '@/types';
import type { Course } from '@/types';

/**
 * mentor (наставник: best / ok / bad по теме calm) → exit (ситуация: без
 * review, best / bad по теме safety) → hold (нет варианта best) → end
 */
export const createReportScenario = (): Scenario.Definition => ({
  id: 'station',
  version: 2,
  title: 'Станция',
  description: 'Сценарий для тестов отчёта',
  topics: ['calm', 'safety'],
  estimatedMinutes: 5,
  characters: ['author', 'anna', 'oleg'],
  meters: {
    trust: { label: 'Доверие', initial: 50 },
    order: { label: 'Порядок', initial: 6, min: 2, max: 10 },
  },
  passCriteria: { meters: { trust: 60 }, flags: ['helped'] },
  startNodeId: 'mentor',
  nodes: {
    mentor: {
      type: Scenario.NodeType.Choice,
      speaker: 'anna',
      text: 'С чего начнёшь?',
      options: [
        {
          id: 'calm',
          text: 'Успокою пассажиров',
          effects: [{ meter: 'trust', delta: 20 }],
          review: {
            verdict: Scenario.Verdict.Best,
            explanation: 'Спокойствие — первое',
            topic: 'calm',
          },
          next: 'exit',
        },
        {
          id: 'ask',
          text: 'Спрошу, что случилось',
          effects: [{ meter: 'trust', delta: 5 }],
          review: {
            verdict: Scenario.Verdict.Ok,
            explanation: 'Можно, но дольше',
            topic: 'calm',
          },
          next: 'exit',
        },
        {
          id: 'shout',
          text: 'Крикну «Всем стоять»',
          effects: [{ meter: 'trust', delta: -10 }],
          review: {
            verdict: Scenario.Verdict.Bad,
            explanation: 'Крик пугает',
            topic: 'calm',
          },
          next: 'mentor',
        },
      ],
    },
    exit: {
      type: Scenario.NodeType.Choice,
      speaker: 'oleg',
      text: 'Где выход?',
      options: [
        { id: 'silent', text: 'Промолчать', next: 'hold' },
        {
          id: 'show',
          text: 'Показать выход',
          effects: [
            { meter: 'order', delta: 2 },
            { flag: 'helped', value: true },
          ],
          review: {
            verdict: Scenario.Verdict.Best,
            explanation: 'Верно',
            topic: 'safety',
          },
          next: 'hold',
        },
        {
          id: 'wave',
          text: 'Махнуть рукой',
          effects: [{ meter: 'order', delta: -2 }],
          review: {
            verdict: Scenario.Verdict.Bad,
            explanation: 'Пассажир не понял',
            topic: 'safety',
          },
          next: 'hold',
        },
      ],
    },
    hold: {
      type: Scenario.NodeType.Choice,
      speaker: 'oleg',
      text: 'А мне что делать?',
      options: [
        {
          id: 'wait',
          text: 'Ждать',
          review: {
            verdict: Scenario.Verdict.Ok,
            explanation: 'Терпимо',
            topic: 'safety',
          },
          next: 'end',
        },
        {
          id: 'run',
          text: 'Бежать',
          review: { verdict: Scenario.Verdict.Bad, explanation: 'Опасно' },
          next: 'end',
        },
      ],
    },
    end: { type: Scenario.NodeType.End, speaker: 'anna', text: 'Итог' },
  },
});

export const decision = (
  nodeId: Scenario.NodeId,
  optionId: Scenario.OptionId,
  metersAfter: Record<Scenario.MeterId, number>,
  effects: Scenario.Effect[] = []
): Attempt.Decision => ({ nodeId, optionId, at: 0, effects, metersAfter });

/** shout → calm → silent → show → wait: пройдено, trust 60, order 8, балл 63 */
export const createReportAttempt = (
  patch: Partial<Attempt.Item> = {}
): Attempt.Item => ({
  id: 'attempt-1',
  scenarioId: 'station',
  scenarioVersion: 2,
  courseId: 'course',
  startedAt: 1000,
  finishedAt: 61000,
  status: Attempt.Status.Passed,
  reason: Attempt.Reason.Completed,
  score: 63,
  meters: { trust: 60, order: 8 },
  flags: { helped: true },
  log: [
    decision('mentor', 'shout', { trust: 40, order: 6 }, [
      { meter: 'trust', delta: -10 },
    ]),
    decision('mentor', 'calm', { trust: 60, order: 6 }, [
      { meter: 'trust', delta: 20 },
    ]),
    decision('exit', 'silent', { trust: 60, order: 6 }),
    decision('exit', 'show', { trust: 60, order: 8 }, [
      { meter: 'order', delta: 2 },
      { flag: 'helped', value: true },
    ]),
    decision('hold', 'wait', { trust: 60, order: 8 }),
  ],
  ...patch,
});

export const createReportCourse = (
  scenarioIds: Scenario.Id[] = ['intro', 'station', 'fire']
): Course.Definition => ({
  id: 'course',
  title: 'Курс',
  description: 'Курс для тестов отчёта',
  scenarioIds,
});
