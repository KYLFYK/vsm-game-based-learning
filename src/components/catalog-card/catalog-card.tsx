import type { ReactNode } from 'react';

import { styled } from 'styled-components';

import { MutedText } from '@/components/muted-text';
import { cardStyles, listReset } from '@/styles/mixins';

export const CatalogGrid = styled.ul`
  ${listReset}
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.li`
  ${cardStyles}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: ${({ theme }) => theme.stage.cardWidth};
  color: ${({ theme }) => theme.colors.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyLg};
`;

/** Заголовок карточки; уровень задаёт страница через `as` */
export const CardTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.cardTitle};
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Meta = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.buttonSm};
  font-weight: 800;
`;

interface CatalogCardProps {
  title: string;
  /** Уровень заголовка по месту карточки в структуре страницы */
  heading: 'h2' | 'h3';
  description: string;
  /** Подпись в подвале слева от действия: длительность, прогресс */
  meta: ReactNode;
  action: ReactNode;
  /** Между описанием и подвалом: теги */
  children?: ReactNode;
}

/** Карточка в сетке каталога (`CatalogGrid`): курс или сценарий */
export const CatalogCard = ({
  title,
  heading,
  description,
  meta,
  action,
  children,
}: CatalogCardProps) => (
  <Card>
    <CardTitle as={heading}>{title}</CardTitle>
    <MutedText>{description}</MutedText>
    {children}
    <Footer>
      <Meta>{meta}</Meta>
      {action}
    </Footer>
  </Card>
);
