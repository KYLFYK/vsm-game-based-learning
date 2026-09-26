import { styled } from 'styled-components';

import { listReset } from '@/styles/mixins';

import { TagTone } from './tag.enums';
import { toneStyles } from './tag.styles';

/** Плашка-метка: тема, изменение шкалы, итог; `$tone` — цвет по смыслу */
export const Tag = styled.span<{ $tone?: TagTone }>`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 700;
  border: ${({ theme }) => theme.borders.inkThin};
  ${({ $tone = TagTone.Neutral }) => toneStyles[$tone]}
`;

/** Метка-статус: та же плашка акцидентным шрифтом капсом */
export const Badge = styled(Tag)`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-weight: 800;
  text-transform: uppercase;
`;

const List = styled.ul`
  ${listReset}
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

interface TagListProps {
  tags: string[];
  'aria-label'?: string;
}

/** Строка нейтральных меток; метки могут повторяться, поэтому ключ — позиция */
export const TagList = ({ tags, 'aria-label': label }: TagListProps) => (
  <List aria-label={label}>
    {tags.map((tag, index) => (
      <Tag key={index} as="li">
        {tag}
      </Tag>
    ))}
  </List>
);
