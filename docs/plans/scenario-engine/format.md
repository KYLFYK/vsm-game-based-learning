# Формат сценария

JSON-описание, которое движок исполняет ([engine.md](engine.md)). В MVP0
файлы лежат в `src/content/scenarios/`, позже те же объекты отдаёт API.
Типы — namespace `Scenario` в `src/types/scenario.ts`.

## Принципы

- Плоский граф: все узлы в одном словаре, связи только по `id`.
- JSON не знает про ассеты: персонажи, фоны и темы — ссылки в реестры
  кода (`constants/characters.ts`, `backgrounds.ts`, `topics.ts`).
- Всё необязательное отсутствует, а не стоит в `null`: нет `meters` —
  нет шкал, нет `timeLimitSec` — нет таймера, нет `passCriteria` — зачёт
  по факту достижения финала.
- Тексты на русском прямо в JSON. Локализация не планируется.

## Пример

```json
{
  "id": "smoke-next-car",
  "version": 1,
  "title": "Задымление в соседнем вагоне",
  "topics": ["safety.evacuation", "communication.calm"],
  "estimatedMinutes": 7,
  "timeLimitSec": 600,
  "characters": ["author", "mentor-anna", "passenger-oleg"],
  "meters": {
    "loyalty": { "label": "Лояльность пассажира", "initial": 60 },
    "safety": { "label": "Рейтинг безопасности", "initial": 80 }
  },
  "passCriteria": {
    "meters": { "loyalty": 40, "safety": 60 },
    "flags": ["evacuationAnnounced"]
  },
  "outcomes": {
    "timeout": { "speaker": "author", "text": "Вы замешкались, время вышло." },
    "meterDepleted": {
      "safety": { "speaker": "mentor-anna", "text": "Это уже опасно. Остановимся." },
      "loyalty": { "speaker": "passenger-oleg", "text": "Я буду жаловаться." }
    }
  },
  "startNodeId": "intro",
  "nodes": {
    "intro": {
      "type": "line",
      "stage": {
        "background": "car-interior-day",
        "left": { "character": "mentor-anna", "mood": "neutral" },
        "metersVisible": false
      },
      "speaker": "author",
      "text": "Поезд идёт по перегону. В тамбуре слышен грохот.",
      "next": "mentor-question"
    },
    "mentor-question": {
      "type": "choice",
      "speaker": "mentor-anna",
      "text": "Что делаешь первым делом при задымлении?",
      "options": [
        {
          "id": "report",
          "text": "Сообщаю начальнику поезда",
          "review": { "verdict": "best", "topic": "safety.evacuation", "explanation": "Первым делом информируется начальник поезда." },
          "next": "situation-start"
        },
        {
          "id": "run",
          "text": "Бегу смотреть, что случилось",
          "review": { "verdict": "bad", "topic": "safety.evacuation", "explanation": "Без доклада вы теряете время и связь." },
          "next": "mentor-explains"
        }
      ]
    },
    "mentor-explains": {
      "type": "line",
      "speaker": "mentor-anna",
      "text": "Сначала доклад, потом действия. Попробуем ещё раз.",
      "next": "mentor-question"
    },
    "situation-start": {
      "type": "line",
      "stage": {
        "background": "car-interior-smoke",
        "left": null,
        "right": { "character": "passenger-oleg", "mood": "scared" },
        "metersVisible": true
      },
      "speaker": "author",
      "text": "Из соседнего вагона тянет дымом. К вам подбегает пассажир.",
      "next": "passenger-asks"
    },
    "passenger-asks": {
      "type": "choice",
      "speaker": "passenger-oleg",
      "text": "Что происходит?! Мы горим?!",
      "timeLimitSec": 20,
      "options": [
        {
          "id": "calm",
          "text": "Спокойно. Ситуация под контролем, пройдите на своё место.",
          "effects": [{ "meter": "loyalty", "delta": 10 }, { "meter": "safety", "delta": 5 }],
          "review": { "verdict": "best", "topic": "communication.calm", "explanation": "Спокойный тон снижает панику." },
          "next": "announce"
        },
        {
          "id": "shout",
          "text": "Не мешайте! Отойдите!",
          "effects": [{ "meter": "loyalty", "delta": -30 }],
          "review": { "verdict": "bad", "topic": "communication.calm", "explanation": "Грубость усиливает панику в вагоне." },
          "next": "announce"
        },
        {
          "id": "escort",
          "text": "Проводите меня к очагу, покажете",
          "if": { "meter": "loyalty", "gte": 50 },
          "effects": [{ "meter": "safety", "delta": -25 }],
          "review": { "verdict": "bad", "topic": "safety.evacuation", "explanation": "Пассажира нельзя вести к источнику опасности." },
          "next": "announce"
        }
      ]
    },
    "announce": {
      "type": "line",
      "speaker": "author",
      "text": "Вы делаете объявление по вагону.",
      "next": [
        { "if": { "meter": "loyalty", "lt": 40 }, "to": "end-tense" },
        { "to": "end-calm" }
      ]
    },
    "end-calm": { "type": "end", "speaker": "mentor-anna", "text": "Хорошая работа." },
    "end-tense": { "type": "end", "speaker": "mentor-anna", "text": "Вагон вас не слушал.", "result": "failed" }
  }
}
```

