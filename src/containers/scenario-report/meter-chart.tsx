import { styled, useTheme } from 'styled-components';

import type { Report } from '@/types';

import { sparklinePoints, sparklineY } from './sparkline';

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
`;

const Line = styled.polyline`
  fill: none;
  stroke: ${({ theme }) => theme.colors.accentRed};
  stroke-width: ${({ theme }) => theme.report.lineWidth};
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Threshold = styled.line`
  stroke: ${({ theme }) => theme.colors.accentNavy};
  stroke-width: ${({ theme }) => theme.report.thresholdWidth};
`;

const Baseline = styled.line`
  stroke: ${({ theme }) => theme.colors.meterTrack};
  stroke-width: ${({ theme }) => theme.report.hairline};
`;

const Dot = styled.circle`
  fill: ${({ theme }) => theme.colors.accentRed};
  stroke: ${({ theme }) => theme.colors.bgBase};
  stroke-width: ${({ theme }) => theme.report.dotRing};
`;

// Невидимая зона наведения больше точки: подсказка <title> ловится без прицеливания
const Hit = styled.circle`
  fill: transparent;
`;

const stepLabel = (index: number): string =>
  index === 0 ? 'Начало' : `После решения ${index}`;

/** График шкалы по решениям: линия значений, риска порога, точка итога */
export const MeterChart = ({ meter }: { meter: Report.Meter }) => {
  const theme = useTheme();
  const box = {
    width: theme.report.chartWidth,
    height: theme.report.chartHeight,
    pad: theme.report.chartPad,
  };
  const points = sparklinePoints(meter.series, meter.min, meter.max, box);
  const last = points[points.length - 1];
  const bottom = box.height - box.pad;

  return (
    <Svg
      viewBox={`0 0 ${box.width} ${box.height}`}
      role="img"
      aria-label={`${meter.label} по решениям: ${meter.series.join(', ')}`}
    >
      <Baseline x1={box.pad} x2={box.width - box.pad} y1={bottom} y2={bottom} />
      {meter.threshold !== undefined && (
        <Threshold
          x1={box.pad}
          x2={box.width - box.pad}
          y1={sparklineY(meter.threshold, meter.min, meter.max, box)}
          y2={sparklineY(meter.threshold, meter.min, meter.max, box)}
        />
      )}
      <Line points={points.map(({ x, y }) => `${x},${y}`).join(' ')} />
      <Dot cx={last.x} cy={last.y} r={theme.report.dotRadius} />
      {points.map((point, index) => (
        <Hit key={index} cx={point.x} cy={point.y} r={theme.report.hitRadius}>
          <title>{`${stepLabel(index)}: ${point.value}`}</title>
        </Hit>
      ))}
    </Svg>
  );
};
