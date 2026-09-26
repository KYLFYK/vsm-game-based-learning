import type { ReactNode } from 'react';

import { styled } from 'styled-components';

import { listReset } from '@/styles/mixins';

/** Колонка контентной страницы (курс, отчёт) в лейауте приложения */
export const Page = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ theme }) => theme.report.contentWidth};
  color: ${({ theme }) => theme.colors.ink};
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Kicker = styled.p`
  align-self: flex-start;
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.reportKicker};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.ink};
  transform: rotate(-${({ theme }) => theme.tilts.md});
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.reportTitle};
  font-weight: 900;
  line-height: 1.15;
  text-transform: uppercase;
`;

interface PageHeaderProps {
  /** Плашка над заголовком: что за страница */
  kicker: string;
  title: string;
  /** Под заголовком: описание */
  children?: ReactNode;
}

export const PageHeader = ({ kicker, title, children }: PageHeaderProps) => (
  <Header>
    <Kicker>{kicker}</Kicker>
    <PageTitle>{title}</PageTitle>
    {children}
  </Header>
);

/** Вертикальный список карточек страницы */
export const PageList = styled.ol`
  ${listReset}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const PageActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;
