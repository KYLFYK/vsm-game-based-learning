import { scenarioLink } from '../scenario-link';

describe(scenarioLink.name, () => {
  test('links to the scenario without a course', () => {
    expect(scenarioLink('smoke')).toEqual({
      pathname: '/scenarios/smoke',
      search: '',
    });
  });

  test('carries the course as a search parameter', () => {
    expect(scenarioLink('smoke', 'basics')).toEqual({
      pathname: '/scenarios/smoke',
      search: '?course=basics',
    });
  });
});
