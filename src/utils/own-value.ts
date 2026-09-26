/** Значение по собственному ключу: ключ вроде `constructor` не находится через прототип */
export const ownValue = <V>(
  record: Record<string, V>,
  key: string
): V | undefined => (Object.hasOwn(record, key) ? record[key] : undefined);
