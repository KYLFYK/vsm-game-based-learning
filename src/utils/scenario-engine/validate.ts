import type { Scenario, Validation } from '@/types';

import { checkGraph } from './validate-graph';
import { checkLimits } from './validate-limits';
import { checkRefs } from './validate-refs';
import { validateShape } from './validate-shape';
import { collectWarnings } from './validate-warnings';

/** Фаза 2: граф и ссылки на типизированном сценарии, ошибки собираются все */
const validateLinks = (
  scenario: Scenario.Definition,
  registries: Validation.Registries
): Validation.Issue[] => [
  ...checkGraph(scenario),
  ...checkRefs(scenario, registries),
  ...checkLimits(scenario),
];

export const validateScenario = (
  input: unknown,
  registries: Validation.Registries
): Validation.Result => {
  const shapeErrors: Validation.Issue[] = [];
  if (!validateShape(input, shapeErrors)) {
    return { ok: false, errors: shapeErrors, warnings: [] };
  }
  const errors = validateLinks(input, registries);
  const warnings = collectWarnings(input);
  return errors.length > 0
    ? { ok: false, errors, warnings }
    : { ok: true, scenario: input, warnings };
};
