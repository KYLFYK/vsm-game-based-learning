import { renderHook } from '@testing-library/react';

import { usePlayerKeys } from '../use-player-keys';

const press = (
  key: string,
  init: KeyboardEventInit = {},
  target: EventTarget = window
): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  target.dispatchEvent(event);
  return event;
};

describe(usePlayerKeys.name, () => {
  test('advances on Enter and Space and prevents the default action', () => {
    const onAdvance = jest.fn();
    renderHook(() => usePlayerKeys(true, { onAdvance }));

    const enter = press('Enter');
    const space = press(' ');

    expect(onAdvance).toHaveBeenCalledTimes(2);
    expect(enter.defaultPrevented).toBe(true);
    expect(space.defaultPrevented).toBe(true);
  });

  test('maps digits 1–4 to a zero-based option index', () => {
    const onChoose = jest.fn();
    renderHook(() => usePlayerKeys(true, { onChoose }));

    press('1');
    press('4');

    expect(onChoose.mock.calls).toEqual([[0], [3]]);
  });

  test('ignores other digits and keys', () => {
    const onChoose = jest.fn();
    const onAdvance = jest.fn();
    renderHook(() => usePlayerKeys(true, { onChoose, onAdvance }));

    press('0');
    press('5');
    press('a');
    press('Escape');

    expect(onChoose).not.toHaveBeenCalled();
    expect(onAdvance).not.toHaveBeenCalled();
  });

  test('ignores repeated and modified presses', () => {
    const onChoose = jest.fn();
    const onAdvance = jest.fn();
    renderHook(() => usePlayerKeys(true, { onChoose, onAdvance }));

    press('Enter', { repeat: true });
    press('1', { ctrlKey: true });
    press('1', { metaKey: true });
    press('1', { altKey: true });
    press('1', { shiftKey: true });

    expect(onChoose).not.toHaveBeenCalled();
    expect(onAdvance).not.toHaveBeenCalled();
  });

  test('leaves Enter and Space to a focused button', () => {
    const onAdvance = jest.fn();
    const button = document.createElement('button');
    document.body.append(button);
    renderHook(() => usePlayerKeys(true, { onAdvance }));

    const enter = press('Enter', {}, button);
    press(' ', {}, button);

    expect(onAdvance).not.toHaveBeenCalled();
    expect(enter.defaultPrevented).toBe(false);
    button.remove();
  });

  test('still maps digits while a button is focused', () => {
    const onChoose = jest.fn();
    const button = document.createElement('button');
    document.body.append(button);
    renderHook(() => usePlayerKeys(true, { onChoose }));

    press('2', {}, button);

    expect(onChoose).toHaveBeenCalledWith(1);
    button.remove();
  });

  test('does not touch Enter without an advance handler', () => {
    renderHook(() => usePlayerKeys(true, { onChoose: jest.fn() }));

    expect(press('Enter').defaultPrevented).toBe(false);
  });

  test('does nothing while inactive', () => {
    const onAdvance = jest.fn();
    const onChoose = jest.fn();
    renderHook(() => usePlayerKeys(false, { onAdvance, onChoose }));

    press('Enter');
    press('1');

    expect(onAdvance).not.toHaveBeenCalled();
    expect(onChoose).not.toHaveBeenCalled();
  });

  test('uses the latest handlers without re-subscribing', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = renderHook(
      ({ handler }) => usePlayerKeys(true, { onAdvance: handler }),
      { initialProps: { handler: first } }
    );

    rerender({ handler: second });
    press('Enter');

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(
      addSpy.mock.calls.filter(([type]) => type === 'keydown')
    ).toHaveLength(1);
  });

  test('removes the listener on unmount', () => {
    const onAdvance = jest.fn();
    const { unmount } = renderHook(() => usePlayerKeys(true, { onAdvance }));

    unmount();
    press('Enter');

    expect(onAdvance).not.toHaveBeenCalled();
  });
});
