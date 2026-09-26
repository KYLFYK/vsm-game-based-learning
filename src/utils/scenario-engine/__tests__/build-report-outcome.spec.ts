import { Attempt } from '@/types';

import { buildReport } from '../build-report';
import { createReportAttempt, createReportScenario } from './report-fixture';

jest.mock('../recommend', () => ({ recommendScenarios: jest.fn(() => []) }));

const build = (attemptPatch: Partial<Attempt.Item> = {}) =>
  buildReport({
    scenario: createReportScenario(),
    attempt: createReportAttempt(attemptPatch),
    catalog: [],
    attempts: [],
  });

describe(buildReport.name, () => {
  describe('outcome', () => {
    test.each([
      [Attempt.Status.Passed, Attempt.Reason.Completed, 'Сценарий пройден'],
      [Attempt.Status.Passed, Attempt.Reason.EndNode, 'Сценарий пройден'],
      [
        Attempt.Status.Failed,
        Attempt.Reason.EndNode,
        'Сценарий завершён неудачно',
      ],
      [Attempt.Status.Failed, Attempt.Reason.Timeout, 'Время вышло'],
    ])('%s / %s → %s', (status, reason, text) => {
      expect(build({ status, reason }).outcome).toEqual({
        status,
        reason,
        text,
      });
    });

    test('meter depletion names the meter by its label', () => {
      const { outcome } = build({
        status: Attempt.Status.Failed,
        reason: Attempt.Reason.MeterDepleted,
        failedMeterId: 'order',
      });
      expect(outcome.text).toBe('Шкала «Порядок» упала до минимума');
    });

    test('unmet criteria list meter labels and a phrase for flags', () => {
      const { outcome } = build({
        status: Attempt.Status.Failed,
        reason: Attempt.Reason.Criteria,
        unmetCriteria: { meters: ['trust', 'order'], flags: ['helped', 'x'] },
      });
      expect(outcome.text).toBe(
        'Не выполнены условия: Доверие, Порядок, обязательные действия'
      );
    });

    test.each(['renamed', 'constructor'])(
      'unknown stored reason %s falls back to the status',
      (reason) => {
        // Object.assign вместо `as`: попытка из localStorage не проверяется по форме
        const text = (status: Attempt.Status) =>
          buildReport({
            scenario: createReportScenario(),
            attempt: Object.assign(createReportAttempt({ status }), { reason }),
            catalog: [],
            attempts: [],
          }).outcome.text;
        expect(text(Attempt.Status.Passed)).toBe('Сценарий пройден');
        expect(text(Attempt.Status.Failed)).toBe('Сценарий завершён неудачно');
      }
    );

    test('unmet criteria with meters only omit the flags phrase', () => {
      const { outcome } = build({
        status: Attempt.Status.Failed,
        reason: Attempt.Reason.Criteria,
        unmetCriteria: { meters: ['trust'], flags: [] },
      });
      expect(outcome.text).toBe('Не выполнены условия: Доверие');
    });
  });
});
