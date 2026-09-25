import { Outlet } from 'react-router';

import { styled } from 'styled-components';

import { APP_NAME } from '@/constants/app';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`;

const Header = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Brand = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
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
      <Brand>{APP_NAME}</Brand>
      <Version>v{__APP_VERSION__}</Version>
    </Header>
    <Main>
      <Outlet />
    </Main>
  </Root>
);
