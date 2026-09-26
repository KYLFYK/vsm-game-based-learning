import { Link } from 'react-router';

import { styled } from 'styled-components';

import { STAMP_LABELS } from '@/components/stamp';
import { Attempt } from '@/types';
import type { Course } from '@/types';
import { attemptLink, formatDateTime, formatRemaining } from '@/utils';

const Details = styled.details`
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: ${({ theme }) => theme.borders.inkThin};
`;

const Summary = styled.summary`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.buttonSm};
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;

  & th,
  & td {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    text-align: left;
    border-bottom: ${({ theme }) =>
      `${theme.report.hairline} solid ${theme.colors.border}`};
  }

  & th {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Result = styled.td<{ $passed: boolean }>`
  font-weight: 700;
  color: ${({ theme, $passed }) =>
    $passed ? theme.colors.accentNavy : theme.colors.accentRed};
`;

const Best = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 700;
  background: ${({ theme }) => theme.colors.chipBg};
  border: ${({ theme }) => theme.borders.inkThin};
`;

const ReportLink = styled(Link)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

interface AttemptHistoryProps {
  /** Попытки одного сценария, новые первыми */
  attempts: Attempt.Item[];
  bestId: Attempt.Id | null;
  courseId: Course.Id;
}

export const AttemptHistory = ({
  attempts,
  bestId,
  courseId,
}: AttemptHistoryProps) => {
  if (attempts.length === 0) return null;
  return (
    <Details>
      <Summary>История попыток ({attempts.length})</Summary>
      <Table>
        <thead>
          <tr>
            <th scope="col">Когда</th>
            <th scope="col">Итог</th>
            <th scope="col">Балл</th>
            <th scope="col">Время</th>
            <th scope="col">Отчёт</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt) => (
            <tr key={attempt.id}>
              <td>
                {formatDateTime(attempt.finishedAt)}{' '}
                {attempt.id === bestId && <Best>Лучшая</Best>}
              </td>
              <Result $passed={attempt.status === Attempt.Status.Passed}>
                {STAMP_LABELS[attempt.status]}
              </Result>
              <td>{attempt.score ?? '—'}</td>
              <td>{formatRemaining(attempt.finishedAt - attempt.startedAt)}</td>
              <td>
                <ReportLink
                  to={attemptLink(attempt.scenarioId, attempt.id, courseId)}
                >
                  Открыть ▸
                </ReportLink>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Details>
  );
};
