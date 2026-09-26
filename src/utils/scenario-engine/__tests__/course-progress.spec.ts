import { Attempt, Course } from '@/types';

import { courseProgress } from '../course-progress';

const attempt = (patch: Partial<Attempt.Item> = {}): Attempt.Item => ({
  id: 'a',
  scenarioId: 'scenario',
  scenarioVersion: 1,
  startedAt: 0,
  finishedAt: 1000,
  status: Attempt.Status.Passed,
  reason: Attempt.Reason.Completed,
  score: 100,
  meters: {},
  flags: {},
  log: [],
  ...patch,
});

const course = (scenarioIds: string[]): Course.Definition => ({
  id: 'course',
  title: 'Курс',
  description: '',
  scenarioIds,
});

describe(courseProgress.name, () => {
  test('gives each scenario a status by its best attempt', () => {
    const progress = courseProgress(course(['smoke', 'fire', 'door']), [
      attempt({ scenarioId: 'smoke' }),
      attempt({ scenarioId: 'fire', status: Attempt.Status.Failed }),
      attempt({ scenarioId: 'unrelated' }),
    ]);
    expect(progress).toEqual({
      statuses: {
        smoke: Course.ScenarioStatus.Passed,
        fire: Course.ScenarioStatus.Failed,
        door: Course.ScenarioStatus.NotStarted,
      },
      passed: 1,
      total: 3,
      completed: false,
    });
  });

  test('counts attempts made outside the course', () => {
    const progress = courseProgress(course(['smoke']), [
      attempt({ scenarioId: 'smoke', courseId: undefined }),
    ]);
    expect(progress.completed).toBe(true);
  });

  test('is completed when every scenario is passed', () => {
    const progress = courseProgress(course(['smoke', 'fire']), [
      attempt({ scenarioId: 'smoke' }),
      attempt({ scenarioId: 'fire', status: Attempt.Status.Failed }),
      attempt({ scenarioId: 'fire', status: Attempt.Status.Passed }),
    ]);
    expect(progress).toMatchObject({ passed: 2, total: 2, completed: true });
  });

  test('an empty course is never completed', () => {
    expect(courseProgress(course([]), [])).toMatchObject({
      passed: 0,
      total: 0,
      completed: false,
    });
  });
});
