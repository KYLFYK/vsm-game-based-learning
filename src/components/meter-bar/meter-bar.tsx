import { styled, useTheme } from 'styled-components';

import { useValueDelta } from '@/hooks';
import { floatUp } from '@/styles/animations';
import { formatDelta, meterPercent } from '@/utils';

const Root = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: ${({ theme }) => theme.stage.meterTrackWidth} auto;
  gap: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme }) => theme.colors.bgBase};
  border: ${({ theme }) => theme.borders.ink};
  box-shadow: ${({ theme }) => theme.shadows.navyMd};
`;

const Label = styled.span`
  grid-column: 1 / 3;
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.hudLabel};
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ink};
`;

const Track = styled.div`
  position: relative;
  height: ${({ theme }) => theme.stage.meterTrackHeight};
  background: ${({ theme }) => theme.colors.meterTrack};
  border: ${({ theme }) => theme.borders.inkThin};
`;

const Fill = styled.div<{ $percent: number }>`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${({ $percent }) => $percent}%;
  background: ${({ theme }) => theme.colors.accentRed};
  transition: width ${({ theme }) => theme.durations.meter}ms ease-out;
`;

const Threshold = styled.span<{ $percent: number }>`
  position: absolute;
  top: ${({ theme }) => theme.stage.thresholdOverhang};
  bottom: ${({ theme }) => theme.stage.thresholdOverhang};
  left: ${({ $percent }) => $percent}%;
  width: ${({ theme }) => theme.stage.thresholdWidth};
  background: ${({ theme }) => theme.colors.accentNavy};
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.hudValue};
  font-weight: 800;
  text-align: right;
  color: ${({ theme }) => theme.colors.ink};
`;

const Delta = styled.span<{ $positive: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.stage.deltaTop};
  right: ${({ theme }) => theme.stage.deltaRight};
  padding: 0 ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.fontFamilyDisplay};
  font-size: ${({ theme }) => theme.gameFontSizes.delta};
  font-weight: 900;
  color: ${({ theme }) => theme.colors.onAccent};
  background: ${({ $positive, theme }) =>
    $positive ? theme.colors.accentNavy : theme.colors.accentRed};
  border: ${({ theme }) => theme.borders.inkThin};
  transform: rotate(${({ theme }) => theme.tilts.lg});
  pointer-events: none;
  animation: ${floatUp} ${({ theme }) => theme.durations.delta}ms ease-out;
`;

interface MeterBarProps {
  label: string;
  value: number;
  min: number;
  max: number;
  threshold?: number;
}

export const MeterBar = ({
  label,
  value,
  min,
  max,
  threshold,
}: MeterBarProps) => {
  const theme = useTheme();
  const delta = useValueDelta(value, theme.durations.delta);

  return (
    <Root
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
    >
      <Label>{label}</Label>
      <Track>
        <Fill $percent={meterPercent(value, min, max)} />
        {threshold !== undefined && (
          <Threshold $percent={meterPercent(threshold, min, max)} />
        )}
      </Track>
      <Value>{value}</Value>
      {delta !== null && (
        <Delta key={delta.key} $positive={delta.amount > 0} aria-hidden="true">
          {formatDelta(delta.amount)}
        </Delta>
      )}
    </Root>
  );
};
