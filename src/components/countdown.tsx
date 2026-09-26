import { css, styled } from 'styled-components';

import { pulse } from '@/styles/animations';
import { formatRemaining } from '@/utils';

import { CountdownSize } from './countdown.enums';

const COUNTDOWN_HOT_MS = 10_000;

const Root = styled.span<{ $size: CountdownSize; $hot: boolean }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ $size, theme }) =>
    $size === CountdownSize.Hud
      ? theme.gameFontSizes.timerHud
      : theme.gameFontSizes.timerInline};
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.accentNavy};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.redMd};
  transform: rotate(${({ theme }) => theme.tilts.md});

  ${({ $hot }) =>
    $hot &&
    css`
      background: ${({ theme }) => theme.colors.accentRed};
      box-shadow: ${({ theme }) => theme.shadows.navyMd};
      animation: ${pulse} ${({ theme }) => theme.durations.pulse / 2}ms
        ease-in-out infinite alternate;
    `}
`;

interface CountdownProps {
  remainingMs: number;
  size: CountdownSize;
}

export const Countdown = ({ remainingMs, size }: CountdownProps) => (
  <Root
    role="timer"
    aria-label="Осталось времени"
    $size={size}
    $hot={remainingMs < COUNTDOWN_HOT_MS}
  >
    {formatRemaining(remainingMs)}
  </Root>
);
