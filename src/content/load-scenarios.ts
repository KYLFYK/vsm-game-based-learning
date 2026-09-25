import type { Scenario, Validation } from '@/types';
import { validateScenario } from '@/utils';

export interface LoadedScenarios {
  scenarios: Record<Scenario.Id, Scenario.Definition>;
  warnings: Record<Scenario.Id, Validation.Issue[]>;
}

const describeIssue = (file: string, issue: Validation.Issue): string =>
  `${file}: ${issue.code} ${issue.path} ${issue.message}`;

/**
 * Валидирует JSON-сценарии бандла и собирает их по `id`; при любой ошибке
 * формата или ссылок падает сразу, чтобы dev-сервер и тесты не запускались
 * с несовместимым контентом
 */
export const loadScenarios = (
  inputs: Record<string, unknown>,
  registries: Validation.Registries
): LoadedScenarios => {
  const scenarios: Record<Scenario.Id, Scenario.Definition> = {};
  const warnings: Record<Scenario.Id, Validation.Issue[]> = {};
  const errorLines: string[] = [];

  Object.entries(inputs).forEach(([file, input]) => {
    const result = validateScenario(input, registries);
    if (!result.ok) {
      errorLines.push(
        ...result.errors.map((issue) => describeIssue(file, issue))
      );
      return;
    }
    scenarios[result.scenario.id] = result.scenario;
    warnings[result.scenario.id] = result.warnings;
  });

  if (errorLines.length > 0) {
    throw new Error(errorLines.join('\n'));
  }
  return { scenarios, warnings };
};
