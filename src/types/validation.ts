import type { Character } from './character';
import type { Scenario } from './scenario';

export namespace Validation {
  export enum Code {
    ShapeMissing = 'shape.missing',
    ShapeType = 'shape.type',
    ShapeUnknownField = 'shape.unknownField',
    ShapeNumber = 'shape.number',
    GraphStartMissing = 'graph.startMissing',
    GraphDanglingRef = 'graph.danglingRef',
    GraphUnreachable = 'graph.unreachable',
    GraphNoEnd = 'graph.noEnd',
    GraphNoFallback = 'graph.noFallback',
    GraphTooFewOptions = 'graph.tooFewOptions',
    GraphTooManyOptions = 'graph.tooManyOptions',
    GraphDuplicateOptionId = 'graph.duplicateOptionId',
    GraphEmptyNodes = 'graph.emptyNodes',
    RefCharacter = 'ref.character',
    RefCharacterNotListed = 'ref.characterNotListed',
    RefBackground = 'ref.background',
    RefTopic = 'ref.topic',
    RefMeter = 'ref.meter',
    MeterRange = 'meter.range',
    OutcomeTimeoutMissing = 'outcome.timeoutMissing',
    OutcomeDepletedMissing = 'outcome.depletedMissing',
    TimeNodeOverScenario = 'time.nodeOverScenario',
    ReviewNoBest = 'review.noBest',
    ReviewNoTopic = 'review.noTopic',
    ReviewTopicNotDeclared = 'review.topicNotDeclared',
    FlagNeverSet = 'flag.neverSet',
    FlagNeverRead = 'flag.neverRead',
    GraphSelfLoopWithoutChoice = 'graph.selfLoopWithoutChoice',
    OptionNoReviewWithEffects = 'option.noReviewWithEffects',
  }

  export interface Issue {
    code: Code;
    path: string;
    message: string;
  }

  export type Result =
    | { ok: true; scenario: Scenario.Definition; warnings: Issue[] }
    | { ok: false; errors: Issue[]; warnings: Issue[] };

  /** Реестры контента для проверки ссылок фазы 2 */
  export interface Registries {
    characters: Record<Character.Id, Character.Definition>;
    backgrounds: Record<
      Scenario.BackgroundId,
      { label: string; asset: string }
    >;
    topics: Record<Scenario.TopicId, { label: string }>;
  }
}
