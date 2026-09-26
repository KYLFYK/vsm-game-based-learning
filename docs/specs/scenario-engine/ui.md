# Интерфейс

Структура экранов, маршруты, контейнеры, компоненты и поведение.
Внешний вид (палитра, шрифты, контуры, движение) — [ui-visual.md](ui-visual.md).

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

```
Routes
├── /                            → AppLayout
│   ├── index                    → HomePage
│   ├── COURSES, COURSE          → этап 6
│   └── SCENARIO_ATTEMPT         → ScenarioAttemptPage
└── SCENARIO                     → ScenarioPage (вне AppLayout, на всё окно)
```

| Маршрут | Страница | Контейнеры | Лейаут |
|---------|----------|------------|--------|
| `HOME` | `pages/home` | `scenario-catalog` | `AppLayout` |
| `SCENARIO` | `pages/scenario` | `scenario-player` | нет |
| `SCENARIO_ATTEMPT` | `pages/scenario-attempt` | `scenario-report` (этап 5; до него — заглушка) | `AppLayout` |
| `COURSES` | `pages/courses` | `course-list` (этап 6) | `AppLayout` |
| `COURSE` | `pages/course` | `course-view` (этап 6) | `AppLayout` |

- `SCENARIO` — отдельный `Route` рядом с `AppLayout`, а не внутри: у
  сценария нет шапки приложения, сцена занимает всё окно.
- `runLeft` при размонтировании и при смене `scenarioId` диспатчит
  контейнер `scenario-player`, а не страница: у страниц нет побочных
  эффектов ([requirements/client.md](../../requirements/client.md)).
  Перезагрузка открывает заставку заново: оборванная попытка не оживает.
- `AppLayout` получает пункт «Курсы» на этапе 6; до него каталог
  сценариев живёт на главной.

## Компоненты `components/`

| Компонент | Пропсы | Ответственность |
|-----------|--------|-----------------|
| `Button` | `variant: ButtonVariant`, `size: ButtonSize`, `onClick`, `disabled`, `aria-*` | Единая кнопка; `enum ButtonVariant { Primary, Secondary }`, `enum ButtonSize { Sm, Md, Lg }` |
| `ButtonLink` | `to`, `variant`, `size` | Та же кнопка поверх `Link` из `react-router` |
| `MeterBar` | `label`, `value`, `min`, `max`, `threshold?` | Полоса, риска порога, всплывающий `±n` на 1 с при смене `value` (`useValueDelta`) |
| `Countdown` | `remainingMs`, `size: CountdownSize` | `мм:сс`; при `< COUNTDOWN_HOT_MS` (10 000) — «горящее» состояние; `enum CountdownSize { Hud, Inline }` |
| `SpeechBubble` | `side: BubbleSide`, `name?`, `text` | Реплика персонажа (`Left`, `Right`) или автора (`Top`); `enum BubbleSide { Left, Right, Top }` |
| `CharacterPortrait` | `src`, `name`, `side: Character.Side`, `active` | Портрет, притушен при `active: false`; `Side.Left` отзеркален |
| `ChoiceList` | `options: { id, text }[]`, `onChoose(id)`, `remainingMs?` | Нумерованные кнопки 1–4, таймер узла над списком |
| `Stamp` | `status: Attempt.Status` | Штамп «ЗАЧТЕНО» / «НЕ ЗАЧТЕНО» (`STAMP_LABELS`); `aria-hidden` |
| `VisuallyHidden` | `children` | Текст только для скринридеров (sr-only) |
| `FullscreenEnterIcon`, `FullscreenExitIcon` | — | SVG-иконки кнопки «Во весь экран», `aria-hidden` |
| `ComicBackdrop` | `variant: BackdropVariant` | Декоративный слой: лучи и полутон; `enum BackdropVariant { Intro, Scene }` |

