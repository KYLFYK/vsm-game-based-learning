# Client

React 19 SPA на Vite 8. Точка входа — [src/index.tsx](../../src/index.tsx),
корневой компонент — [src/app.tsx](../../src/app.tsx).

## Разделы

- [Архитектура](architecture.md) — слои, назначение папок, как расширять.
- [Маршрутизация](routing.md) — `ROUTES`, дерево маршрутов, как добавить.
- [Состояние](state.md) — `configureStore`, типизированные хуки, барель.
- [API-слой](api.md) — RTK Query, `injectEndpoints`, теги, `VITE_API_URL`.
- [Стилизация](styling.md) — тема, `GlobalStyle`, паттерны styled-components.
- [Игровой движок сценариев](scenario-engine.md) — жизненный цикл
  попытки, где что лежит, таймеры, результат, лучшая попытка.
- [Фичи и флоу](features/README.md) — пошаговые описания.
- [Команды и тесты](tooling.md) — npm-скрипты, настройка Jest.

## Карта `src/`

```
src/
├── index.tsx                  # bootstrap: createRoot + StrictMode + Provider + App
├── app.tsx                    # ThemeProvider + GlobalStyle + BrowserRouter + Routes
├── vite-env.d.ts              # типы Vite, __APP_VERSION__, ImportMetaEnv
├── styled.d.ts                # DefaultTheme styled-components = AppTheme
├── components/                # папка на компонент: <name>.tsx, enum/стили рядом, index.ts; импорт @/components/<name>
│   ├── button/                 # Button, ButtonLink; button.enums.ts (ButtonVariant, ButtonSize), button.styles.ts (buttonStyles)
│   ├── catalog-card/           # CatalogGrid, CatalogCard — карточка курса или сценария в сетке; CardTitle
│   ├── character-portrait/     # CharacterPortrait — портрет персонажа, зеркалится и притушивается
│   ├── choice-list/            # ChoiceList — пронумерованные варианты и таймер узла
│   ├── comic-backdrop/         # ComicBackdrop — лучи и полутон; comic-backdrop.enums.ts (BackdropVariant)
│   ├── countdown/              # Countdown — мм:сс, «горящее» состояние; countdown.enums.ts (CountdownSize)
│   ├── icons/                  # FullscreenEnterIcon, FullscreenExitIcon — SVG-иконки HUD
│   ├── meter-bar/              # MeterBar — шкала, риска порога, всплывающая дельта (useValueDelta)
│   ├── muted-text/             # MutedText — второстепенный абзац; LoadingText — «Загрузка…»
│   ├── not-found/              # NotFound — «не найдено» на странице: заголовок, пояснение, кнопка назад
│   ├── page/                   # Page, PageHeader (плашка + h1), PageTitle, PageList, PageActions — страница курса и отчёта
│   ├── speech-bubble/          # SpeechBubble — реплика персонажа или автора; speech-bubble.enums.ts (BubbleSide)
│   ├── stamp/                  # Stamp — штамп итога, aria-hidden; stamp.enums.ts (STAMP_LABELS)
│   ├── tag/                    # Tag, Badge, TagList — метки; tag.enums.ts (TagTone), tag.styles.ts (toneStyles)
│   └── visually-hidden/        # VisuallyHidden — текст только для скринридеров
├── config/
│   ├── env.ts                 # env = readEnv(import.meta.env) — единственная точка чтения env
│   ├── read-env.ts            # readEnv: типизация и проверка обязательных переменных
│   ├── __mocks__/env.ts       # подстановка для Jest (moduleNameMapper)
│   └── __tests__/             # read-env.spec.ts
├── constants/
│   ├── routes.ts              # ROUTES — единственный источник путей; COURSE_SEARCH_PARAM (routing.md)
│   ├── app.ts                 # APP_NAME
│   ├── characters.ts          # CHARACTERS — реестр персонажей сценариев
│   ├── backgrounds.ts         # BACKGROUNDS — реестр фонов сцены
│   └── topics.ts              # TOPICS — реестр тем сценариев
├── content/
│   ├── scenarios/smoke-next-car.json  # первый сценарий по format.md
│   ├── courses.json           # курсы: { id, title, description, scenarioIds }
│   ├── load-scenarios.ts      # loadScenarios — validateScenario на импорте, throw при ошибке
│   ├── assert-courses.ts      # assertCourses — courses ссылаются только на загруженные сценарии
│   ├── to-summary.ts          # toSummary — Definition → Scenario.Summary
│   ├── index.ts               # барель: SCENARIOS, COURSES, CONTENT_WARNINGS, toSummary
│   └── __tests__/             # index.spec.ts — загрузка, ошибки, snapshot предупреждений
├── containers/
│   ├── layout/app-layout.tsx  # AppLayout — Header (имя, навигация «Главная» / «Курсы», версия) + Main с <Outlet/>
│   ├── course-list/           # CourseList — карточки курсов с прогрессом «Зачтено N из M», «Открыть»
│   ├── course-view/           # CourseView — курс: сценарии по порядку, статус, лучшая попытка, история
│   │   ├── course-view.tsx     # данные, courseProgress, загрузка и «Курс не найден», список
│   │   ├── course-scenario.tsx # CourseScenario — карточка сценария: метка статуса, лучшая попытка, «Играть»
│   │   ├── attempt-history.tsx # AttemptHistory — таблица попыток в <details>, ссылки на отчёт
│   │   ├── course-view-model.ts # SCENARIO_STATUS_LABELS, SCENARIO_STATUS_TONES, playLabel, nextToPlay
│   │   ├── course-view.styles.ts # Progress, карточка сценария, StatusBadge
│   │   └── __tests__/          # course-view-model.spec.ts
│   ├── scenario-catalog/      # ScenarioCatalog — карточки сценариев на главной, «Играть»
│   ├── scenario-report/       # ScenarioReport — отчёт о попытке (specs/…/ui-report.md)
│   │   ├── scenario-report.tsx # данные, buildReport, загрузка и «не найдено», порядок блоков
│   │   ├── index.ts            # барель: ScenarioReport
│   │   ├── scenario-report.styles.ts # Section, SectionTitle
│   │   ├── outcome-section.tsx # Итог: штамп, причина, балл, время
│   │   ├── meters-section.tsx  # Шкалы: плитки с итогом и порогом
│   │   ├── meter-chart.tsx     # MeterChart — SVG-график шкалы по решениям
│   │   ├── decisions-section.tsx # Разбор решений и «Лучше было бы»
│   │   ├── topics-section.tsx  # Темы: счётчики оценок, слабые и сильные
│   │   ├── recommendations-section.tsx # Рекомендации: до трёх сценариев
│   │   ├── report-actions.tsx  # «Пройти ещё раз», «Следующий сценарий», «К курсу» или «К сценариям»
│   │   ├── report-view.ts      # VERDICT_LABELS, VERDICT_TONES, isRetryPrimary, meterEffectLabels, speakerName
│   │   ├── sparkline.ts        # sparklinePoints, sparklineY — координаты графика
│   │   └── __tests__/          # sparkline.spec.ts, report-view.spec.ts
│   └── scenario-player/
│       ├── scenario-player.tsx # ScenarioPlayer — экран сценария, сброс попытки при уходе (routing.md)
│       ├── index.ts            # барель: ScenarioPlayer
│       ├── scenario-player.styles.ts # Screen, Zone, слоты и якоря реплики, вариантов, штампа, действий
│       ├── intro.tsx          # Intro — заставка: тема, название, описание, чипы лимита и порогов, «Начать»
│       ├── scene.tsx          # Scene — фон, слоты, реплика, варианты, «Далее»; children — внутри зоны 16:9
│       ├── hud.tsx            # Hud — «Выйти», название, шкалы, таймер сценария, «Во весь экран»
│       ├── finale.tsx         # Finale — штамп, «К отчёту»: saveAttempt и переход к SCENARIO_ATTEMPT
│       ├── use-run-timers.ts  # useRunTimers — остаток времени сценария/узла, тик 250 мс, expired() (scenario-engine.md)
│       ├── speaker-layout.ts  # speakerLayout — слот и сторона реплики для говорящего
│       ├── meter-thresholds.ts # meterThresholds — пороги зачёта шкал с подписями
│       ├── use-player-keys.ts # usePlayerKeys — клавиатура сцены: Enter/Space далее, 1–4 вариант
│       ├── use-fullscreen.ts  # useFullscreen — полноэкранный режим документа
│       └── __tests__/          # use-run-timers.spec.ts — renderHook с моком @/store, jest.useFakeTimers;
│                                 speaker-layout.spec.ts, meter-thresholds.spec.ts,
│                                 use-player-keys.spec.ts, use-fullscreen.spec.ts
├── hooks/
│   ├── index.ts               # барель
│   ├── use-course-param.ts    # useCourseParam — курс из search-параметра COURSE_SEARCH_PARAM или null
│   ├── use-document-title.ts  # useDocumentTitle — заголовок вкладки на время жизни компонента
│   ├── use-value-delta.ts     # useValueDelta — разница с предыдущим значением за время
│   └── __tests__/             # spec на каждый хук
├── pages/
│   ├── home/                  # HomePage — главная, маршрут /, ссылка на курсы, каталог сценариев
│   ├── courses/               # CoursesPage — /courses, список курсов
│   ├── course/                # CoursePage — /courses/:courseId, курс
│   ├── scenario/              # ScenarioPage — /scenarios/:scenarioId, вне лейаута
│   └── scenario-attempt/      # ScenarioAttemptPage — отчёт о попытке, в лейауте
├── store/
│   ├── api.ts                 # createApi + fetchBaseQuery(env.apiUrl), tagTypes (api.md)
│   ├── store.ts               # configureStore, RootState, AppDispatch, useAppDispatch/Selector (state.md)
│   ├── index.ts               # барель: store, api, хуки apis/*, типы, экшены scenarioRun
│   ├── apis/
│   │   ├── scenarios-api.ts   # getScenarios, getScenario — queryFn поверх @/content (api.md)
│   │   ├── courses-api.ts     # getCourses, getCourse — queryFn поверх @/content
│   │   ├── attempts-api.ts    # getAttempts, getAttempt, saveAttempt — queryFn поверх localStorage
│   │   ├── api-error.ts       # apiError(code), orNotFound(value), тип Outcome — приватно для store/apis
│   │   └── __tests__/         # по одному spec на файл, свежий store на тест
│   ├── slices/
│   │   └── scenario-run/      # слайс scenarioRun (state.md, specs/…/engine.md)
│   │       ├── slice.ts       # ScenarioRunState, initialState, createSlice, экшены с prepare(now)
│   │       ├── reducers.ts    # шаги runStarted, advanced, optionChosen, expired; проверка дедлайнов
│   │       ├── enter-node.ts  # enterNode — слияние stage, таймер узла, финал; finish, deadlineAt
│   │       ├── result.ts      # evaluateEnd, computeScore (specs/…/report.md)
│   │       ├── conditions.ts  # holds, resolveNext
│   │       ├── effects.ts     # applyEffect(s) — применение эффектов, meterBounds из @/utils
│   │       ├── selectors.ts   # select* (state.md, specs/…/engine.md#селекторы)
│   │       ├── index.ts       # барель папки: reducer, экшены, селекторы
│   │       └── __tests__/     # fixture.ts + reducers*.spec.ts, result, conditions, effects, selectors, enter-node
│   └── __tests__/             # store.spec.ts
├── styles/
│   ├── theme.ts               # токены: colors, spacing, fontSizes, fontFamily, radii и др.; тип AppTheme
│   ├── global-style.ts        # GlobalStyle — reset, @font-face, стили body, prefers-reduced-motion
│   ├── animations.ts          # keyframes: popIn, floatUp, stampHit, pulse (styling.md#анимации)
│   └── mixins.ts              # css-миксины: listReset, cardStyles, pressableStyles (styling.md#миксины)
├── types/
│   ├── index.ts               # барель: re-export всех namespace
│   ├── character.ts           # namespace Character — персонажи сценариев
│   ├── scenario.ts            # namespace Scenario — формат сценария
│   ├── course.ts              # namespace Course — курс из сценариев
│   ├── attempt.ts             # namespace Attempt — сохранённая попытка
│   ├── report.ts              # namespace Report — отчёт о попытке (только типы, export type)
│   ├── scenario-run.ts        # namespace ScenarioRun — состояние прохождения
│   ├── api.ts                 # namespace Api — коды ошибок RTK Query
│   └── validation.ts          # namespace Validation — Code, Issue, Result, Registries
└── utils/
    ├── index.ts                # барель: formatting, route-links, scenario-engine
    ├── format-*.ts             # formatRemaining (мм:сс), formatTimeLimit (секунды → мм:сс), formatDelta (+/−),
    │                             formatDateTime (`дд.мм.гггг, чч:мм`), formatEstimate (`~N мин`)
    ├── meter-percent.ts        # meterPercent — нормализация значения в проценты [0, 100]
    ├── route-links.ts          # scenarioLink, attemptLink (search-параметр course), courseLink, backLink
    ├── is-awaiting-data.ts     # isAwaitingData — запрос грузится без currentData («Загрузка…»)
    ├── own-value.ts            # ownValue — значение по собственному ключу, без прототипа
    ├── topic-label.ts          # topicLabel — подпись темы из TOPICS или её id
    ├── scenario-engine/
    │   ├── index.ts             # барель: validateScenario, compareAttempts, bestAttempt, courseProgress, buildReport, meterBounds, …
    │   ├── build-report.ts      # buildReport — отчёт о попытке (specs/…/report.md)
    │   ├── recommend.ts         # recommendScenarios, MAX_RECOMMENDATIONS — рекомендации по слабым темам
    │   ├── validate.ts          # validateScenario — фаза 1, фаза 2, предупреждения (specs/…/validation.md)
    │   ├── compare-attempts.ts  # compareAttempts — правило лучшей попытки (scenario-engine.md); attemptDuration
    │   ├── best-attempt.ts      # bestAttempt, scenarioStatus, attemptsOf — лучшая попытка и статус сценария
    │   ├── course-progress.ts   # courseProgress — статусы сценариев курса, зачтено, курс пройден
    │   ├── validate-shape.ts    # фаза 1: схема Scenario.Definition, коды shape.*
    │   ├── shape-schema.ts      # декларативные проверки формы: objectOf, arrayOf, recordOf, variantBy
    │   ├── validate-graph.ts    # фаза 2: коды graph.* (старт, ссылки, переходы, варианты, достижимость)
    │   ├── validate-refs.ts     # фаза 2: коды ref.* (реестры, characters, шкалы)
    │   ├── validate-limits.ts   # фаза 2: meter.range, outcome.*, time.nodeOverScenario
    │   ├── validate-warnings.ts # предупреждения: review.*, flag.*, самопетля, вариант без review
    │   ├── walk.ts              # обход сценария: узлы, варианты, next, условия, эффекты, персонажи с путями
    │   ├── meter-bounds.ts      # meterBounds(meter) — границы шкалы по умолчанию (0/100); hasMeters
    │   ├── issue.ts             # issue(), построение путей
    │   └── __tests__/           # fixtures.ts + validate*.spec.ts, compare-attempts.spec.ts, meter-bounds.spec.ts,
    │                              best-attempt.spec.ts, course-progress.spec.ts;
    │                              report-fixture.ts + build-report*.spec.ts, recommend.spec.ts
    └── __tests__/               # spec на каждый файл utils
```

Назначение папок — [architecture.md](architecture.md#папки-и-их-назначение).
Статика вне `src/` — `public/`, отдаётся от корня сайта: `favicon.svg`,
`characters/*.svg` (заглушки портретов, один SVG на персонажа, кроме
автора) и `backgrounds/*.svg` (заглушки фонов), пути на них — в
`CHARACTERS` и `BACKGROUNDS`; `fonts/` — шрифт Unbounded (`woff2` на
подмножество cyrillic и latin) и `OFL.txt` (styling.md#шрифты).

## Конвенции (короткая выжимка)

- Импорты между папками — через `@/`; внутри папки — относительные.
- Стили — styled-components с токенами из `theme`; глобальное — только
  `global-style.ts`.
- Store и RTK Query хуки — только из `@/store`.
- Маршруты — только `ROUTES`.
- Env — только `env` из `@/config/env`.
- Полные правила — [requirements/client.md](../requirements/client.md).
