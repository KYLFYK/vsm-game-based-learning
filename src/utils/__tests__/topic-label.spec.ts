import { topicLabel } from '../topic-label';

jest.mock('@/constants/topics', () => ({
  TOPICS: { 'safety.fire': { label: 'Действия при пожаре' } },
}));

describe(topicLabel.name, () => {
  test('labels a known topic from the registry', () => {
    expect(topicLabel('safety.fire')).toBe('Действия при пожаре');
  });

  test('falls back to the id for an unknown topic', () => {
    expect(topicLabel('safety.flood')).toBe('safety.flood');
  });

  test('does not resolve prototype keys as topics', () => {
    expect(topicLabel('constructor')).toBe('constructor');
  });
});
