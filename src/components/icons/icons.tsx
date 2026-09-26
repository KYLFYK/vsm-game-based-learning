import { styled } from 'styled-components';

const Svg = styled.svg`
  flex-shrink: 0;
  width: ${({ theme }) => theme.stage.iconSize};
  height: ${({ theme }) => theme.stage.iconSize};
  fill: none;
  stroke: currentColor;
  stroke-width: ${({ theme }) => theme.stage.iconStroke};
  stroke-linecap: square;
`;

export const FullscreenEnterIcon = () => (
  <Svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
  </Svg>
);

export const FullscreenExitIcon = () => (
  <Svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" />
  </Svg>
);
