import { css, styled } from 'styled-components';

import { Course } from '@/types';

export const Root = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ theme }) => theme.report.contentWidth};
  color: ${({ theme }) => theme.colors.ink};
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Kicker = styled.p`
  align-self: flex-start;
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.reportKicker};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.ink};
  transform: rotate(-${({ theme }) => theme.tilts.md});
`;

export const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.reportTitle};
  font-weight: 900;
  line-height: 1.15;
  text-transform: uppercase;
`;

export const Muted = styled.p`
  margin: 0;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Progress = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.buttonMd};
  font-weight: 800;
`;

export const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyMd};
`;

export const ItemHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

export const ItemTitle = styled.h2`
  flex: 1;
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.cardTitle};
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
`;

const badgeColors = {
  [Course.ScenarioStatus.Passed]: css`
    color: ${({ theme }) => theme.colors.onAccent};
    background: ${({ theme }) => theme.colors.accentNavy};
  `,
  [Course.ScenarioStatus.Failed]: css`
    color: ${({ theme }) => theme.colors.onAccent};
    background: ${({ theme }) => theme.colors.accentRed};
  `,
  [Course.ScenarioStatus.NotStarted]: css`
    color: ${({ theme }) => theme.colors.ink};
    background: ${({ theme }) => theme.colors.chipBg};
  `,
};

export const Badge = styled.span<{ $status: Course.ScenarioStatus }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 800;
  text-transform: uppercase;
  border: ${({ theme }) => theme.borders.inkThin};
  ${({ $status }) => badgeColors[$status]}
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;
`;

export const Meta = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;
