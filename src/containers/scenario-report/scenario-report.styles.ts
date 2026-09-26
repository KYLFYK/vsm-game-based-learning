import { css, styled } from 'styled-components';

export const Root = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ theme }) => theme.report.contentWidth};
  color: ${({ theme }) => theme.colors.ink};
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

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.reportSection};
  font-weight: 800;
  text-transform: uppercase;
`;

export const cardStyles = css`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyMd};
`;

export const Card = styled.div`
  ${cardStyles}
`;

export const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Tag = styled.li`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 700;
  background: ${({ theme }) => theme.colors.chipBg};
  border: ${({ theme }) => theme.borders.inkThin};
`;

export const Muted = styled.p`
  margin: 0;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;
