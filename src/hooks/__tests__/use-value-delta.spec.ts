import { act, renderHook } from '@testing-library/react';

import { useValueDelta } from '../use-value-delta';

const DURATION = 1_000;

const setup = (value: number) =>
  renderHook(({ current }) => useValueDelta(current, DURATION), {
    initialProps: { current: value },
  });

describe(useValueDelta.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns null until the value changes', () => {
    const { result, rerender } = setup(50);
    expect(result.current).toBeNull();

    rerender({ current: 50 });
    expect(result.current).toBeNull();
  });

  test('reports the difference with the previous value', () => {
    const { result, rerender } = setup(50);

    rerender({ current: 40 });

    expect(result.current).toEqual({ amount: -10, key: 1 });
  });

  test('clears the delta after the duration', () => {
    const { result, rerender } = setup(50);
    rerender({ current: 60 });

    act(() => {
      jest.advanceTimersByTime(DURATION - 1);
    });
    expect(result.current).toEqual({ amount: 10, key: 1 });

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBeNull();
  });

  test('shows the latest change, not a sum, and bumps the key', () => {
    const { result, rerender } = setup(50);
    rerender({ current: 60 });

    act(() => {
      jest.advanceTimersByTime(DURATION / 2);
    });
    rerender({ current: 75 });

    expect(result.current).toEqual({ amount: 15, key: 2 });

    act(() => {
      jest.advanceTimersByTime(DURATION / 2);
    });
    expect(result.current).toEqual({ amount: 15, key: 2 });
  });

  test('clears the pending timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { rerender, unmount } = setup(50);
    rerender({ current: 60 });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
