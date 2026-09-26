import { isAwaitingData } from '../is-awaiting-data';

describe(isAwaitingData.name, () => {
  test('is true while a query fetches without current data', () => {
    expect(
      isAwaitingData([
        { isFetching: false, currentData: [] },
        { isFetching: true, currentData: undefined },
      ])
    ).toBe(true);
  });

  test('is false when a fetching query already has current data', () => {
    expect(isAwaitingData([{ isFetching: true, currentData: [] }])).toBe(false);
  });

  test('is false when a settled query has no data', () => {
    expect(
      isAwaitingData([{ isFetching: false, currentData: undefined }])
    ).toBe(false);
  });

  test('is false for no queries', () => {
    expect(isAwaitingData([])).toBe(false);
  });
});
