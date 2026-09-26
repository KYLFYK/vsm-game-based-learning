import { Link, NavLink, Outlet } from 'react-router';

import { styled } from 'styled-components';

import { APP_NAME } from '@/constants/app';
import { ROUTES } from '@/constants/routes';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const Header = styled.header`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Brand = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: inherit;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavItem = styled(NavLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &[aria-current='page'] {
    color: ${({ theme }) => theme.colors.accentRed};
  }
`;

const Version = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const AppLayout = () => (
  <Root>
    <Header>
      <Brand to={ROUTES.HOME}>{APP_NAME}</Brand>
      <Nav aria-label="Основная навигация">
        <NavItem to={ROUTES.HOME} end>
          Главная
        </NavItem>
        <NavItem to={ROUTES.COURSES}>Курсы</NavItem>
      </Nav>
      <Version>v{__APP_VERSION__}</Version>
    </Header>
    <Main>
      <Outlet />
    </Main>
  </Root>
);
