import { BubbleSide } from '@/components';
import { CHARACTERS } from '@/constants/characters';
import { Character } from '@/types';
import type { ScenarioRun } from '@/types';

export interface SpeakerLayout {
  activeSide: Character.Side | null;
  bubbleSide: BubbleSide;
  name?: string;
}

/** Какой слот подсветить и где показать реплику говорящего. */
export const speakerLayout = (
  stage: ScenarioRun.Stage,
  speaker: Character.Id
): SpeakerLayout => {
  const character = CHARACTERS[speaker];
  if (character.role === Character.Role.Author) {
    return { activeSide: null, bubbleSide: BubbleSide.Top };
  }
  const { name } = character;
  if (stage.left?.character === speaker) {
    return {
      activeSide: Character.Side.Left,
      bubbleSide: BubbleSide.Left,
      name,
    };
  }
  if (stage.right?.character === speaker) {
    return {
      activeSide: Character.Side.Right,
      bubbleSide: BubbleSide.Right,
      name,
    };
  }
  return { activeSide: null, bubbleSide: BubbleSide.Top, name };
};
