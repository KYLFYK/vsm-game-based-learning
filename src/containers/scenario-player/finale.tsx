import {
  createSearchParams,
  generatePath,
  useNavigate,
  useSearchParams,
} from 'react-router';

import { styled } from 'styled-components';

import { Button, ButtonSize } from '@/components/button';
import { Stamp } from '@/components/stamp';
import { ROUTES } from '@/constants/routes';
import {
  selectAttemptDraft,
  selectEnding,
  useAppSelector,
  useSaveAttemptMutation,
} from '@/store';

import { ActionsAnchor, StampAnchor } from './scenario-player.styles';
import { usePlayerKeys } from './use-player-keys';

// Под кнопкой, вне потока: кнопка не сдвигается вверх и не уходит под штамп
const SaveError = styled.p`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.md});
  left: 50%;
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onAccent};
  white-space: nowrap;
  background: ${({ theme }) => theme.colors.ink};
  transform: translateX(-50%);
`;

export const Finale = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ending = useAppSelector(selectEnding);
  const draft = useAppSelector(selectAttemptDraft);
  const [saveAttempt, { isLoading, isError }] = useSaveAttemptMutation();

  const toReport = async () => {
    if (draft === null) return;
    const result = await saveAttempt(draft);
    if ('error' in result) return;
    const pathname = generatePath(ROUTES.SCENARIO_ATTEMPT, {
      scenarioId: draft.scenarioId,
      attemptId: draft.id,
    });
    const course = searchParams.get('course');
    // runLeft отработает при размонтировании плеера: сброс до перехода
    // на мгновение показал бы заставку
    await navigate(
      course === null
        ? pathname
        : { pathname, search: createSearchParams({ course }).toString() }
    );
  };

  // Без автофокуса на кнопке: keyup пробела нажал бы только что
  // сфокусированную кнопку; Enter/Space ловит сам плеер
  usePlayerKeys(true, {
    onAdvance: () => {
      if (!isLoading) void toReport();
    },
  });

  if (ending === null) return null;

  return (
    <>
      <StampAnchor>
        <Stamp status={ending.status} />
      </StampAnchor>
      <ActionsAnchor>
        <Button
          size={ButtonSize.Lg}
          disabled={isLoading}
          onClick={() => {
            void toReport();
          }}
        >
          {isError ? 'Повторить' : 'К отчёту ▸'}
        </Button>
        {isError && (
          <SaveError role="alert">Не удалось сохранить попытку</SaveError>
        )}
      </ActionsAnchor>
    </>
  );
};
