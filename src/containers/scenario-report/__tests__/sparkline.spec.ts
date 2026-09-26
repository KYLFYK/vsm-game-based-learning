import { sparklinePoints, sparklineY } from '../sparkline';

const box = { width: 100, height: 50, pad: 5 };

describe(sparklineY.name, () => {
  test('maps min to the bottom and max to the top inside the padding', () => {
    expect(sparklineY(0, 0, 100, box)).toBe(45);
    expect(sparklineY(100, 0, 100, box)).toBe(5);
    expect(sparklineY(50, 0, 100, box)).toBe(25);
  });

  test('clamps values outside the bounds', () => {
    expect(sparklineY(150, 0, 100, box)).toBe(5);
    expect(sparklineY(-10, 0, 100, box)).toBe(45);
  });
});

describe(sparklinePoints.name, () => {
  test('spreads points evenly across the width', () => {
    expect(sparklinePoints([2, 6, 10], 2, 10, box)).toEqual([
      { x: 5, y: 45, value: 2 },
      { x: 50, y: 25, value: 6 },
      { x: 95, y: 5, value: 10 },
    ]);
  });

  test('a single value sits at the left edge', () => {
    expect(sparklinePoints([50], 0, 100, box)).toEqual([
      { x: 5, y: 25, value: 50 },
    ]);
  });
});
