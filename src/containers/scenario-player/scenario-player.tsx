import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import {
  BackdropVariant,
  ButtonLink,
  ButtonSize,
  ButtonVariant,
  ComicBackdrop,
} from '@/components';
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
  const { data: scenario, isLoading } = useGetScenarioQuery(scenarioId);
  const { scenarioRemainingMs, nodeRemainingMs } = useRunTimers();

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
          courseId: searchParams.get('course') ?? undefined,
        })
      );
    };
    return <Intro scenario={scenario} onStart={start} />;
  }

  // Курсы появятся на этапе 6; до них выход ведёт в каталог на главной
  const exit = () => {
    if (!window.confirm(EXIT_CONFIRM)) return;
    void navigate(ROUTES.HOME);
  };

  return (
    <Screen>
      <Scene nodeRemainingMs={nodeRemainingMs} />
      <Hud scenarioRemainingMs={scenarioRemainingMs} onExit={exit} />
    </Screen>
  );
};
