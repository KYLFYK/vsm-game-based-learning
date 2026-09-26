import { css } from 'styled-components';

import { TagTone } from './tag.enums';

export const toneStyles = {
  [TagTone.Neutral]: css`
    color: ${({ theme }) => theme.colors.ink};
    background: ${({ theme }) => theme.colors.chipBg};
  `,
  [TagTone.Navy]: css`
    color: ${({ theme }) => theme.colors.onAccent};
    background: ${({ theme }) => theme.colors.accentNavy};
  `,
  [TagTone.Red]: css`
    color: ${({ theme }) => theme.colors.onAccent};
    background: ${({ theme }) => theme.colors.accentRed};
  `,
};
