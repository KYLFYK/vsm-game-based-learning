import { styled } from 'styled-components';

import { Tag, TagTone } from '@/components/tag';
import { cardStyles, listReset } from '@/styles/mixins';
import type { Report } from '@/types';

import { MeterChart } from './meter-chart';
import { Section, SectionTitle } from './scenario-report.styles';

const Grid = styled.ul`
  ${listReset}
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ theme }) => theme.report.tileWidth}, 1fr)
  );
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Tile = styled.li`
  ${cardStyles}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.hudLabel};
  font-weight: 800;
  text-transform: uppercase;
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.reportScore};
  font-weight: 800;
  line-height: 1;
`;

const Verdict = styled(Tag)`
  align-self: flex-start;
`;

export const MetersSection = ({ meters }: { meters: Report.Meter[] }) => {
  if (meters.length === 0) return null;
  return (
    <Section aria-labelledby="report-meters">
      <SectionTitle id="report-meters">Шкалы</SectionTitle>
      <Grid>
        {meters.map((meter) => (
          <Tile key={meter.id}>
            <Label>{meter.label}</Label>
            <Value>{meter.final}</Value>
            {meter.threshold !== undefined && (
              <Verdict $tone={meter.met ? TagTone.Navy : TagTone.Red}>
                {meter.met ? '✓' : '✗'} Порог {meter.threshold}:{' '}
                {meter.met ? 'выполнен' : 'не выполнен'}
              </Verdict>
            )}
            <MeterChart meter={meter} />
          </Tile>
        ))}
      </Grid>
    </Section>
  );
};
