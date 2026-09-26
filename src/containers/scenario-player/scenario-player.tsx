import { useEffect } from 'react';
import { Link, useParams } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks';
import { runLeft, useAppDispatch, useGetScenarioQuery } from '@/store';

export const ScenarioPlayer = () => {
  const { scenarioId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { data: scenario, isLoading } = useGetScenarioQuery(scenarioId);

  useDocumentTitle(scenario?.title ?? 'Сценарий');

  useEffect(
    () => () => {
      dispatch(runLeft());
    },
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- scenarioId нужен, чтобы смена сценария без размонтирования тоже сбрасывала попытку
    [dispatch, scenarioId]
  );

  if (isLoading) return <p>Загрузка…</p>;
  if (scenario === undefined) {
    return (
      <p>
        Сценарий не найден. <Link to={ROUTES.HOME}>К сценариям</Link>
      </p>
    );
  }
  return <h1>{scenario.title}</h1>;
};
