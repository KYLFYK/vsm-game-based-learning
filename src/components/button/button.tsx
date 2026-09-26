import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import type { To } from 'react-router';

import { styled } from 'styled-components';

import { ButtonSize, ButtonVariant } from './button.enums';
import { buttonStyles } from './button.styles';

import type { ButtonStyleProps } from './button.styles';

const StyledButton = styled.button<ButtonStyleProps>`
  ${buttonStyles}
`;

const StyledLink = styled(Link)<ButtonStyleProps>`
  ${buttonStyles}
`;

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({
  variant = ButtonVariant.Primary,
  size = ButtonSize.Md,
  ...rest
}: ButtonProps) => (
  <StyledButton type="button" $variant={variant} $size={size} {...rest} />
);

interface ButtonLinkProps {
  to: To;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  'aria-label'?: string;
}

export const ButtonLink = ({
  variant = ButtonVariant.Primary,
  size = ButtonSize.Md,
  ...rest
}: ButtonLinkProps) => <StyledLink $variant={variant} $size={size} {...rest} />;