Компоненты не знают про store и типы сценария глубже пропсов. Enum
пропсов компонента живёт в `<component>.enums.ts` рядом с компонентом и
реэкспортируется через `components/index.ts`. `MeterBar` через
`useValueDelta` показывает разницу с предыдущим `value`.
Клавиш 1–4 хватает на любой `choice`: валидатор гарантирует не больше
`MAX_CHOICE_OPTIONS` вариантов ([validation.md](validation.md)).

## Контейнер `scenario-catalog`

Временный каталог на главной до страниц курсов (этап 6).
`useGetScenariosQuery` → карточки: `title`, `description`, подписи тем из
`TOPICS`, `estimatedMinutes`, лимит `timeLimitSec` в `мм:сс`, `ButtonLink`
«Играть» на `SCENARIO`. Загрузка — «Загрузка…», ошибка — текст ошибки.

## Контейнер `scenario-player`

Файлы: `scenario-player.tsx` (ветвление по статусу), `intro.tsx`,
`scene.tsx` (фон, слоты, реплика, варианты), `hud.tsx`, `finale.tsx`,
`speaker-layout.ts`, `meter-thresholds.ts`, `use-run-timers.ts`,
`use-player-keys.ts`, `use-fullscreen.ts`, `scenario-player.styles.ts`.

| `selectRunStatus` | Экран |
|-------------------|-------|
| `Idle` | `intro` — заставка |
| `Running` | `scene` + `hud` |
| `Finished` | `scene` + `hud` + `finale` |

- Данные: `useGetScenarioQuery(scenarioId)`. Загрузка — «Загрузка…» на
  фоне заставки; `not-found` — текст и `ButtonLink` на `HOME`.
- Читает `selectCurrentNode`, `selectVisibleOptions`, `selectStage`,
  `selectMeterViews`, `selectMetersVisible`, `selectEnding`; диспатчит
  `runStarted`, `advanced`, `optionChosen`, `runLeft`.
- Портреты и фон — из `CHARACTERS` и `BACKGROUNDS` по `id` из `stage`.
- `speakerLayout(stage, speaker)` — чистая функция: какой слот активен и
  сторона облака. Говорит персонаж слота → этот слот `active`, облако с
  его стороны; `Role.Author` → облако `Top`, оба слота неактивны;
  говорящего нет на сцене → облако `Top` с именем.
- Узел `NodeType.Line`: клик по сцене, `Enter`, `Space` или кнопка
  «Далее» → `advanced`. Клик с `event.detail > 1` игнорируется: второй
  клик двойного клика по «Начать» или варианту пропустил бы реплику.
- `NodeType.Choice`: реплика узла и `ChoiceList`; клавиши `1`–`4` →
  `optionChosen` видимого варианта с этим номером. Клик по сцене ничего
  не делает.
- `use-player-keys.ts`: `keydown` на `window` только при `Running`;
  игнорирует `event.repeat` и события с модификаторами.

### Заставка (`intro`)

Название, описание, подпись первой темы, чипы: лимит сценария
(`мм:сс`), по чипу на каждый порог `passCriteria.meters` («<label> — не
ниже N»). Флаги из `passCriteria.flags` не показываются: это внутренние
`id`. Кнопки: «Начать» → `runStarted({ scenario, courseId })`, где
`courseId` — search-параметр `course`; «К сценариям» → `HOME`.

### HUD

- Слева: «Выйти» и название сценария.
- Справа: `MeterBar` на каждую шкалу при `selectMetersVisible`,
  `Countdown` сценария при лимите, кнопка «Во весь экран».
- «Выйти»: `window.confirm('Попытка не сохранится. Выйти?')` → `runLeft`
  и переход на `HOME`; переход на курс (при `course`) появится вместе с
  курсами на этапе 6. На финале вопрос тот же: попытка сохраняется только
  кнопкой «К отчёту».

### Полноэкранный режим

