import { styled } from 'styled-components';

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
