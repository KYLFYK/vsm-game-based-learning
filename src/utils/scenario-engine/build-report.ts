import { TOPICS } from '@/constants/topics';
import { Attempt, Scenario } from '@/types';
import type { Course, Report } from '@/types';

import { meterBounds } from './meter-bounds';
import { recommendScenarios } from './recommend';

export interface BuildReportInput {
  scenario: Scenario.Definition;
  attempt: Attempt.Item;
  catalog: Scenario.Summary[];
  attempts: Attempt.Item[];
  course?: Course.Definition;
}

const PASSED_TEXT = 'Сценарий пройден';

const meterLabel = (
  scenario: Scenario.Definition,
  id: Scenario.MeterId
): string => scenario.meters?.[id]?.label ?? id;

// Флаги — внутренние id сценария без подписей, поэтому называются общей фразой
const criteriaText = (
  scenario: Scenario.Definition,
  unmet: Attempt.UnmetCriteria | undefined
): string => {
  const parts = (unmet?.meters ?? []).map((id) => meterLabel(scenario, id));
  if ((unmet?.flags ?? []).length > 0) parts.push('обязательные действия');
  return `Не выполнены условия: ${parts.join(', ')}`;
};

const FAILED_TEXT = 'Сценарий завершён неудачно';

const OUTCOME_TEXT: Record<
  Attempt.Reason,
  (scenario: Scenario.Definition, attempt: Attempt.Item) => string
> = {
  [Attempt.Reason.Completed]: () => PASSED_TEXT,
  [Attempt.Reason.EndNode]: (_scenario, attempt) =>
    attempt.status === Attempt.Status.Passed ? PASSED_TEXT : FAILED_TEXT,
  [Attempt.Reason.Criteria]: (scenario, attempt) =>
    criteriaText(scenario, attempt.unmetCriteria),
  [Attempt.Reason.Timeout]: () => 'Время вышло',
  // min шкалы не обязательно ноль, поэтому «до минимума»
  [Attempt.Reason.MeterDepleted]: (scenario, attempt) =>
    `Шкала «${meterLabel(scenario, attempt.failedMeterId ?? '')}» упала до минимума`,
};

// Попытка из localStorage не проверяется по форме: причина другой версии
// приложения не должна ронять отчёт, hasOwn — от ключей вроде `constructor`
const outcomeText = (
  scenario: Scenario.Definition,
  attempt: Attempt.Item
): string => {
  if (Object.hasOwn(OUTCOME_TEXT, attempt.reason)) {
    return OUTCOME_TEXT[attempt.reason](scenario, attempt);
  }
  return attempt.status === Attempt.Status.Passed ? PASSED_TEXT : FAILED_TEXT;
};

const buildMeters = (
  scenario: Scenario.Definition,
  attempt: Attempt.Item
): Report.Meter[] =>
  Object.entries(scenario.meters ?? {}).map(([id, meter]) => {
    const series = [meter.initial];
    for (const record of attempt.log) {
      // запись старой версии сценария может не знать эту шкалу
      series.push(record.metersAfter[id] ?? series[series.length - 1]);
    }
    const final = attempt.meters[id] ?? series[series.length - 1];
    const threshold = scenario.passCriteria?.meters?.[id];
    return {
      id,
      label: meter.label,
      ...meterBounds(meter),
      final,
      ...(threshold === undefined ? {} : { threshold }),
      met: threshold === undefined || final >= threshold,
      series,
    };
  });

const choiceNode = (
  scenario: Scenario.Definition,
  id: Scenario.NodeId
): Scenario.ChoiceNode | undefined => {
  // Object.hasOwn — nodeId из хранилища не должен находиться через прототип
  const node = Object.hasOwn(scenario.nodes, id)
    ? scenario.nodes[id]
    : undefined;
  return node?.type === Scenario.NodeType.Choice ? node : undefined;
};

const betterOption = (
  node: Scenario.ChoiceNode,
  verdict: Scenario.Verdict
): Report.Better | undefined => {
  if (verdict === Scenario.Verdict.Best) return undefined;
  const best = node.options.find(
    (option) => option.review?.verdict === Scenario.Verdict.Best
  );
  return best?.review === undefined
    ? undefined
    : { text: best.text, explanation: best.review.explanation };
};

const buildDecisions = (
  scenario: Scenario.Definition,
  attempt: Attempt.Item
): Report.Decision[] =>
  attempt.log.flatMap((record, index) => {
    const node = choiceNode(scenario, record.nodeId);
    const option = node?.options.find((item) => item.id === record.optionId);
    if (node === undefined || option?.review === undefined) return [];
    const { verdict, explanation, topic } = option.review;
    const better = betterOption(node, verdict);
    return [
      {
        index,
        question: node.text,
        speaker: node.speaker,
        chosen: option.text,
        verdict,
        explanation,
        ...(topic === undefined ? {} : { topic }),
        effects: record.effects,
        ...(better === undefined ? {} : { better }),
      },
    ];
  });

const VERDICT_KEY = {
  [Scenario.Verdict.Best]: 'best',
  [Scenario.Verdict.Ok]: 'ok',
  [Scenario.Verdict.Bad]: 'bad',
} as const;

const buildTopics = (decisions: Report.Decision[]): Report.Topic[] => {
  const counts = new Map<
    Scenario.TopicId,
    Record<'best' | 'ok' | 'bad', number>
  >();
  for (const { topic, verdict } of decisions) {
    if (topic === undefined) continue;
    const count = counts.get(topic) ?? { best: 0, ok: 0, bad: 0 };
    count[VERDICT_KEY[verdict]] += 1;
    counts.set(topic, count);
  }
  return [...counts]
    .map(([id, { best, ok, bad }]) => ({
      id,
      label: Object.hasOwn(TOPICS, id) ? TOPICS[id].label : id,
      best,
      ok,
      bad,
      weak: bad > 0 || best / (best + ok + bad) < 0.5,
    }))
    .sort(
      (a, b) =>
        Number(b.weak) - Number(a.weak) || a.label.localeCompare(b.label)
    );
};

const nextInCourse = (
  scenario: Scenario.Definition,
  attempt: Attempt.Item,
  course: Course.Definition | undefined
): Scenario.Id | null => {
  if (course === undefined || attempt.status !== Attempt.Status.Passed) {
    return null;
  }
  const index = course.scenarioIds.indexOf(scenario.id);
  if (index === -1) return null;
  return course.scenarioIds[index + 1] ?? null;
};

/** Отчёт о попытке; описывает только пройденный путь (specs/scenario-engine/report.md) */
export const buildReport = ({
  scenario,
  attempt,
  catalog,
  attempts,
  course,
}: BuildReportInput): Report.Item => {
  const versionMismatch = attempt.scenarioVersion !== scenario.version;
  const decisions = versionMismatch ? [] : buildDecisions(scenario, attempt);
  const topics = buildTopics(decisions);
  const weakTopics = topics.filter((topic) => topic.weak).map(({ id }) => id);
  return {
    versionMismatch,
    outcome: {
      status: attempt.status,
      reason: attempt.reason,
      text: outcomeText(scenario, attempt),
    },
    score: attempt.score,
    meters: buildMeters(scenario, attempt),
    decisions,
    topics,
    recommendations: recommendScenarios({
      scenarioId: scenario.id,
      weakTopics,
      catalog,
      attempts,
    }),
    nextScenarioId: nextInCourse(scenario, attempt, course),
  };
};
