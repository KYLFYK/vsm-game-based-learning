interface QueryState {
  isFetching: boolean;
  currentData?: unknown;
}

/**
 * Хотя бы один запрос грузится и ещё не отдал данных под текущие аргументы.
 * `currentData`, а не `data`: при смене аргументов `data` держит прошлый ответ
 */
export const isAwaitingData = (queries: QueryState[]): boolean =>
  queries.some((query) => query.isFetching && query.currentData === undefined);
