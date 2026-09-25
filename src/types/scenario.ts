import type { Attempt } from './attempt';
import type { Character } from './character';

export namespace Scenario {
  export type Id = string;
  export type NodeId = string;
  export type OptionId = string;
  export type MeterId = string;
  export type FlagId = string;
  export type TopicId = string;
  export type BackgroundId = string;

  export enum NodeType {
    Line = 'line',
    Choice = 'choice',
    End = 'end',
  }
  export enum Verdict {
    Best = 'best',
    Ok = 'ok',
    Bad = 'bad',
  }

  export interface Definition {
    id: Id;
    version: number;
    title: string;
    description: string;
    topics: TopicId[];
    estimatedMinutes: number;
    timeLimitSec?: number;
    characters: Character.Id[];
    meters?: Record<MeterId, Meter>;
    passCriteria?: PassCriteria;
    outcomes?: Outcomes;
    startNodeId: NodeId;
    nodes: Record<NodeId, Node>;
  }

  /** Для списков и рекомендаций: Definition без outcomes, characters, startNodeId, nodes */
  export type Summary = Omit<
    Definition,
    | 'meters'
    | 'passCriteria'
    | 'outcomes'
    | 'characters'
    | 'startNodeId'
    | 'nodes'
  > & { hasMeters: boolean };

  export interface Meter {
    label: string;
    initial: number;
    min?: number; // по умолчанию 0
    max?: number; // по умолчанию 100
  }

  export interface PassCriteria {
    meters?: Record<MeterId, number>;
    flags?: FlagId[];
  }

  export interface Line {
    speaker: Character.Id;
    text: string;
  }

  export interface Outcomes {
    timeout?: Line;
    meterDepleted?: Record<MeterId, Line>;
  }

  export interface Slot {
    character: Character.Id;
    mood: Character.Mood;
  }

  export interface StagePatch {
    background?: BackgroundId;
    left?: Slot | null;
    right?: Slot | null;
    metersVisible?: boolean;
  }

  interface NodeBase extends Line {
    stage?: StagePatch;
  }

  export interface LineNode extends NodeBase {
    type: NodeType.Line;
    next: Next;
  }

  export interface ChoiceNode extends NodeBase {
    type: NodeType.Choice;
    timeLimitSec?: number;
    options: Option[];
  }

  export interface EndNode extends NodeBase {
    type: NodeType.End;
    result?: Attempt.Status;
  }

  export type Node = LineNode | ChoiceNode | EndNode;

  export interface Option {
    id: OptionId;
    text: string;
    if?: Condition | Condition[];
    effects?: Effect[];
    review?: Review;
    next: Next;
  }

  export type Next = NodeId | Transition[];

  export interface Transition {
    if?: Condition | Condition[];
    to: NodeId;
  }

  export interface FlagCondition {
    flag: FlagId;
    is?: boolean; // по умолчанию true
  }

  export interface MeterCondition {
    meter: MeterId;
    gte?: number;
    gt?: number;
    lte?: number;
    lt?: number;
  }

  export type Condition = FlagCondition | MeterCondition;

  export interface MeterEffect {
    meter: MeterId;
    delta: number;
  }

  export interface FlagEffect {
    flag: FlagId;
    value: boolean;
  }

  export type Effect = MeterEffect | FlagEffect;

  export interface Review {
    verdict: Verdict;
    explanation: string;
    topic?: TopicId;
  }
}
