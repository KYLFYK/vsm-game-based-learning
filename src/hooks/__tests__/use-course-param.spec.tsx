import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

import { renderHook } from '@testing-library/react';

import { useCourseParam } from '../use-course-param';

const at =
  (url: string) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
  );

describe(useCourseParam.name, () => {
  test('reads the course from the search parameter', () => {
    const { result } = renderHook(() => useCourseParam(), {
      wrapper: at('/scenarios/smoke?course=basics'),
    });

    expect(result.current).toBe('basics');
  });

  test('is null outside a course', () => {
    const { result } = renderHook(() => useCourseParam(), {
      wrapper: at('/scenarios/smoke'),
    });

    expect(result.current).toBeNull();
  });
});
