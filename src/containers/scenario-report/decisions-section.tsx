import { styled } from 'styled-components';

import { MutedText } from '@/components/muted-text';
import { PageList } from '@/components/page';
import { Badge, TagList } from '@/components/tag';
import { cardStyles } from '@/styles/mixins';
import type { Report } from '@/types';
import { topicLabel } from '@/utils';

import {
  meterEffectLabels,
  speakerName,
  VERDICT_LABELS,
  VERDICT_TONES,
} from './report-view';
import { Section, SectionTitle } from './scenario-report.styles';

const Item = styled.li`
  ${cardStyles}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Head = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  justify-content: space-between;
`;

const Index = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.buttonSm};
  font-weight: 800;
  text-transform: uppercase;
`;

const VerdictBadge = styled(Badge)`
  transform: rotate(-${({ theme }) => theme.tilts.sm});
`;

const Question = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Chosen = styled.p`
  margin: 0;
  font-weight: 700;
`;

const Better = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.paper};
  border: ${({ theme }) => theme.borders.inkThin};
`;

const BetterTitle = styled.p`
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accentNavy};
`;

interface DecisionsSectionProps {
  decisions: Report.Decision[];
  meters: Report.Meter[];
  versionMismatch: boolean;
}

export const DecisionsSection = ({
  decisions,
  meters,
  versionMismatch,
}: DecisionsSectionProps) => {
  if (versionMismatch || decisions.length === 0) return null;
  const meterLabels = Object.fromEntries(
    meters.map((meter) => [meter.id, meter.label])
  );

  return (
    <Section aria-labelledby="report-decisions">
      <SectionTitle id="report-decisions">Разбор решений</SectionTitle>
      <PageList>
        {decisions.map((decision) => {
          const tags = meterEffectLabels(decision.effects, meterLabels);
          if (decision.topic !== undefined)
            tags.push(topicLabel(decision.topic));
          const speaker = speakerName(decision.speaker);
          return (
            <Item key={decision.index}>
              <Head>
                <Index>Решение {decision.index + 1}</Index>
                <VerdictBadge $tone={VERDICT_TONES[decision.verdict]}>
                  {VERDICT_LABELS[decision.verdict]}
                </VerdictBadge>
              </Head>
              <Question>
                {speaker === null ? '' : `${speaker}: `}
                {decision.question}
              </Question>
              <Chosen>Ваш ответ: {decision.chosen}</Chosen>
              <MutedText>{decision.explanation}</MutedText>
              {tags.length > 0 && (
                <TagList tags={tags} aria-label="Изменения шкал и тема" />
              )}
              {decision.better !== undefined && (
                <Better>
                  <BetterTitle>
                    Лучше было бы: {decision.better.text}
                  </BetterTitle>
                  <MutedText>{decision.better.explanation}</MutedText>
                </Better>
              )}
            </Item>
          );
        })}
      </PageList>
    </Section>
  );
};
