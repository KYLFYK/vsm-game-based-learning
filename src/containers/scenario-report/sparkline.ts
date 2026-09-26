import { meterPercent } from '@/utils';

export interface SparklineBox {
  width: number;
  height: number;
  pad: number;
}

export interface SparklinePoint {
  x: number;
  y: number;
  value: number;
}

export const sparklineY = (
  value: number,
  min: number,
  max: number,
  box: SparklineBox
): number =>
  box.pad +
  (1 - meterPercent(value, min, max) / 100) * (box.height - box.pad * 2);

/** Координаты ряда значений шкалы в viewBox графика */
export const sparklinePoints = (
  series: number[],
  min: number,
  max: number,
  box: SparklineBox
): SparklinePoint[] => {
  const step =
    series.length > 1 ? (box.width - box.pad * 2) / (series.length - 1) : 0;
  return series.map((value, index) => ({
    x: box.pad + index * step,
    y: sparklineY(value, min, max, box),
    value,
  }));
};
