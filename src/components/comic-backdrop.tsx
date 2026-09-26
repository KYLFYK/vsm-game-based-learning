import { css, styled } from 'styled-components';

import { BackdropVariant } from './comic-backdrop.enums';

const Root = styled.div<{ $variant: BackdropVariant }>`
  position: absolute;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndices.backdrop};
  pointer-events: none;
  background: repeating-conic-gradient(
    from 0deg at 50% 110%,
    ${({ theme }) => theme.colors.raysLight} 0deg 4deg,
    transparent 4deg 12deg
  );
  opacity: ${({ $variant }) => ($variant === BackdropVariant.Scene ? 0.5 : 1)};

  ${({ $variant }) =>
    $variant === BackdropVariant.Intro &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle,
            ${({ theme }) => theme.colors.halftone}
              ${({ theme }) => theme.stage.halftoneDot},
            transparent ${({ theme }) => theme.stage.halftoneFade}
          )
          0 0 / ${({ theme }) => theme.stage.halftoneTile}
          ${({ theme }) => theme.stage.halftoneTile};
        mask-image: linear-gradient(
          120deg,
          transparent 40%,
          ${({ theme }) => theme.colors.ink}
        );
      }
    `}
`;

export const ComicBackdrop = ({ variant }: { variant: BackdropVariant }) => (
  <Root $variant={variant} aria-hidden="true" />
);
