import { styled } from 'styled-components';

import { stampHit } from '@/styles/animations';
import { Attempt } from '@/types';

const LABELS: Record<Attempt.Status, string> = {
  [Attempt.Status.Passed]: 'Зачтено',
  [Attempt.Status.Failed]: 'Не зачтено',
};

const Root = styled.div`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.stamp};
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accentRed};
  background: ${({ theme }) => theme.colors.paper};
  border: ${({ theme }) => theme.borders.stamp};
  box-shadow: ${({ theme }) => theme.shadows.inkLg};
  transform: rotate(-${({ theme }) => theme.tilts.stamp});
  animation: ${stampHit} ${({ theme }) => theme.durations.stamp}ms ease-in;
`;

export const Stamp = ({ status }: { status: Attempt.Status }) => (
  <Root role="status">{LABELS[status]}</Root>
);
