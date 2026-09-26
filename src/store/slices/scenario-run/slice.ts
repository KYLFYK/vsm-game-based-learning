import { createSlice } from '@reduxjs/toolkit';

import { ScenarioRun } from '@/types';
import type { Attempt, Course, Scenario } from '@/types';

import { advance, chooseOption, expire, startRun } from './reducers';

import type {
  NowPayload,
  OptionChosenPayload,
  RunStartedPayload,
} from './reducers';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ScenarioRunState {
  status: ScenarioRun.Status;
  attemptId: Attempt.Id | null;
  scenario: Scenario.Definition | null;
  courseId: Course.Id | null;
  currentNodeId: Scenario.NodeId | null;
  stage: ScenarioRun.Stage;
  meters: Record<Scenario.MeterId, number>;
  flags: Record<Scenario.FlagId, boolean>;
  startedAt: number | null;
  finishedAt: number | null;
  scenarioDeadlineAt: number | null;
  nodeDeadlineAt: number | null;
  log: Attempt.Decision[];
  ending: ScenarioRun.Ending | null;
  score: number | null;
}

export interface RunStartInput {
  scenario: Scenario.Definition;
  courseId?: Course.Id;
}

export const initialState: ScenarioRunState = {
  status: ScenarioRun.Status.Idle,
  attemptId: null,
  scenario: null,
  courseId: null,
  currentNodeId: null,
  stage: { background: null, left: null, right: null, metersVisible: true },
  meters: {},
  flags: {},
  startedAt: null,
  finishedAt: null,
  scenarioDeadlineAt: null,
  nodeDeadlineAt: null,
  log: [],
  ending: null,
  score: null,
};

const scenarioRunSlice = createSlice({
  name: 'scenarioRun',
  initialState,
  reducers: {
    runStarted: {
      reducer: (_state, action: PayloadAction<RunStartedPayload>) =>
        startRun(initialState, action.payload),
      prepare: ({ scenario, courseId }: RunStartInput, now = Date.now()) => ({
        payload: {
          scenario,
          courseId: courseId ?? null,
          now,
          attemptId: crypto.randomUUID(),
        },
      }),
    },
    advanced: {
      reducer: (state, action: PayloadAction<NowPayload>) =>
        advance(state, action.payload),
      prepare: (now = Date.now()) => ({ payload: { now } }),
    },
    optionChosen: {
      reducer: (state, action: PayloadAction<OptionChosenPayload>) =>
        chooseOption(state, action.payload),
      prepare: (optionId: Scenario.OptionId, now = Date.now()) => ({
        payload: { optionId, now },
      }),
    },
    expired: {
      reducer: (state, action: PayloadAction<NowPayload>) =>
        expire(state, action.payload),
      prepare: (now = Date.now()) => ({ payload: { now } }),
    },
    runLeft: () => initialState,
  },
});

export const { runStarted, advanced, optionChosen, expired, runLeft } =
  scenarioRunSlice.actions;

export const scenarioRunReducer = scenarioRunSlice.reducer;
