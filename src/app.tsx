import { BrowserRouter, Route, Routes } from 'react-router';

import { ThemeProvider } from 'styled-components';

import { ROUTES } from '@/constants/routes';
import { AppLayout } from '@/containers/layout/app-layout';
import { HomePage } from '@/pages/home';
import { ScenarioPage } from '@/pages/scenario';
import { ScenarioAttemptPage } from '@/pages/scenario-attempt';
import { GlobalStyle } from '@/styles/global-style';
import { theme } from '@/styles/theme';

export const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path={ROUTES.SCENARIO_ATTEMPT}
            element={<ScenarioAttemptPage />}
          />
        </Route>
        <Route path={ROUTES.SCENARIO} element={<ScenarioPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
