import { act, renderHook } from '@testing-library/react';

import { ScenarioRun } from '@/types';

import { TICK_MS, useRunTimers } from '../use-run-timers';

const dispatch = jest.fn();
const expired = jest.fn(() => ({ type: 'scenarioRun/expired' }));

interface FakeState {
  status: ScenarioRun.Status;
  scenarioDeadlineAt: number | null;
  nodeDeadlineAt: number | null;
}

let fakeState: FakeState;

jest.mock('@/store', () => ({
  useAppDispatch: () => dispatch,
  useAppSelector: (selector: (state: FakeState) => unknown) =>
    selector(fakeState),
  selectRunStatus: (state: FakeState) => state.status,
  selectDeadlines: (state: FakeState) => ({
    scenarioDeadlineAt: state.scenarioDeadlineAt,
    nodeDeadlineAt: state.nodeDeadlineAt,
  }),
  expired: () => expired(),
}));

const NOW = 1_700_000_000_000;

describe(useRunTimers.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
    fakeState = {
      status: ScenarioRun.Status.Idle,
      scenarioDeadlineAt: null,
      nodeDeadlineAt: null,
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns nulls and starts no interval when idle', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    const { result } = renderHook(() => useRunTimers());

    expect(result.current).toEqual({
      scenarioRemainingMs: null,
      nodeRemainingMs: null,
    });
    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('returns nulls and starts no interval when running without deadlines', () => {
    fakeState.status = ScenarioRun.Status.Running;
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    const { result } = renderHook(() => useRunTimers());

    expect(result.current).toEqual({
      scenarioRemainingMs: null,
      nodeRemainingMs: null,
    });
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  test('counts down the scenario deadline on each tick while running', () => {
    fakeState.status = ScenarioRun.Status.Running;
    fakeState.scenarioDeadlineAt = NOW + 1_000;

    const { result } = renderHook(() => useRunTimers());

    expect(result.current.scenarioRemainingMs).toBe(1_000);

    act(() => {
      jest.advanceTimersByTime(TICK_MS);
    });
    expect(result.current.scenarioRemainingMs).toBe(750);
    expect(result.current.nodeRemainingMs).toBeNull();

    act(() => {
      jest.advanceTimersByTime(TICK_MS);
    });
    expect(result.current.scenarioRemainingMs).toBe(500);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('dispatches expired once remaining time reaches zero', () => {
    fakeState.status = ScenarioRun.Status.Running;
    fakeState.scenarioDeadlineAt = NOW + 500;

    const { result } = renderHook(() => useRunTimers());

    act(() => {
      jest.advanceTimersByTime(TICK_MS * 2);
    });

    expect(result.current.scenarioRemainingMs).toBe(0);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'scenarioRun/expired' });
  });

  test('never reports negative remaining time for an already-passed deadline', () => {
    fakeState.status = ScenarioRun.Status.Running;
    fakeState.nodeDeadlineAt = NOW - 1_000;

    const { result } = renderHook(() => useRunTimers());

    expect(result.current.nodeRemainingMs).toBe(0);

    act(() => {
      jest.advanceTimersByTime(TICK_MS);
    });

    expect(result.current.nodeRemainingMs).toBe(0);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  test('recomputes remaining on deadline change without recreating the interval', () => {
    fakeState.status = ScenarioRun.Status.Running;
    fakeState.nodeDeadlineAt = NOW + 1_000;
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { result, rerender } = renderHook(() => useRunTimers());

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(TICK_MS);
    });
    expect(result.current.nodeRemainingMs).toBe(750);

    // Simulate re-entering a node: a fresh deadline arrives mid-tick.
    fakeState.nodeDeadlineAt = NOW + TICK_MS + 2_000;
    rerender();

    expect(result.current.nodeRemainingMs).toBe(2_000);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(clearIntervalSpy).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(TICK_MS);
    });
    expect(result.current.nodeRemainingMs).toBe(1_750);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
  });

  test('clears the interval on unmount', () => {
    fakeState.status = ScenarioRun.Status.Running;
    fakeState.scenarioDeadlineAt = NOW + 1_000;
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useRunTimers());
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });
});
