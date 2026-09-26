import {
  createSearchParams,
  generatePath,
  useNavigate,
  useSearchParams,
} from 'react-router';

import { styled } from 'styled-components';

import { Button, ButtonSize, Stamp } from '@/components';
import { ROUTES } from '@/constants/routes';
import {
  selectAttemptDraft,
  selectEnding,
  useAppSelector,
  useSaveAttemptMutation,
} from '@/store';

import { ActionsAnchor, StampAnchor } from './scenario-player.styles';

const SaveError = styled.p`
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ theme }) => theme.colors.ink};
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

  if (ending === null) return null;

  return (
    <>
      <StampAnchor>
        <Stamp status={ending.status} />
      </StampAnchor>
      <ActionsAnchor>
        {isError && (
          <SaveError role="alert">Не удалось сохранить попытку</SaveError>
        )}
        <Button
          size={ButtonSize.Lg}
          disabled={isLoading}
          onClick={() => {
            void toReport();
          }}
        >
          {isError ? 'Повторить' : 'К отчёту ▸'}
        </Button>
      </ActionsAnchor>
    </>
  );
};
