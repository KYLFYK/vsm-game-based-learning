import { styled } from 'styled-components';

import { stampHit } from '@/styles/animations';
import type { Attempt } from '@/types';

import { STAMP_LABELS } from './stamp.enums';

const Root = styled.div`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.stamp};
  font-weight: 900;
  letter-spacing: ${({ theme }) => theme.stage.stampTracking};
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accentRed};
  background: ${({ theme }) => theme.colors.paper};
  border: ${({ theme }) => theme.borders.stamp};
  box-shadow: ${({ theme }) => theme.shadows.inkLg};
  transform: rotate(-${({ theme }) => theme.tilts.stamp});
  animation: ${stampHit} ${({ theme }) => theme.durations.stamp}ms ease-in;
`;

// Декоративен для скринридеров: итог объявляет постоянная status-область сцены
export const Stamp = ({ status }: { status: Attempt.Status }) => (
  <Root aria-hidden="true">{STAMP_LABELS[status]}</Root>
);
