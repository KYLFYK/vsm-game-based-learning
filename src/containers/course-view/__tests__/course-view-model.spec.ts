import { Course } from '@/types';

import { nextToPlay, playLabel } from '../course-view-model';

describe(playLabel.name, () => {
  test.each([
    [Course.ScenarioStatus.NotStarted, 'Играть'],
    [Course.ScenarioStatus.Failed, 'Пройти ещё раз'],
    [Course.ScenarioStatus.Passed, 'Пройти ещё раз'],
  ])('labels %s as %s', (status, label) => {
    expect(playLabel(status)).toBe(label);
  });
});

describe(nextToPlay.name, () => {
  test('picks the first scenario that is not passed, in course order', () => {
    expect(
      nextToPlay(['smoke', 'fire', 'door'], {
        smoke: Course.ScenarioStatus.Passed,
        fire: Course.ScenarioStatus.NotStarted,
        door: Course.ScenarioStatus.Failed,
      })
    ).toBe('fire');
  });

  test('a failed scenario still needs to be played', () => {
    expect(
      nextToPlay(['smoke', 'fire'], {
        smoke: Course.ScenarioStatus.Failed,
        fire: Course.ScenarioStatus.NotStarted,
      })
    ).toBe('smoke');
  });

  test('returns null when every scenario is passed', () => {
    expect(
      nextToPlay(['smoke'], { smoke: Course.ScenarioStatus.Passed })
    ).toBeNull();
  });
});
