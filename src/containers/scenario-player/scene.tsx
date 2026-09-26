import { useCallback } from 'react';
import type { MouseEvent, ReactNode } from 'react';

import { CharacterPortrait } from '@/components/character-portrait';
import { ChoiceList } from '@/components/choice-list';
import { BackdropVariant, ComicBackdrop } from '@/components/comic-backdrop';
import { BubbleSide, SpeechBubble } from '@/components/speech-bubble';
import { STAMP_LABELS } from '@/components/stamp';
import { VisuallyHidden } from '@/components/visually-hidden';
import { BACKGROUNDS } from '@/constants/backgrounds';
import { CHARACTERS } from '@/constants/characters';
import {
  advanced,
  optionChosen,
  selectCurrentNode,
  selectEnding,
  selectRunStatus,
  selectStage,
  selectVisibleOptions,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { Character, Scenario, ScenarioRun } from '@/types';

import {
  Background,
  BubbleAnchor,
  CaptionAnchor,
  ChoicesAnchor,
  Hint,
  HintAnchor,
  LiveRegion,
  Slot,
  Zone,
} from './scenario-player.styles';
import { speakerLayout } from './speaker-layout';
import { usePlayerKeys } from './use-player-keys';

interface SceneProps {
  nodeRemainingMs: number | null;
  children?: ReactNode;
}

export const Scene = ({ nodeRemainingMs, children }: SceneProps) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectRunStatus);
  const stage = useAppSelector(selectStage);
  const node = useAppSelector(selectCurrentNode);
  const options = useAppSelector(selectVisibleOptions);
  const ending = useAppSelector(selectEnding);

  const finished = status === ScenarioRun.Status.Finished;
  const line: Scenario.Line | null = finished ? (ending?.line ?? null) : node;
  const isLine = !finished && node?.type === Scenario.NodeType.Line;
  const isChoice = !finished && node?.type === Scenario.NodeType.Choice;
  const layout = line === null ? null : speakerLayout(stage, line.speaker);

  const advance = useCallback(() => {
    dispatch(advanced());
  }, [dispatch]);

  const choose = useCallback(
    (optionId: Scenario.OptionId) => {
      dispatch(optionChosen(optionId));
    },
    [dispatch]
  );

  usePlayerKeys(status === ScenarioRun.Status.Running, {
    onAdvance: isLine ? advance : undefined,
    onChoose: isChoice
      ? (index) => {
          const option = options[index];
          if (option !== undefined) choose(option.id);
        }
      : undefined,
  });

  // Второй клик двойного клика после «Начать» или варианта попадает в уже
  // кликабельную зону и пропустил бы следующую реплику
  const onZoneClick = (event: MouseEvent) => {
    if (event.detail > 1) return;
    advance();
  };

  // Клик по подсказке не должен всплыть в зону и продвинуть сцену дважды
  const onHintClick = (event: MouseEvent) => {
    event.stopPropagation();
    advance();
  };

  const background =
    stage.background === null ? undefined : BACKGROUNDS[stage.background];
  const slots = [
    { side: Character.Side.Left, slot: stage.left },
    { side: Character.Side.Right, slot: stage.right },
  ];

  return (
    <>
      {background !== undefined && <Background src={background.asset} alt="" />}
      <ComicBackdrop variant={BackdropVariant.Scene} />
      <VisuallyHidden role="status">
        {finished && ending !== null ? STAMP_LABELS[ending.status] : ''}
      </VisuallyHidden>
      <Zone $clickable={isLine} onClick={isLine ? onZoneClick : undefined}>
        {slots.map(({ side, slot }) => {
          const src =
            slot === null
              ? undefined
              : CHARACTERS[slot.character].portraits?.[slot.mood];
          if (slot === null || src === undefined) return null;
          return (
            <Slot key={side} $side={side}>
              <CharacterPortrait
                src={src}
                name={CHARACTERS[slot.character].name}
                side={side}
                active={layout?.activeSide === side}
              />
            </Slot>
          );
        })}
        <LiveRegion aria-live="polite">
          {line !== null &&
            layout !== null &&
            (layout.bubbleSide === BubbleSide.Top ? (
              <CaptionAnchor key={`${line.speaker}:${line.text}`}>
                <SpeechBubble
                  side={BubbleSide.Top}
                  name={layout.name}
                  text={line.text}
                />
              </CaptionAnchor>
            ) : (
              <BubbleAnchor
                key={`${line.speaker}:${line.text}`}
                $side={
                  layout.bubbleSide === BubbleSide.Left
                    ? Character.Side.Left
                    : Character.Side.Right
                }
              >
                <SpeechBubble
                  side={layout.bubbleSide}
                  name={layout.name}
                  text={line.text}
                />
              </BubbleAnchor>
            ))}
        </LiveRegion>
        {isChoice && (
          <ChoicesAnchor>
            <ChoiceList
              options={options}
              onChoose={choose}
              remainingMs={nodeRemainingMs ?? undefined}
            />
          </ChoicesAnchor>
        )}
        {isLine && (
          <HintAnchor>
            <Hint type="button" aria-keyshortcuts="Enter" onClick={onHintClick}>
              Далее ▸ Enter
            </Hint>
          </HintAnchor>
        )}
        {children}
      </Zone>
    </>
  );
};
