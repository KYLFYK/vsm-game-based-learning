import { BubbleSide } from '@/components';
import { Character } from '@/types';
import type { ScenarioRun } from '@/types';

import { speakerLayout } from '../speaker-layout';

jest.mock('@/constants/characters', () => ({
  CHARACTERS: {
    author: { id: 'author', name: 'Автор', role: 'author', description: '' },
    anna: { id: 'anna', name: 'Анна', role: 'mentor', description: '' },
    oleg: { id: 'oleg', name: 'Олег', role: 'passenger', description: '' },
  },
}));

const stage: ScenarioRun.Stage = {
  background: null,
  left: { character: 'anna', mood: Character.Mood.Neutral },
  right: { character: 'oleg', mood: Character.Mood.Worried },
  metersVisible: true,
};

describe(speakerLayout.name, () => {
  test('puts the author on top without a name and dims both slots', () => {
    expect(speakerLayout(stage, 'author')).toEqual({
      activeSide: null,
      bubbleSide: BubbleSide.Top,
    });
  });

  test('highlights the left slot for its character', () => {
    expect(speakerLayout(stage, 'anna')).toEqual({
      activeSide: Character.Side.Left,
      bubbleSide: BubbleSide.Left,
      name: 'Анна',
    });
  });

  test('highlights the right slot for its character', () => {
    expect(speakerLayout(stage, 'oleg')).toEqual({
      activeSide: Character.Side.Right,
      bubbleSide: BubbleSide.Right,
      name: 'Олег',
    });
  });

  test('shows an off-stage speaker on top with a name', () => {
    expect(speakerLayout({ ...stage, right: null }, 'oleg')).toEqual({
      activeSide: null,
      bubbleSide: BubbleSide.Top,
      name: 'Олег',
    });
  });
});
