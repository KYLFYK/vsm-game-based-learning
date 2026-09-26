import { attemptLink, courseLink, scenarioLink } from '../route-links';

describe(scenarioLink.name, () => {
  test('links to the scenario without a course', () => {
    expect(scenarioLink('smoke')).toEqual({
      pathname: '/scenarios/smoke',
      search: '',
    });
  });

  test('treats a null course as no course', () => {
    expect(scenarioLink('smoke', null).search).toBe('');
  });

  test('carries the course as a search parameter', () => {
    expect(scenarioLink('smoke', 'basics')).toEqual({
      pathname: '/scenarios/smoke',
      search: '?course=basics',
    });
  });
});

describe(attemptLink.name, () => {
  test('links to the attempt report without a course', () => {
    expect(attemptLink('smoke', 'a1')).toEqual({
      pathname: '/scenarios/smoke/attempts/a1',
      search: '',
    });
  });

  test('carries the course as a search parameter', () => {
    expect(attemptLink('smoke', 'a1', 'basics').search).toBe('?course=basics');
  });
});

describe(courseLink.name, () => {
  test('links to the course page', () => {
    expect(courseLink('basics')).toBe('/courses/basics');
  });
});
