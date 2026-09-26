import { styled } from 'styled-components';

import { Character } from '@/types';

/** Корень игрового экрана: всё окно, без лейаута приложения */
export const Screen = styled.div`
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.accentNavy};
`;

export const Message = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndices.hud};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.stage.introPadding};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.introText};
  font-weight: 800;
`;

export const Background = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/** Игровая зона 16:9; размеры внутри — в cqw/cqh */
export const Zone = styled.div<{ $clickable: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndices.slots};
  width: ${({ theme }) => theme.stage.zoneWidth};
  height: ${({ theme }) => theme.stage.zoneHeight};
  container-type: size;
  transform: translate(-50%, -50%);
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
`;

export const Slot = styled.div<{ $side: Character.Side }>`
  position: absolute;
  bottom: 0;
  ${({ $side, theme }) =>
    $side === Character.Side.Left
      ? `left: ${theme.stage.slotInset};`
      : `right: ${theme.stage.slotInset};`}
  z-index: ${({ theme }) => theme.zIndices.slots};
  width: ${({ theme }) => theme.stage.slotWidth};
`;

/** Живая область реплик: пропускает клики к зоне */
export const LiveRegion = styled.div`
  position: absolute;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndices.bubble};
  pointer-events: none;
`;

export const BubbleAnchor = styled.div<{ $side: Character.Side }>`
  position: absolute;
  top: ${({ theme }) => theme.stage.bubbleTop};
  ${({ $side, theme }) =>
    $side === Character.Side.Left
      ? `left: ${theme.stage.bubbleOffset};`
      : `right: ${theme.stage.bubbleOffset};`}
  max-width: ${({ theme }) => theme.stage.bubbleMaxWidth};
`;

export const CaptionAnchor = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.stage.captionTop};
  left: 50%;
  width: max-content;
  max-width: ${({ theme }) => theme.stage.captionMaxWidth};
  transform: translateX(-50%);
`;

export const ChoicesAnchor = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.stage.choicesBottom};
  left: 50%;
  z-index: ${({ theme }) => theme.zIndices.choices};
  width: ${({ theme }) => theme.stage.choicesWidth};
  transform: translateX(-50%);
`;

export const HintAnchor = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.stage.hintInset};
  bottom: ${({ theme }) => theme.stage.choicesBottom};
  z-index: ${({ theme }) => theme.zIndices.choices};
`;

/** Подсказка «Далее»: чёрная плашка с красной тенью, не вариант `Button` */
export const Hint = styled.button`
  height: ${({ theme }) => theme.stage.iconButton};
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.buttonSm};
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.ink};
  border: ${({ theme }) => theme.borders.ink};
  border-radius: 0;
  box-shadow: ${({ theme }) => theme.shadows.redSm};
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.durations.press}ms,
    box-shadow ${({ theme }) => theme.durations.press}ms;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.redMd};
    transform: ${({ theme }) => theme.offsets.lift};
  }

  &:active {
    box-shadow: none;
    transform: ${({ theme }) => theme.offsets.press};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.borders.focus};
    outline-offset: ${({ theme }) => theme.offsets.focus};
  }
`;

export const StampAnchor = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.stage.stampBottom};
  left: 50%;
  z-index: ${({ theme }) => theme.zIndices.stamp};
  transform: translateX(-50%);
`;

export const ActionsAnchor = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.stage.actionsBottom};
  left: 50%;
  z-index: ${({ theme }) => theme.zIndices.choices};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transform: translateX(-50%);
`;
