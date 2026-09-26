import { styled } from 'styled-components';

import { MutedText } from '@/components/muted-text';
import { Stamp, STAMP_LABELS } from '@/components/stamp';
import { VisuallyHidden } from '@/components/visually-hidden';
import { cardStyles } from '@/styles/mixins';
import type { Attempt, Report } from '@/types';
import { attemptDuration, formatRemaining } from '@/utils';

import { Section, SectionTitle } from './scenario-report.styles';

const Body = styled.div`
  ${cardStyles}
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;
`;

const Summary = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Reason = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 700;
`;

const Figures = styled.dl`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  margin: 0;
`;

const Figure = styled.div`
  display: flex;
  flex-direction: column;
`;

const FigureLabel = styled.dt`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FigureValue = styled.dd`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.reportScore};
  font-weight: 800;
`;

interface OutcomeSectionProps {
  report: Report.Item;
  attempt: Attempt.Item;
}

export const OutcomeSection = ({ report, attempt }: OutcomeSectionProps) => (
  <Section aria-labelledby="report-outcome">
    <SectionTitle id="report-outcome">Итог</SectionTitle>
    <Body>
      <Stamp status={report.outcome.status} />
      <Summary>
        <Reason>
          <VisuallyHidden>
            {STAMP_LABELS[report.outcome.status]}.{' '}
          </VisuallyHidden>
          {report.outcome.text}
        </Reason>
        <Figures>
          {report.score !== null && (
            <Figure>
              <FigureLabel>Балл</FigureLabel>
              <FigureValue>{report.score}</FigureValue>
            </Figure>
          )}
          <Figure>
            <FigureLabel>Время</FigureLabel>
            <FigureValue>
              {formatRemaining(attemptDuration(attempt))}
            </FigureValue>
          </Figure>
        </Figures>
        {report.versionMismatch && (
          <MutedText>
            Сценарий обновился после этой попытки, поэтому разбор решений
            недоступен. Итог и шкалы показаны как были.
          </MutedText>
        )}
      </Summary>
    </Body>
  </Section>
);
