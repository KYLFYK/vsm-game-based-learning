import { css } from 'styled-components';

import { ButtonSize, ButtonVariant } from './button.enums';

export interface ButtonStyleProps {
  $variant: ButtonVariant;
  $size: ButtonSize;
}

const sizes = {
  [ButtonSize.Sm]: css`
    min-width: ${({ theme }) => theme.stage.iconButton};
    height: ${({ theme }) => theme.stage.iconButton};
    padding: 0 ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.gameFontSizes.buttonSm};
  `,
  [ButtonSize.Md]: css`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.gameFontSizes.buttonMd};
  `,
  [ButtonSize.Lg]: css`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: ${({ theme }) => theme.gameFontSizes.buttonLg};
  `,
};

const variants = {
  [ButtonVariant.Primary]: css`
    color: ${({ theme }) => theme.colors.onAccent};
    background: ${({ theme }) => theme.colors.accentRed};
    box-shadow: ${({ theme }) => theme.shadows.navyMd};

    &:hover:not(:disabled) {
      box-shadow: ${({ theme }) => theme.shadows.navyLg};
    }
  `,
  [ButtonVariant.Secondary]: css`
    color: ${({ theme }) => theme.colors.ink};
    background: ${({ theme }) => theme.colors.bgBase};
    box-shadow: ${({ theme }) => theme.shadows.navySm};

    &:hover:not(:disabled) {
      box-shadow: ${({ theme }) => theme.shadows.navyMd};
    }
  `,
};

export const buttonStyles = css<ButtonStyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  border: ${({ theme }) => theme.borders.ink};
  border-radius: 0;
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.durations.press}ms,
    box-shadow ${({ theme }) => theme.durations.press}ms;

  ${({ $size }) => sizes[$size]}
  ${({ $variant }) => variants[$variant]}

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

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;