## Сценарий: верхний уровень

| Поле | Обязательное | Назначение |
|------|--------------|------------|
| `id`, `version` | да | Идентификатор и версия; попытка хранит оба, чтобы отчёт открывался после правок сценария |
| `title`, `description` | да | Карточка сценария |
| `topics` | да | Темы, которым учит сценарий. Основа рекомендаций |
| `estimatedMinutes` | да | Ожидаемое время для карточки |
| `timeLimitSec` | нет | Лимит на весь сценарий; требует `outcomes.timeout` |
| `characters` | да | Используемые персонажи: валидация и предзагрузка портретов |
| `meters` | нет | Шкалы: `label`, `initial`; `min` и `max` по умолчанию 0 и 100 |
| `passCriteria` | нет | Минимумы шкал на финале и обязательные флаги |
| `outcomes` | зависит | Реплики досрочного завершения: `timeout` если есть любой таймер, `meterDepleted` на каждую шкалу |
| `startNodeId`, `nodes` | да | Точка входа и словарь узлов |

## Узлы

Общие поля: `type`, `speaker` (`id` персонажа, у автора `"author"`),
`text`, необязательный `stage`.

| Тип | Свои поля | Смысл |
|-----|-----------|-------|
| `line` | `next` | Реплика, дальше по «Далее» |
| `choice` | `options`, `timeLimitSec?` | Вопрос и варианты; таймер на ситуацию |
| `end` | `result?` | Финальная реплика. `result: "failed"` проваливает независимо от порогов, `"passed"` зачитывает; без `result` решают `passCriteria` |

`stage` — частичное обновление сцены, применяется при входе в узел и
сохраняется до следующего обновления: `background`, `left`, `right`
(объект `{ character, mood }` или `null` чтобы убрать), `metersVisible`.

## Вариант ответа

| Поле | Обязательное | Назначение |
|------|--------------|------------|
| `id` | да | Уникален в пределах узла; попадает в журнал |
| `text` | да | Текст кнопки |
| `if` | нет | Условие видимости |
| `effects` | нет | Изменения шкал и флагов |
| `review` | нет | Оценка для отчёта: `verdict` (`best`, `ok`, `bad`), `explanation`, `topic`. Без `review` выбор не влияет на балл (навигационный) |
| `next` | да | Переход |

## Переходы, условия, эффекты

- `next`: `id` узла либо список `{ "if"?, "to" }`; побеждает первое
  подходящее, последний элемент без `if`.
- Условие: `{ "flag": "x", "is"?: true }` либо `{ "meter": "m", "gte" | "gt" | "lte" | "lt": число }`.
  Список условий означает «все».
- Эффект: `{ "meter": "m", "delta": ±n }` с обрезкой по `min`/`max`
  или `{ "flag": "x", "value": boolean }`.

## Курс и персонаж

- Курс: `{ id, title, description, scenarioIds: [] }` — порядок важен.
- Персонаж (реестр в коде): `{ id, name, role: "mentor" | "passenger" | "author", portraits: { mood: asset } }`.
  У автора портретов нет. Набор `mood` фиксирован в типе.

## См. также

- [engine.md](engine.md) — исполнение и валидация формата.
- [feedback.md](feedback.md) — как `review`, `topics` и `passCriteria` превращаются в отчёт.
