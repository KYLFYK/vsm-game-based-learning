import type { Scenario, Validation } from '@/types';
import { validateScenario } from '@/utils';

export interface LoadedScenarios {
  scenarios: Record<Scenario.Id, Scenario.Definition>;
  warnings: Record<Scenario.Id, Validation.Issue[]>;
}

const describeIssue = (file: string, issue: Validation.Issue): string =>
  `${file}: ${issue.code} ${issue.path} ${issue.message}`;

const describeDuplicate = (
  file: string,
  id: Scenario.Id,
  existingFile: string
): string =>
  `${file}: scenario.duplicateId ${id} уже загружен из ${existingFile}`;

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
  const sourceFiles: Record<Scenario.Id, string> = {};
  const errorLines: string[] = [];

  Object.entries(inputs).forEach(([file, input]) => {
    const result = validateScenario(input, registries);
    if (!result.ok) {
      errorLines.push(
        ...result.errors.map((issue) => describeIssue(file, issue))
      );
      return;
    }
    const { id } = result.scenario;
    if (Object.hasOwn(scenarios, id)) {
      errorLines.push(describeDuplicate(file, id, sourceFiles[id] ?? ''));
      return;
    }
    scenarios[id] = result.scenario;
    sourceFiles[id] = file;
    warnings[id] = result.warnings;
  });

  if (errorLines.length > 0) {
    throw new Error(errorLines.join('\n'));
  }
  return { scenarios, warnings };
};
