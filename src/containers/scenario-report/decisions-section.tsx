import { styled } from 'styled-components';

import { TOPICS } from '@/constants/topics';
import { Scenario } from '@/types';
import type { Report } from '@/types';

import { meterEffectLabels, speakerName, VERDICT_LABELS } from './report-view';
import {
  cardStyles,
  List,
  Muted,
  Section,
  SectionTitle,
  Tag,
  Tags,
} from './scenario-report.styles';

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

const Badge = styled.span<{ $verdict: Scenario.Verdict }>`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ $verdict, theme }) =>
    $verdict === Scenario.Verdict.Ok
      ? theme.colors.ink
      : theme.colors.onAccent};
  background: ${({ $verdict, theme }) =>
    ({
      [Scenario.Verdict.Best]: theme.colors.accentNavy,
      [Scenario.Verdict.Ok]: theme.colors.chipBg,
      [Scenario.Verdict.Bad]: theme.colors.accentRed,
    })[$verdict]};
  border: ${({ theme }) => theme.borders.inkThin};
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
      <List>
        {decisions.map((decision) => {
          const effects = meterEffectLabels(decision.effects, meterLabels);
          const speaker = speakerName(decision.speaker);
          return (
            <Item key={decision.index}>
              <Head>
                <Index>Решение {decision.index + 1}</Index>
                <Badge $verdict={decision.verdict}>
                  {VERDICT_LABELS[decision.verdict]}
                </Badge>
              </Head>
              <Question>
                {speaker === null ? '' : `${speaker}: `}
                {decision.question}
              </Question>
              <Chosen>Ваш ответ: {decision.chosen}</Chosen>
              <Muted>{decision.explanation}</Muted>
              {(effects.length > 0 || decision.topic !== undefined) && (
                <Tags aria-label="Изменения шкал и тема">
                  {effects.map((effect, index) => (
                    <Tag key={index}>{effect}</Tag>
                  ))}
                  {decision.topic !== undefined && (
                    <Tag>{TOPICS[decision.topic]?.label ?? decision.topic}</Tag>
                  )}
                </Tags>
              )}
              {decision.better !== undefined && (
                <Better>
                  <BetterTitle>
                    Лучше было бы: {decision.better.text}
                  </BetterTitle>
                  <Muted>{decision.better.explanation}</Muted>
                </Better>
              )}
            </Item>
          );
        })}
      </List>
    </Section>
  );
};
