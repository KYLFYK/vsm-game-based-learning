# Карта `containers/`

Контейнеры — слой бизнес-логики: RTK Query хуки, redux, side-effects,
разметка раздела ([architecture.md](architecture.md)). Здесь — роль
каждого файла; общая карта `src/` — в [README.md](README.md).

```
containers/
├── layout/app-layout.tsx  # AppLayout — Header (имя, навигация «Главная» / «Курсы» / «Достижения», версия) + Main с <Outlet/>
├── achievement-list/      # AchievementList — страница достижений (features/achievements.md)
│   ├── achievement-list.tsx # данные, achievementViews, «Получено N из M», табы, сетка, пустое состояние «Мои»
│   ├── achievement-list.enums.ts # AchievementTab — mine, all
│   ├── achievement-list.styles.ts # EmptyState
│   ├── use-achievement-tab.ts # useAchievementTab — таб из search-параметра tab, запись с replace
│   └── __tests__/          # use-achievement-tab.spec.tsx
├── course-list/           # CourseList — карточки курсов с прогрессом «Зачтено N из M», «Открыть»
├── course-view/           # CourseView — курс: сценарии по порядку, статус, лучшая попытка, история
│   ├── course-view.tsx     # данные, courseProgress, загрузка и «Курс не найден», список
│   ├── course-scenario.tsx # CourseScenario — карточка сценария: метка статуса, лучшая попытка, «Играть»
│   ├── attempt-history.tsx # AttemptHistory — таблица попыток в <details>, ссылки на отчёт
│   ├── course-view-model.ts # SCENARIO_STATUS_LABELS, SCENARIO_STATUS_TONES, playLabel, nextToPlay
│   ├── course-view.styles.ts # Progress, карточка сценария, StatusBadge
│   └── __tests__/          # course-view-model.spec.ts
├── scenario-catalog/      # ScenarioCatalog — карточки сценариев на главной, «Играть»
├── scenario-report/       # ScenarioReport — отчёт о попытке (specs/…/ui-report.md)
│   ├── scenario-report.tsx # данные, buildReport, загрузка и «не найдено», порядок блоков
│   ├── index.ts            # барель: ScenarioReport
│   ├── scenario-report.styles.ts # Section, SectionTitle
│   ├── outcome-section.tsx # Итог: штамп, причина, балл, время
│   ├── meters-section.tsx  # Шкалы: плитки с итогом и порогом
│   ├── meter-chart.tsx     # MeterChart — SVG-график шкалы по решениям
│   ├── decisions-section.tsx # Разбор решений и «Лучше было бы»
│   ├── topics-section.tsx  # Темы: счётчики оценок, слабые и сильные
│   ├── recommendations-section.tsx # Рекомендации: до трёх сценариев
│   ├── report-actions.tsx  # «Пройти ещё раз», «Следующий сценарий», «К курсу» или «К сценариям»
│   ├── report-view.ts      # VERDICT_LABELS, VERDICT_TONES, isRetryPrimary, meterEffectLabels, speakerName
│   ├── sparkline.ts        # sparklinePoints, sparklineY — координаты графика
│   └── __tests__/          # sparkline.spec.ts, report-view.spec.ts
└── scenario-player/
    ├── scenario-player.tsx # ScenarioPlayer — экран сценария, сброс попытки при уходе (routing.md)
    ├── index.ts            # барель: ScenarioPlayer
    ├── scenario-player.styles.ts # Screen, Zone, слоты и якоря реплики, вариантов, штампа, действий
    ├── intro.tsx          # Intro — заставка: тема, название, описание, чипы лимита и порогов, «Начать»
    ├── scene.tsx          # Scene — фон, слоты, реплика, варианты, «Далее»; children — внутри зоны 16:9
    ├── hud.tsx            # Hud — «Выйти», название, шкалы, таймер сценария, «Во весь экран»
    ├── finale.tsx         # Finale — штамп, «К отчёту»: saveAttempt и переход к SCENARIO_ATTEMPT
    ├── use-run-timers.ts  # useRunTimers — остаток времени сценария/узла, тик 250 мс, expired() (scenario-engine.md)
    ├── speaker-layout.ts  # speakerLayout — слот и сторона реплики для говорящего
    ├── meter-thresholds.ts # meterThresholds — пороги зачёта шкал с подписями
    ├── use-player-keys.ts # usePlayerKeys — клавиатура сцены: Enter/Space далее, 1–4 вариант
    ├── use-fullscreen.ts  # useFullscreen — полноэкранный режим документа
    └── __tests__/          # use-run-timers.spec.ts — renderHook с моком @/store, jest.useFakeTimers;
                              speaker-layout.spec.ts, meter-thresholds.spec.ts,
                              use-player-keys.spec.ts, use-fullscreen.spec.ts
```

## См. также

- [README.md](README.md) — карта `src/`.
- [features/](features/README.md) — флоу, в которых участвуют контейнеры.
