# Валидация сценария

`src/utils/scenario-engine/validate.ts`:

```ts
validateScenario(input: unknown, registries: Registries): Validation.Result
```

Типы `Validation.Result`, `Validation.Issue`, enum `Validation.Code` — в
[types-runtime.md](types-runtime.md). Коды в таблицах ниже — строковые
значения членов enum. `path` — путь в формате `nodes.q1.options[0].next`.
Без внешних библиотек: проверки написаны руками, одна функция на фазу.

## Фаза 1: форма

Проверяет, что `input` соответствует `Scenario.Definition` по типам и
обязательным полям. Любая ошибка формы прерывает валидацию: фаза 2 не
запускается, `ok: false`.

| Код | Условие |
|-----|---------|
| `shape.missing` | Обязательное поле отсутствует |
| `shape.type` | Неверный тип поля или неизвестный `type` узла |
| `shape.unknownField` | Поле вне схемы (защита от опечаток вроде `nex`) |
| `shape.number` | `version`, `estimatedMinutes`, `timeLimitSec`, `initial`, `min`, `max`, `delta`, пороги не конечные числа; `timeLimitSec` и `estimatedMinutes` не положительные |

## Фаза 2: граф и ссылки

Работает на типизированном объекте. Ошибки собираются все, `ok: false`
если есть хотя бы одна.

| Код | Условие |
|-----|---------|
| `graph.startMissing` | `startNodeId` не в `nodes` |
| `graph.danglingRef` | `next`, `to` ссылается на несуществующий узел |
| `graph.unreachable` | Узел недостижим из `startNodeId` |
| `graph.noEnd` | Из `startNodeId` не достижим ни один узел `end` |
| `graph.noFallback` | Список переходов, где последний элемент имеет `if` |
| `graph.tooFewOptions` | У `choice` меньше двух вариантов |
| `graph.duplicateOptionId` | Повтор `id` варианта в узле |
| `graph.emptyNodes` | `nodes` пуст |
| `ref.character` | `speaker`, слот `stage` или элемент `characters` не в реестре |
| `ref.characterNotListed` | Персонаж используется, но не перечислен в `characters` |
| `ref.background` | Фон не в реестре |
| `ref.topic` | Тема из `topics` не в реестре |
| `ref.meter` | Шкала из `effects`, условия, `passCriteria`, `outcomes` не в `meters` |
| `meter.range` | `min >= max`, `initial` вне `[min, max]`, порог `passCriteria` вне `[min, max]` |
| `outcome.timeoutMissing` | Есть `timeLimitSec` у сценария или любого узла, а `outcomes.timeout` нет |
| `outcome.depletedMissing` | Для шкалы нет `outcomes.meterDepleted[id]` |
| `time.nodeOverScenario` | `timeLimitSec` узла больше `timeLimitSec` сценария |

## Предупреждения

Не влияют на `ok`; попадают в snapshot теста контента.

| Код | Условие |
|-----|---------|
| `review.noBest` | У `choice` нет ровно одного варианта с `Verdict.Best` |
| `review.noTopic` | `review` без `topic` |
| `review.topicNotDeclared` | `topic` варианта не входит в `topics` сценария |
| `flag.neverSet` | Флаг из условия или `passCriteria.flags` не устанавливается ни одним `effects` |
| `flag.neverRead` | Флаг устанавливается, но нигде не читается |
| `graph.selfLoopWithoutChoice` | `line` ведёт сам в себя |
| `option.noReviewWithEffects` | Вариант меняет шкалы, но без `review` |

## Тесты

`__tests__/validate.spec.ts`: корректный сценарий даёт `ok: true` без
ошибок; на каждый код — минимальный сценарий, который его вызывает;
`path` проверяется точно. Реестры в тестах — локальные фикстуры, не
настоящие `CHARACTERS`.

## См. также

- [types.md](types.md) — схема, которую проверяет фаза 1.
- [data.md](data.md) — где вызывается валидатор.
