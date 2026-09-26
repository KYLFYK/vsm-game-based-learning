import { Attempt, Scenario } from '@/types';

import { buildReport } from '../build-report';
import { recommendScenarios } from '../recommend';
import {
  createReportAttempt,
  createReportCourse,
  createReportScenario,
  decision,
} from './report-fixture';

jest.mock('@/constants/topics', () => ({
  TOPICS: {
    calm: { label: 'Спокойствие' },
    safety: { label: 'Безопасность' },
  },
}));

jest.mock('../recommend', () => ({ recommendScenarios: jest.fn(() => []) }));

const build = (
  attemptPatch: Partial<Attempt.Item> = {},
  extra: Partial<Parameters<typeof buildReport>[0]> = {}
) =>
  buildReport({
    scenario: createReportScenario(),
    attempt: createReportAttempt(attemptPatch),
    catalog: [],
    attempts: [],
    ...extra,
  });

describe(buildReport.name, () => {
  test('builds the whole report for a passed attempt', () => {
    expect(build({}, { course: createReportCourse() })).toMatchSnapshot();
  });

  test('score is taken from the attempt', () => {
    expect(build({ score: null }).score).toBeNull();
    expect(build().score).toBe(63);
  });

  describe('meters', () => {
    test('series starts with initial and follows every log record', () => {
      const [trust, order] = build().meters;
      expect(trust.series).toEqual([50, 40, 60, 60, 60, 60]);
      expect(order.series).toEqual([6, 6, 6, 6, 8, 8]);
    });

    test('final value is compared with the pass threshold', () => {
      const [trust, order] = build().meters;
      expect(trust).toMatchObject({
        id: 'trust',
        label: 'Доверие',
        min: 0,
        max: 100,
        final: 60,
        threshold: 60,
        met: true,
      });
      expect(order).toMatchObject({ min: 2, max: 10, final: 8, met: true });
      expect(order.threshold).toBeUndefined();
    });

    test('a final value below the threshold is not met', () => {
      const [trust] = build({ meters: { trust: 59, order: 8 } }).meters;
      expect(trust.met).toBe(false);
    });

    test('scenario without meters gives no meter reports', () => {
      const scenario = createReportScenario();
      delete scenario.meters;
      delete scenario.passCriteria;
      expect(build({}, { scenario }).meters).toEqual([]);
    });
  });

  describe('decisions', () => {
    test('only records with review, indexed by log position', () => {
      const { decisions } = build();
      expect(decisions.map((item) => item.index)).toEqual([0, 1, 3, 4]);
      expect(decisions[0]).toMatchObject({
        question: 'С чего начнёшь?',
        speaker: 'anna',
        chosen: 'Крикну «Всем стоять»',
        verdict: Scenario.Verdict.Bad,
        explanation: 'Крик пугает',
        topic: 'calm',
        effects: [{ meter: 'trust', delta: -10 }],
      });
    });

    test('bad and ok decisions point to the best option of the node', () => {
      const [shout] = build().decisions;
      expect(shout.better).toEqual({
        text: 'Успокою пассажиров',
        explanation: 'Спокойствие — первое',
      });
      const { decisions } = build({
        log: [decision('mentor', 'ask', { trust: 55, order: 6 })],
      });
      expect(decisions[0].better?.text).toBe('Успокою пассажиров');
    });

    test('best decisions have no better option', () => {
      expect(build().decisions[1].better).toBeUndefined();
    });

    test('no better option when the node has no best verdict', () => {
      const wait = build().decisions[3];
      expect(wait.verdict).toBe(Scenario.Verdict.Ok);
      expect(wait.better).toBeUndefined();
    });

    test('records pointing to missing nodes or options are skipped', () => {
      const { decisions } = build({
        log: [
          decision('gone', 'calm', {}),
          decision('mentor', 'gone', {}),
          decision('end', 'calm', {}),
        ],
      });
      expect(decisions).toEqual([]);
    });
  });

  describe('topics', () => {
    test('counts verdicts per topic, weak first', () => {
      expect(build().topics).toEqual([
        {
          id: 'calm',
          label: 'Спокойствие',
          best: 1,
          ok: 0,
          bad: 1,
          weak: true,
        },
        {
          id: 'safety',
          label: 'Безопасность',
          best: 1,
          ok: 1,
          bad: 0,
          weak: false,
        },
      ]);
    });

    test('share of best below one half is weak, exactly one half is not', () => {
      const topicsOf = (log: Attempt.Decision[]) =>
        build({ log }).topics.find((topic) => topic.id === 'safety');
      const half = [decision('exit', 'show', {}), decision('hold', 'wait', {})];
      expect(topicsOf(half)?.weak).toBe(false);
      expect(topicsOf([...half, decision('hold', 'wait', {})])?.weak).toBe(
        true
      );
    });

    test('topics of equal weakness are ordered by label', () => {
      const { topics } = build({
        log: [decision('mentor', 'calm', {}), decision('exit', 'show', {})],
      });
      expect(topics.map((topic) => topic.label)).toEqual([
        'Безопасность',
        'Спокойствие',
      ]);
    });
  });

  describe('recommendations', () => {
    test('are picked by weak topics from the catalog', () => {
      const recommendation = {
        scenarioId: 'fire',
        title: 'Пожар',
        topics: ['calm'],
      };
      jest.mocked(recommendScenarios).mockReturnValueOnce([recommendation]);
      const catalog = [
        {
          id: 'fire',
          version: 1,
          title: 'Пожар',
          description: '',
          topics: ['calm'],
          estimatedMinutes: 3,
          hasMeters: false,
        },
      ];
      const attempts = [createReportAttempt()];
      const report = build({}, { catalog, attempts });
      expect(recommendScenarios).toHaveBeenLastCalledWith({
        scenarioId: 'station',
        weakTopics: ['calm'],
        catalog,
        attempts,
      });
      expect(report.recommendations).toEqual([recommendation]);
    });
  });

  describe('version mismatch', () => {
    test('keeps outcome and meters, drops decisions and topics', () => {
      const report = build({ scenarioVersion: 1 });
      expect(report.versionMismatch).toBe(true);
      expect(report.decisions).toEqual([]);
      expect(report.topics).toEqual([]);
      expect(recommendScenarios).toHaveBeenLastCalledWith(
        expect.objectContaining({ weakTopics: [] })
      );
      expect(report.outcome.text).toBe('Сценарий пройден');
      expect(report.meters).toHaveLength(2);
    });

    test('matching version is not a mismatch', () => {
      expect(build().versionMismatch).toBe(false);
    });
  });

  describe('nextScenarioId', () => {
    test('passed attempt in a course gets the next scenario', () => {
      expect(build({}, { course: createReportCourse() }).nextScenarioId).toBe(
        'fire'
      );
    });

    test('last scenario of the course has no next', () => {
      const course = createReportCourse(['intro', 'station']);
      expect(build({}, { course }).nextScenarioId).toBeNull();
    });

    test('failed attempt has no next', () => {
      const report = build(
        { status: Attempt.Status.Failed, reason: Attempt.Reason.Timeout },
        { course: createReportCourse() }
      );
      expect(report.nextScenarioId).toBeNull();
    });

    test('no course or scenario outside the course has no next', () => {
      expect(build().nextScenarioId).toBeNull();
      const course = createReportCourse(['intro', 'fire']);
      expect(build({}, { course }).nextScenarioId).toBeNull();
    });
  });
});
