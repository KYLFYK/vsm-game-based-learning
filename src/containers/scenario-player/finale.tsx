import { useNavigate } from 'react-router';

import { styled } from 'styled-components';

import { Button, ButtonSize } from '@/components/button';
import { Stamp } from '@/components/stamp';
import { useCourseParam } from '@/hooks';
import {
  selectAttemptDraft,
  selectEnding,
  useAppSelector,
  useSaveAttemptMutation,
} from '@/store';
import { attemptLink } from '@/utils';

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
  const courseId = useCourseParam();
  const ending = useAppSelector(selectEnding);
  const draft = useAppSelector(selectAttemptDraft);
  const [saveAttempt, { isLoading, isError }] = useSaveAttemptMutation();

  const toReport = async () => {
    if (draft === null) return;
    const result = await saveAttempt(draft);
    if ('error' in result) return;
    // runLeft отработает при размонтировании плеера: сброс до перехода
    // на мгновение показал бы заставку
    await navigate(attemptLink(draft.scenarioId, draft.id, courseId));
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
