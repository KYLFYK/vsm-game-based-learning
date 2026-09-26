import { TagTone } from '@/components/tag';
import { CHARACTERS } from '@/constants/characters';
import { Attempt, Character, Scenario } from '@/types';
import { formatDelta, ownValue } from '@/utils';

export const VERDICT_LABELS: Record<Scenario.Verdict, string> = {
  [Scenario.Verdict.Best]: 'Лучший ответ',
  [Scenario.Verdict.Ok]: 'Допустимо',
  [Scenario.Verdict.Bad]: 'Ошибка',
};

export const VERDICT_TONES: Record<Scenario.Verdict, TagTone> = {
  [Scenario.Verdict.Best]: TagTone.Navy,
  [Scenario.Verdict.Ok]: TagTone.Neutral,
  [Scenario.Verdict.Bad]: TagTone.Red,
};

/** «Пройти ещё раз» — первая кнопка, если попытку есть куда улучшать */
export const isRetryPrimary = (
  status: Attempt.Status,
  score: number | null
): boolean =>
  status === Attempt.Status.Failed || (score !== null && score < 100);

// Флаги — внутренние id сценария, игроку показываются только шкалы
export const meterEffectLabels = (
  effects: Scenario.Effect[],
  labels: Record<Scenario.MeterId, string>
): string[] =>
  effects.flatMap((effect) =>
    'meter' in effect
      ? [`${labels[effect.meter] ?? effect.meter} ${formatDelta(effect.delta)}`]
      : []
  );

/** Имя говорящего перед вопросом; у автора имени нет — это реплика рассказчика */
export const speakerName = (id: Character.Id): string | null => {
  const character = ownValue(CHARACTERS, id);
  if (character === undefined) return id;
  return character.role === Character.Role.Author ? null : character.name;
};