`use-fullscreen.ts` возвращает `{ supported, active, toggle }`:
`supported` — `Boolean(document.fullscreenEnabled)` (в iPhone Safari
`undefined`); `toggle` — `document.documentElement.requestFullscreen()`
или `document.exitFullscreen()`; `active` — по `fullscreenchange`.
При размонтировании плеера полноэкранный режим снимается. Кнопка
скрыта при `supported: false`. Ошибка `requestFullscreen` игнорируется.
`aria-label` и `title` кнопки — «Во весь экран», в полноэкранном
режиме — «Выйти из полноэкранного режима»; `aria-pressed` — `active`.

### Финал

При `Status.Finished` сцена остаётся, реплика `ending.line`
показывается от её `speaker` по `speakerLayout`, вместо вариантов —
кнопка «К отчёту», над ней `Stamp` с `ending.status`. Нажатие:
`saveAttempt(selectAttemptDraft)` → успех: переход на
`SCENARIO_ATTEMPT` (`runLeft` отработает при размонтировании страницы);
ошибка: текст «Не удалось сохранить попытку» и кнопка «Повторить».
`Enter` / `Space` нажимают её, пока сохранение не идёт (`usePlayerKeys`
в `finale.tsx`); автофокуса нет — `keyup` пробела нажал бы кнопку.

### Раскладка

- Корень плеера — `100vw × 100dvh`, `overflow: hidden`. Фон сцены на
  всё окно, `object-fit: cover`, поверх — `ComicBackdrop`.
- Игровая зона — 16:9, вписана в окно по центру
  (`width: min(100vw, 100dvh * 16 / 9)`), `container-type: size`;
  размеры внутри — в `cqw`/`cqh`, поэтому пропорции не зависят от окна.
- HUD прижат к краям окна, не зоны.
- Слоты: 24 % ширины зоны, прижаты к низу; облако со стороны центра,
  ширина до 40 %.
- Реплика автора: полоса сверху по центру, до 60 %, под HUD.
- Варианты: снизу по центру, до 50 % ширины зоны, поверх слотов.
- Подсказка «Далее ▸ Enter» — правый нижний угол зоны, только на
  `NodeType.Line`.

## Контейнеры курсов (этап 6)

- `course-list`: карточки курсов, число сценариев, сколько зачтено.
- `course-view`: сценарии по порядку с меткой по `Course.ScenarioStatus`
  (`Passed` — «Зачтено», `Failed` — «Не зачтено», `NotStarted` —
  «Не начат»); ссылка на `SCENARIO` с `course`.
- Данные: `useGetCoursesQuery`, `useGetCourseQuery`,
  `useGetScenariosQuery`, `useGetAttemptsQuery({})`.

## Контейнер `scenario-report` (этап 5)

Читает `useGetAttemptQuery`, `useGetScenarioQuery`,
`useGetScenariosQuery`, `useGetAttemptsQuery({})`, строит `buildReport`
([report.md](report.md)) в `useMemo` и рендерит блоки по порядку из
плана. Кнопки: «Пройти ещё раз» → `SCENARIO` с тем же `course`;
«К курсу» при `course`; «Следующий сценарий» при `Status.Passed` и наличии
следующего в курсе.

## Доступность

- Все интерактивные элементы — `button` или ссылка; варианты имеют
  `aria-keyshortcuts`, «Во весь экран» — `aria-pressed`.
- `MeterBar` — `role="meter"` с `aria-valuenow/min/max` и `aria-label`.
- Реплика — `aria-live="polite"`, таймеры без `aria-live`, чтобы не
  зачитывались каждую секунду. В облаке `Left`/`Right` имя читается до
  текста (`VisuallyHidden`), видимая плашка — `aria-hidden`.
- Итог — постоянная `role="status"` в `scene.tsx`: пуста до `Finished`,
  затем `STAMP_LABELS[ending.status]` (область, смонтированную с текстом,
  скринридер может пропустить).
- Анимации выключаются при `prefers-reduced-motion: reduce`.

## См. также

- [ui-visual.md](ui-visual.md) — визуальный язык и токены темы.
- [../../plans/scenario-engine/ux.md](../../plans/scenario-engine/ux.md) — экраны и поведение.
- [../../requirements/client.md](../../requirements/client.md) — слои и стили.
