# Интерфейс

## Маршруты

```ts
export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE: '/courses/:courseId',
  SCENARIO: '/scenarios/:scenarioId',
  SCENARIO_ATTEMPT: '/scenarios/:scenarioId/attempts/:attemptId',
} as const;
```

Пути с параметрами собираются `generatePath(ROUTES.X, params)` из
`react-router`. Контекст курса — search-параметр `course`; он
пробрасывается из курса в сценарий и из сценария в отчёт.

| Маршрут | Страница | Контейнеры |
|---------|----------|------------|
| `COURSES` | `pages/courses` | `course-list` |
| `COURSE` | `pages/course` | `course-view` |
| `SCENARIO` | `pages/scenario` | `scenario-card` при `Status.Idle`, `scenario-player` при `Running` и `Finished` |
| `SCENARIO_ATTEMPT` | `pages/scenario-attempt` | `scenario-report` |

`AppLayout` получает пункт навигации «Курсы»; главная ссылается на него.
Страница сценария при размонтировании диспатчит `runLeft`.

## Компоненты `components/`

| Компонент | Пропсы | Ответственность |
|-----------|--------|-----------------|
| `Button` | `variant: ButtonVariant`, `onClick`, `disabled` | Единая кнопка; `enum ButtonVariant { Primary, Secondary }` |
| `MeterBar` | `label`, `value`, `min`, `max`, `threshold?`, `delta?` | Полоса, риска порога, всплывающее `±n` на 1 с |
| `Countdown` | `remainingMs`, `size: CountdownSize` | `мм:сс`; при `< 10 000` мс цвет `danger`; `enum CountdownSize { Hud, Inline }` |
| `SpeechBubble` | `side: BubbleSide`, `name?`, `text` | Реплика персонажа или автора; `enum BubbleSide { Left, Right, Top }` |
| `CharacterPortrait` | `src`, `name`, `side: Character.Side`, `active` | Портрет, притушен при `active: false`; `Side.Left` отзеркален |
| `ChoiceList` | `options: { id, text }[]`, `onChoose(id)`, `remainingMs?` | Нумерованные кнопки 1–4, таймер узла |

Компоненты не знают про store и типы сценария глубже пропсов. Enum
пропсов экспортируется из файла компонента и через `components/index.ts`.
Клавиши 1–4 хватает на любой `choice`: валидатор гарантирует не больше
`MAX_CHOICE_OPTIONS` вариантов ([validation.md](validation.md)).

## Контейнер `scenario-player`

Файлы: `scenario-player.tsx` (композиция), `scene.tsx` (фон, слоты,
реплика), `hud.tsx`, `finale.tsx`, `use-run-timers.ts`,
`use-player-keys.ts`, `scenario-player.styles.ts`.

- Читает `selectCurrentNode`, `selectVisibleOptions`, `selectStage`,
  `selectMeterViews`, `selectMetersVisible`, `selectEnding`; диспатчит
  `advanced`, `optionChosen`, `runLeft`.
- Портреты и фон берёт из `CHARACTERS` и `BACKGROUNDS` по `id` из
  `stage`; говорящий определяется по `speaker` узла: слот с этим
  персонажем `active`, второй нет. Персонаж с `Role.Author` → реплика
  сверху, оба слота неактивны.
- Узел `NodeType.Line`: клик по сцене, `Enter`, `Space` → `advanced`.
- `NodeType.Choice`: `ChoiceList`; клавиши `1`–`4` → `optionChosen` видимого
  варианта с этим номером. Клик по сцене ничего не делает.
- `use-player-keys.ts`: `keydown` на `window` только при `Running`;
  игнорирует события с `event.repeat`.
- «Выйти» в HUD: `window.confirm('Попытка не сохранится. Выйти?')` →
  `runLeft` и переход на курс (если есть `course`) или `COURSES`.

### Раскладка

- Игровая область: соотношение 16:9, ширина до 1280 px, по центру,
  фон `object-fit: cover`, скругление `radii.card`.
- HUD: верхняя полоса поверх фона; слева название и «Выйти», справа
  `MeterBar` на каждую шкалу и `Countdown` сценария.
- Слоты: 30 % ширины, прижаты к низу области; реплика рядом со слотом со
  стороны центра, ширина до 40 %.
- Реплика автора: полоса сверху по центру, ширина до 60 %, под HUD.
- Варианты: блок снизу по центру, ширина до 640 px, поверх слотов.

### Финал

При `Status.Finished` сцена остаётся, реплика `ending.line` показывается от её
`speaker`, вместо вариантов — кнопка «К отчёту». Нажатие:
`saveAttempt(selectAttemptDraft)` → успех: `runLeft` и переход на
`SCENARIO_ATTEMPT`; ошибка: текст «Не удалось сохранить попытку» и кнопка
«Повторить».

## Контейнер `scenario-card`

Читает `useGetScenarioQuery`, `useGetAttemptsQuery({ scenarioId })`.
Показывает название, описание, темы, `estimatedMinutes`, лимит времени,
список шкал с порогами, лучшую попытку (`compareAttempts`) и историю
попыток со ссылками на отчёты. «Начать» → `runStarted({ scenario,
courseId })`. Состояния: загрузка — текст «Загрузка…»; `not-found` —
текст и ссылка на `COURSES`.

## Контейнеры курсов

- `course-list`: карточки курсов, число сценариев, сколько зачтено.
- `course-view`: сценарии по порядку с меткой по `Course.ScenarioStatus`
  (`Passed` — «Зачтено», `Failed` — «Не зачтено», `NotStarted` —
  «Не начат»); ссылка на `SCENARIO` с `course`.
- Данные: `useGetCoursesQuery`, `useGetCourseQuery`,
  `useGetScenariosQuery`, `useGetAttemptsQuery({})`.

## Контейнер `scenario-report`

Читает `useGetAttemptQuery`, `useGetScenarioQuery`,
`useGetScenariosQuery`, `useGetAttemptsQuery({})`, строит `buildReport`
([report.md](report.md)) в `useMemo` и рендерит блоки по порядку из
плана. Кнопки: «Пройти ещё раз» → `SCENARIO` с тем же `course`;
«К курсу» при `course`; «Следующий сценарий» при `Status.Passed` и наличии
следующего в курсе.

## Токены темы

Добавить в `theme.ts` и описать в `styling.md`:

- `colors.meterLoyalty`, `colors.meterSafety`, `colors.meterTrack`,
  `colors.overlay` (полупрозрачный фон реплик и HUD),
  `colors.bubbleBg`, `colors.bubbleText`.
- `zIndices.scene`, `zIndices.hud`, `zIndices.choices`.
- `durations.meter` для анимации шкалы.

## Доступность

- Все интерактивные элементы — `button`; варианты имеют `aria-keyshortcuts`.
- `MeterBar` — `role="meter"` с `aria-valuenow/min/max` и `aria-label`.
- Реплика — `aria-live="polite"`, таймеры без `aria-live`, чтобы не
  зачитывались каждую секунду.

## См. также

- [../../plans/scenario-engine/ux.md](../../plans/scenario-engine/ux.md) — раскладка и поведение.
- [../../requirements/client.md](../../requirements/client.md) — слои и стили.
