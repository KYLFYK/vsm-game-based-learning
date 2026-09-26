import { css } from 'styled-components';

/** Список без маркеров и отступов браузера */
export const listReset = css`
  margin: 0;
  padding: 0;
  list-style: none;
`;

/** Карточка на странице: белый фон, чернильная рамка, синяя тень */
export const cardStyles = css`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyMd};
`;

/**
 * Отклик нажимаемой плашки: подъём при наведении, вдавливание при нажатии,
 * фокус-рамка. Тени наведения задаёт сам элемент; миксин ставится после
 * них, чтобы `:active` гасил тень и поверх `:hover`.
 */
export const pressableStyles = css`
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.durations.press}ms,
    box-shadow ${({ theme }) => theme.durations.press}ms;

  &:hover:not(:disabled) {
    transform: ${({ theme }) => theme.offsets.lift};
  }

  &:active:not(:disabled) {
    transform: ${({ theme }) => theme.offsets.press};
    box-shadow: none;
  }

  &:focus-visible {
    outline: ${({ theme }) => theme.borders.focus};
    outline-offset: ${({ theme }) => theme.offsets.focus};
  }
`;
