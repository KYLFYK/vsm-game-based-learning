import { act, renderHook } from '@testing-library/react';

import { useFullscreen } from '../use-fullscreen';

let fullscreenElement: Element | null;
const requestFullscreen = jest.fn(() => Promise.resolve());
const exitFullscreen = jest.fn(() => Promise.resolve());

const define = (target: object, key: string, value: unknown) =>
  Object.defineProperty(target, key, { configurable: true, value });

describe(useFullscreen.name, () => {
  beforeEach(() => {
    fullscreenElement = null;
    define(document, 'fullscreenEnabled', true);
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement,
    });
    define(document, 'exitFullscreen', exitFullscreen);
    define(document.documentElement, 'requestFullscreen', requestFullscreen);
  });

  test('reports unsupported when the API is disabled', () => {
    define(document, 'fullscreenEnabled', false);

    const { result } = renderHook(() => useFullscreen());

    expect(result.current.supported).toBe(false);
  });

  test('reports unsupported when the API is missing', () => {
    define(document, 'fullscreenEnabled', undefined);

    const { result } = renderHook(() => useFullscreen());

    expect(result.current.supported).toBe(false);
  });

  test('requests fullscreen on the document element when inactive', () => {
    const { result } = renderHook(() => useFullscreen());

    expect(result.current).toMatchObject({ supported: true, active: false });
    act(() => {
      result.current.toggle();
    });

    expect(requestFullscreen).toHaveBeenCalledTimes(1);
    expect(exitFullscreen).not.toHaveBeenCalled();
  });

  test('exits fullscreen when active', () => {
    fullscreenElement = document.documentElement;
    const { result } = renderHook(() => useFullscreen());

    expect(result.current.active).toBe(true);
    act(() => {
      result.current.toggle();
    });

    expect(exitFullscreen).toHaveBeenCalledTimes(1);
  });

  test('follows fullscreenchange', () => {
    const { result } = renderHook(() => useFullscreen());

    act(() => {
      fullscreenElement = document.documentElement;
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    expect(result.current.active).toBe(true);

    act(() => {
      fullscreenElement = null;
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    expect(result.current.active).toBe(false);
  });

  test('swallows a refused request', async () => {
    requestFullscreen.mockImplementationOnce(() =>
      Promise.reject(new Error('denied'))
    );
    const { result } = renderHook(() => useFullscreen());

    await act(async () => {
      result.current.toggle();
    });

    expect(requestFullscreen).toHaveBeenCalledTimes(1);
  });

  test('exits fullscreen on unmount when active', () => {
    const { unmount } = renderHook(() => useFullscreen());
    fullscreenElement = document.documentElement;

    unmount();

    expect(exitFullscreen).toHaveBeenCalledTimes(1);
  });

  test('leaves the document alone on unmount when inactive', () => {
    const { unmount } = renderHook(() => useFullscreen());

    unmount();

    expect(exitFullscreen).not.toHaveBeenCalled();
  });
});
