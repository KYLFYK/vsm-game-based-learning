import { styled } from 'styled-components';

import { Character } from '@/types';

const Image = styled.img<{ $mirrored: boolean; $active: boolean }>`
  display: block;
  width: 100%;
  height: auto;
  transform: ${({ $mirrored }) => ($mirrored ? 'scaleX(-1)' : 'none')};
  filter: ${({ $active, theme }) => ($active ? 'none' : theme.filters.dimmed)};
`;

interface CharacterPortraitProps {
  src: string;
  name: string;
  side: Character.Side;
  active: boolean;
}

export const CharacterPortrait = ({
  src,
  name,
  side,
  active,
}: CharacterPortraitProps) => (
  <Image
    src={src}
    alt={name}
    $mirrored={side === Character.Side.Left}
    $active={active}
  />
);
