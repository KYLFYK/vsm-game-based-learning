import { createSelector } from '@reduxjs/toolkit';

import type { Attempt } from '@/types';
import { Scenario, ScenarioRun } from '@/types';

import { holds } from './conditions';
import { meterBounds } from './effects';

// Relative, not `@/store`: the barrel re-exports this file, so importing
// from the barrel here would be a self-reference. Type-only, so it does
// not create a runtime import cycle.
import type { RootState } from '../../store';
import type { ScenarioRunState } from './slice';

const scenarioRunOf = (state: RootState): ScenarioRunState => state.scenarioRun;

export const selectRunStatus = (state: RootState): ScenarioRun.Status =>
  state.scenarioRun.status;

export const selectRunScenario = (
  state: RootState
): Scenario.Definition | null => state.scenarioRun.scenario;

export const selectStage = (state: RootState): ScenarioRun.Stage =>
  state.scenarioRun.stage;

export const selectEnding = (state: RootState): ScenarioRun.Ending | null =>
  state.scenarioRun.ending;

export const selectCurrentNode = createSelector(
  [selectRunScenario, (state: RootState) => state.scenarioRun.currentNodeId],
  (scenario, currentNodeId): Scenario.Node | null => {
    if (scenario === null || currentNodeId === null) return null;
    return scenario.nodes[currentNodeId] ?? null;
  }
);

const EMPTY_OPTIONS: Scenario.Option[] = [];

export const selectVisibleOptions = createSelector(
  [selectCurrentNode, scenarioRunOf],
  (node, runState): Scenario.Option[] => {
    if (node?.type !== Scenario.NodeType.Choice) return EMPTY_OPTIONS;
    const visible = node.options.filter((option) => holds(option.if, runState));
    return visible.length === 0 ? EMPTY_OPTIONS : visible;
  }
);

const EMPTY_METER_VIEWS: ScenarioRun.MeterView[] = [];

export const selectMeterViews = createSelector(
  [selectRunScenario, (state: RootState) => state.scenarioRun.meters],
  (scenario, meters): ScenarioRun.MeterView[] => {
    const definitions = scenario?.meters;
    if (definitions === undefined) return EMPTY_METER_VIEWS;
    const thresholds = scenario?.passCriteria?.meters;
    return Object.entries(definitions).map(([id, meter]) => {
      const { min, max } = meterBounds(meter);
      const threshold = thresholds?.[id];
      return {
        id,
        label: meter.label,
        value: meters[id],
        min,
        max,
        ...(threshold === undefined ? {} : { threshold }),
      };
    });
  }
);

export const selectMetersVisible = createSelector(
  [selectRunScenario, selectStage],
  (scenario, stage): boolean =>
    Object.keys(scenario?.meters ?? {}).length > 0 && stage.metersVisible
);

export interface Deadlines {
  scenarioDeadlineAt: number | null;
  nodeDeadlineAt: number | null;
}

export const selectDeadlines = createSelector(
  [
    (state: RootState) => state.scenarioRun.scenarioDeadlineAt,
    (state: RootState) => state.scenarioRun.nodeDeadlineAt,
  ],
  (scenarioDeadlineAt, nodeDeadlineAt): Deadlines => ({
    scenarioDeadlineAt,
    nodeDeadlineAt,
  })
);

export const selectAttemptDraft = createSelector(
  [scenarioRunOf],
  (state): Attempt.Item | null => {
    if (
      state.status !== ScenarioRun.Status.Finished ||
      state.scenario === null ||
      state.attemptId === null ||
      state.startedAt === null ||
      state.finishedAt === null ||
      state.ending === null
    ) {
      return null;
    }
    const { status, reason, failedMeterId, unmetCriteria } = state.ending;
    return {
      id: state.attemptId,
      scenarioId: state.scenario.id,
      scenarioVersion: state.scenario.version,
      ...(state.courseId === null ? {} : { courseId: state.courseId }),
      startedAt: state.startedAt,
      finishedAt: state.finishedAt,
      status,
      reason,
      ...(failedMeterId === undefined ? {} : { failedMeterId }),
      ...(unmetCriteria === undefined ? {} : { unmetCriteria }),
      score: state.score,
      meters: state.meters,
      flags: state.flags,
      log: state.log,
    };
  }
);
