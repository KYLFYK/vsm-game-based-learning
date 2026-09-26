import { styled } from 'styled-components';

import { CardTitle } from '@/components/catalog-card';
import { cardStyles, listReset } from '@/styles/mixins';

export const AchievementGrid = styled.ul`
  ${listReset}
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ theme }) => theme.achievements.cardMinWidth}, 1fr)
  );
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Tooltip = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  bottom: ${({ theme }) => theme.spacing.sm};
  left: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.gameFontSizes.tooltip};
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.onAccent};
  pointer-events: none;
  visibility: hidden;
  background: ${({ theme }) => theme.colors.ink};
  box-shadow: ${({ theme }) => theme.shadows.redSm};
  opacity: 0;
  transition:
    opacity ${({ theme }) => theme.durations.pop}ms,
    visibility ${({ theme }) => theme.durations.pop}ms;
`;

export const Card = styled.li`
  ${cardStyles}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.ink};

  &:hover ${Tooltip}, &:focus-visible ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.borders.focus};
    outline-offset: ${({ theme }) => theme.offsets.focus};
  }
`;

export const Picture = styled.div`
  position: relative;
  aspect-ratio: 1;
  border: ${({ theme }) => theme.borders.inkThin};
`;

export const Image = styled.img<{ $locked: boolean }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: ${({ $locked, theme }) => ($locked ? theme.filters.locked : 'none')};
`;

export const Title = styled(CardTitle)`
  font-size: ${({ theme }) => theme.gameFontSizes.buttonMd};
`;

export const Status = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const HowTo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-top: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border-top: ${({ theme }) => theme.borders.inkThin};
`;

export const HowToLabel = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-weight: 800;
  text-transform: uppercase;
`;
