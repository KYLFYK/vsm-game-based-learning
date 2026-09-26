import { styled } from 'styled-components';

import { CardTitle } from '@/components/catalog-card';
import { Badge } from '@/components/tag';
import { cardStyles } from '@/styles/mixins';

export const Progress = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.buttonMd};
  font-weight: 800;
`;

export const Item = styled.li`
  ${cardStyles}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ItemHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

export const ItemTitle = styled(CardTitle)`
  flex: 1;
`;

export const StatusBadge = styled(Badge)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
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
