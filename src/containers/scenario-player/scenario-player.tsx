import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { ButtonLink, ButtonSize, ButtonVariant } from '@/components/button';
import { BackdropVariant, ComicBackdrop } from '@/components/comic-backdrop';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks';
import {
  runLeft,
  runStarted,
  selectRunStatus,
  useAppDispatch,
  useAppSelector,
  useGetScenarioQuery,
} from '@/store';
import { ScenarioRun } from '@/types';
import { courseLink } from '@/utils';

import { Finale } from './finale';
import { Hud } from './hud';
import { Intro } from './intro';
import { Message, Screen } from './scenario-player.styles';
import { Scene } from './scene';
import { useRunTimers } from './use-run-timers';

const EXIT_CONFIRM = 'Попытка не сохранится. Выйти?';

export const ScenarioPlayer = () => {
  const { scenarioId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectRunStatus);
  // currentData, а не data: при смене scenarioId data держит прошлый сценарий
  const { currentData: scenario, isFetching } = useGetScenarioQuery(scenarioId);
  const isLoading = scenario === undefined && isFetching;
  const { scenarioRemainingMs, nodeRemainingMs } = useRunTimers();
  const courseId = searchParams.get('course');
  const back =
    courseId === null
      ? { to: ROUTES.HOME, label: 'К сценариям' }
      : { to: courseLink(courseId), label: 'К курсу' };

  useDocumentTitle(scenario?.title ?? 'Сценарий');

  useEffect(
    () => () => {
      dispatch(runLeft());
    },
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- scenarioId нужен, чтобы смена сценария без размонтирования тоже сбрасывала попытку
    [dispatch, scenarioId]
  );

  if (isLoading || scenario === undefined) {
    return (
      <Screen>
        <ComicBackdrop variant={BackdropVariant.Intro} />
        <Message>
          {isLoading ? (
            'Загрузка…'
          ) : (
            <>
              Сценарий не найден
              <ButtonLink
                to={ROUTES.HOME}
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Md}
              >
                К сценариям
              </ButtonLink>
            </>
          )}
        </Message>
      </Screen>
    );
  }

  if (status === ScenarioRun.Status.Idle) {
    const start = () => {
      dispatch(
        runStarted({
          scenario,
          courseId: courseId ?? undefined,
        })
      );
    };
    return <Intro scenario={scenario} back={back} onStart={start} />;
  }

  const exit = () => {
    if (!window.confirm(EXIT_CONFIRM)) return;
    void navigate(back.to);
  };

  return (
    <Screen>
      <Scene nodeRemainingMs={nodeRemainingMs}>
        {status === ScenarioRun.Status.Finished && <Finale />}
      </Scene>
      <Hud scenarioRemainingMs={scenarioRemainingMs} onExit={exit} />
    </Screen>
  );
};
