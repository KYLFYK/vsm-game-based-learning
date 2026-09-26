import { BrowserRouter, Route, Routes } from 'react-router';

import { ThemeProvider } from 'styled-components';

import { ROUTES } from '@/constants/routes';
import { AppLayout } from '@/containers/layout/app-layout';
import { AchievementsPage } from '@/pages/achievements';
import { CoursePage } from '@/pages/course';
import { CoursesPage } from '@/pages/courses';
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
          <Route path={ROUTES.COURSES} element={<CoursesPage />} />
          <Route path={ROUTES.COURSE} element={<CoursePage />} />
          <Route
            path={ROUTES.SCENARIO_ATTEMPT}
            element={<ScenarioAttemptPage />}
          />
          <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
        </Route>
        <Route path={ROUTES.SCENARIO} element={<ScenarioPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
