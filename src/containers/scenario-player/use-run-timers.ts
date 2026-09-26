import { useEffect, useRef, useState } from 'react';

import {
  expired,
  selectDeadlines,
  selectRunStatus,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import type { Deadlines } from '@/store';
import { ScenarioRun } from '@/types';

/** Частота пересчёта остатка времени, мс — см. docs/specs/scenario-engine/engine.md. */
export const TICK_MS = 250;

export interface RunTimers {
  scenarioRemainingMs: number | null;
  nodeRemainingMs: number | null;
}

const remainingOf = (deadlineAt: number | null): number | null =>
  deadlineAt === null ? null : Math.max(0, deadlineAt - Date.now());

const remainingOfDeadlines = ({
  scenarioDeadlineAt,
  nodeDeadlineAt,
}: Deadlines): RunTimers => ({
  scenarioRemainingMs: remainingOf(scenarioDeadlineAt),
  nodeRemainingMs: remainingOf(nodeDeadlineAt),
});

/**
 * Остаток времени сценария и узла, производный от дедлайнов слайса
 * `scenarioRun`. Тикает раз в `TICK_MS`, пока попытка идёт и хотя бы один
 * дедлайн задан; при достижении нуля диспатчит `expired()`.
 */
export const useRunTimers = (): RunTimers => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectRunStatus);
  const { scenarioDeadlineAt, nodeDeadlineAt } =
    useAppSelector(selectDeadlines);

  const active =
    status === ScenarioRun.Status.Running &&
    (scenarioDeadlineAt !== null || nodeDeadlineAt !== null);

  const deadlinesRef = useRef<Deadlines>({
    scenarioDeadlineAt,
    nodeDeadlineAt,
  });

  const [timers, setTimers] = useState<RunTimers>(() =>
    remainingOfDeadlines({ scenarioDeadlineAt, nodeDeadlineAt })
  );

  // Пересчёт сразу при смене дедлайнов (вход в другой узел), чтобы UI не
  // ждал до TICK_MS следующего тика; интервал их не перезапускает, поэтому
  // актуальные значения кладём в реф здесь же, а не мутируем его при рендере.
  useEffect(() => {
    deadlinesRef.current = { scenarioDeadlineAt, nodeDeadlineAt };
    setTimers(remainingOfDeadlines(deadlinesRef.current));
  }, [scenarioDeadlineAt, nodeDeadlineAt]);

  useEffect(() => {
    if (!active) return undefined;

    // Интервал живёт, пока активна попытка с дедлайном; сами дедлайны
    // читаются из рефа, чтобы их смена не пересоздавала интервал.
    const id = setInterval(() => {
      const next = remainingOfDeadlines(deadlinesRef.current);
      setTimers(next);
      if (next.scenarioRemainingMs === 0 || next.nodeRemainingMs === 0) {
        dispatch(expired());
      }
    }, TICK_MS);

    return () => clearInterval(id);
  }, [active, dispatch]);

  return timers;
};
