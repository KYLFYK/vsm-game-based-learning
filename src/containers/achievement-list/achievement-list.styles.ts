import { styled } from 'styled-components';

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`;
