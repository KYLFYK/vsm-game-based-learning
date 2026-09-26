import { styled } from 'styled-components';

import { popIn } from '@/styles/animations';

import { BubbleSide } from './speech-bubble.enums';

type CharacterSide = BubbleSide.Left | BubbleSide.Right;

const Bubble = styled.div<{ $side: CharacterSide }>`
  position: relative;
  /* Снизу запас под именную плашку: она заходит на облако и не должна
     перекрывать текст */
  padding: ${({ theme }) =>
    `${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.xl}`};
  font-size: ${({ theme }) => theme.gameFontSizes.text};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.bubbleText};
  background: ${({ theme }) => theme.colors.bubbleBg};
  border: ${({ theme }) => theme.borders.ink};
  border-radius: ${({ $side, theme }) => {
    const { bubble, bubbleCorner } = theme.radii;
    return $side === BubbleSide.Right
      ? `${bubble} ${bubble} ${bubbleCorner} ${bubble}`
      : `${bubble} ${bubble} ${bubble} ${bubbleCorner}`;
  }};
  filter: ${({ theme }) => theme.shadows.redDrop};
  transform: rotate(-${({ theme }) => theme.tilts.sm});
  animation: ${popIn} ${({ theme }) => theme.durations.pop}ms ease-out;
`;

const NamePlate = styled.span<{ $side: CharacterSide }>`
  position: absolute;
  bottom: ${({ theme }) => theme.stage.namePlateDrop};
  ${({ $side, theme }) =>
    $side === BubbleSide.Right
      ? `right: ${theme.stage.namePlateOffset};`
      : `left: ${theme.stage.namePlateOffset};`}
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.name};
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.accentNavy};
  border: ${({ theme }) => theme.borders.inkThin};
  transform: rotate(-${({ theme }) => theme.tilts.plate});
`;

const Caption = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  font-size: ${({ theme }) => theme.gameFontSizes.text};
  line-height: 1.4;
  text-align: center;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.accentNavy};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.redMd};
  transform: rotate(-${({ theme }) => theme.tilts.sm});
  animation: ${popIn} ${({ theme }) => theme.durations.pop}ms ease-out;
`;

const CaptionName = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.name};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.paper};
`;

interface SpeechBubbleProps {
  side: BubbleSide;
  name?: string;
  text: string;
}

export const SpeechBubble = ({ side, name, text }: SpeechBubbleProps) => {
  if (side === BubbleSide.Top) {
    return (
      <Caption>
        {name !== undefined && <CaptionName>{name}</CaptionName>}
        {text}
      </Caption>
    );
  }
  return (
    <Bubble $side={side}>
      {text}
      {name !== undefined && <NamePlate $side={side}>{name}</NamePlate>}
    </Bubble>
  );
};
