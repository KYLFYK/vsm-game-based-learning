import { styled } from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Tab = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.tab};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ink};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  border-radius: 0;
  box-shadow: ${({ theme }) => theme.shadows.navySm};
  transition: transform ${({ theme }) => theme.durations.press}ms;

  &:hover:not([aria-selected='true']) {
    transform: ${({ theme }) => theme.offsets.lift};
  }

  &[aria-selected='true'] {
    color: ${({ theme }) => theme.colors.onAccent};
    cursor: default;
    background: ${({ theme }) => theme.colors.accentNavy};
    box-shadow: ${({ theme }) => theme.shadows.redSm};
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.borders.focus};
    outline-offset: ${({ theme }) => theme.offsets.focus};
  }
`;
