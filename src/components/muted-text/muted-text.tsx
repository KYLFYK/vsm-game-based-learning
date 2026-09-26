import { styled } from 'styled-components';

/** Второстепенный абзац: описание, пояснение, состояние загрузки */
export const MutedText = styled.p`
  margin: 0;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const LoadingText = () => <MutedText>Загрузка…</MutedText>;
