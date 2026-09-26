import { styled } from 'styled-components';

import type { Report } from '@/types';

import { MeterChart } from './meter-chart';
import { cardStyles, Section, SectionTitle } from './scenario-report.styles';

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ theme }) => theme.report.tileWidth}, 1fr)
  );
  gap: ${({ theme }) => theme.spacing.lg};
  margin: 0;
  padding: 0;
  list-style: none;
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

const Verdict = styled.span<{ $met: boolean }>`
  align-self: flex-start;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.gameFontSizes.tag};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ $met, theme }) =>
    $met ? theme.colors.accentNavy : theme.colors.accentRed};
  border: ${({ theme }) => theme.borders.inkThin};
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
              <Verdict $met={meter.met}>
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
