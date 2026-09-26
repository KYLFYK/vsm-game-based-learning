import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router';

import { act, renderHook } from '@testing-library/react';

import { AchievementTab } from '../achievement-list.enums';
import { useAchievementTab } from '../use-achievement-tab';

const renderTab = (url: string) =>
  renderHook(() => ({ state: useAchievementTab(), location: useLocation() }), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    ),
  });

describe(useAchievementTab.name, () => {
  test('defaults to the mine tab without a search param', () => {
    const { result } = renderTab('/achievements');
    expect(result.current.state[0]).toBe(AchievementTab.Mine);
  });

  test('reads the all tab from the search param', () => {
    const { result } = renderTab('/achievements?tab=all');
    expect(result.current.state[0]).toBe(AchievementTab.All);
  });

  test('falls back to the mine tab for an unknown value', () => {
    const { result } = renderTab('/achievements?tab=ghost');
    expect(result.current.state[0]).toBe(AchievementTab.Mine);
  });

  test('writes the all tab and keeps other search params', () => {
    const { result } = renderTab('/achievements?x=1');

    act(() => result.current.state[1](AchievementTab.All));

    expect(result.current.state[0]).toBe(AchievementTab.All);
    expect(result.current.location.search).toBe('?x=1&tab=all');
  });

  test('drops the search param when switching back to mine', () => {
    const { result } = renderTab('/achievements?tab=all');

    act(() => result.current.state[1](AchievementTab.Mine));

    expect(result.current.state[0]).toBe(AchievementTab.Mine);
    expect(result.current.location.search).toBe('');
  });
});
