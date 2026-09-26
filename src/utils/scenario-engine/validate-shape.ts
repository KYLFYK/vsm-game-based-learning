import { Attempt, Character, Scenario, Validation } from '@/types';

import { isObject, issue, key } from './issue';
import {
  arrayOf,
  boolean,
  finite,
  nullable,
  objectOf,
  oneOf,
  optional,
  positive,
  recordOf,
  required,
  string,
  variantBy,
} from './shape-schema';

import type { Check } from './shape-schema';

const condition = variantBy(
  {
    flag: objectOf({ flag: required(string), is: optional(boolean) }),
    meter: objectOf({
      meter: required(string),
      gte: optional(finite),
      gt: optional(finite),
      lte: optional(finite),
      lt: optional(finite),
    }),
  },
  'условие с полем flag или meter'
);

const conditions: Check = (value, path, out) =>
  (Array.isArray(value) ? arrayOf(condition) : condition)(value, path, out);

const effect = variantBy(
  {
    flag: objectOf({ flag: required(string), value: required(boolean) }),
    meter: objectOf({ meter: required(string), delta: required(finite) }),
  },
  'эффект с полем flag или meter'
);

const transition = objectOf({
  if: optional(conditions),
  to: required(string),
});

const next: Check = (value, path, out) =>
  (typeof value === 'string' ? string : arrayOf(transition))(value, path, out);

const review = objectOf({
  verdict: required(oneOf(Object.values(Scenario.Verdict))),
  explanation: required(string),
  topic: optional(string),
});

const option = objectOf({
  id: required(string),
  text: required(string),
  if: optional(conditions),
  effects: optional(arrayOf(effect)),
  review: optional(review),
  next: required(next),
});

const slot = objectOf({
  character: required(string),
  mood: required(oneOf(Object.values(Character.Mood))),
});

const stage = objectOf({
  background: optional(string),
  left: optional(nullable(slot)),
  right: optional(nullable(slot)),
  metersVisible: optional(boolean),
});

const nodeBase = {
  type: required(string),
  speaker: required(string),
  text: required(string),
  stage: optional(stage),
};

const nodeByType: Record<Scenario.NodeType, Check> = {
  [Scenario.NodeType.Line]: objectOf({ ...nodeBase, next: required(next) }),
  [Scenario.NodeType.Choice]: objectOf({
    ...nodeBase,
    timeLimitSec: optional(positive),
    options: required(arrayOf(option)),
  }),
  [Scenario.NodeType.End]: objectOf({
    ...nodeBase,
    result: optional(oneOf(Object.values(Attempt.Status))),
  }),
};

const isNodeType = (value: unknown): value is Scenario.NodeType =>
  Object.values<unknown>(Scenario.NodeType).includes(value);

const node: Check = (value, path, out) => {
  if (!isObject(value)) {
    objectOf({})(value, path, out);
    return;
  }
  const typePath = key(path, 'type');
  if (value.type === undefined) {
    out.push(
      issue(
        Validation.Code.ShapeMissing,
        typePath,
        'Нет обязательного поля «type»'
      )
    );
  } else if (!isNodeType(value.type)) {
    out.push(
      issue(
        Validation.Code.ShapeType,
        typePath,
        `Неизвестный тип узла, ожидается одно из: ${Object.values(Scenario.NodeType).join(', ')}`
      )
    );
  } else {
    nodeByType[value.type](value, path, out);
  }
};

const line = objectOf({ speaker: required(string), text: required(string) });

const definition = objectOf({
  id: required(string),
  version: required(finite),
  title: required(string),
  description: required(string),
  topics: required(arrayOf(string)),
  estimatedMinutes: required(positive),
  timeLimitSec: optional(positive),
  characters: required(arrayOf(string)),
  meters: optional(
    recordOf(
      objectOf({
        label: required(string),
        initial: required(finite),
        min: optional(finite),
        max: optional(finite),
      })
    )
  ),
  passCriteria: optional(
    objectOf({
      meters: optional(recordOf(finite)),
      flags: optional(arrayOf(string)),
    })
  ),
  outcomes: optional(
    objectOf({
      timeout: optional(line),
      meterDepleted: optional(recordOf(line)),
    })
  ),
  startNodeId: required(string),
  nodes: required(recordOf(node)),
});

/**
 * Фаза 1: соответствие `input` схеме `Scenario.Definition`. Ошибки
 * дописываются в `out`; `true` — ни одной ошибки формы
 */
export const validateShape = (
  input: unknown,
  out: Validation.Issue[]
): input is Scenario.Definition => {
  const before = out.length;
  definition(input, '', out);
  return out.length === before;
};
