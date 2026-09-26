# Прохождение сценария

## Что делает

Прохождение сценария во всё окно: каталог → заставка → сцена → финал →
отчёт с разбором решений и рекомендациями.

## Маршруты

- `/` → `HomePage` (`scenario-catalog`).
- `/scenarios/:scenarioId` → `ScenarioPage` (`scenario-player`, без
  `AppLayout`).
- `/scenarios/:scenarioId/attempts/:attemptId` → `ScenarioAttemptPage`
  (`scenario-report`, в `AppLayout`); search-параметр `course` — контекст
  курса.

## Файлы

- `pages/home/`, `pages/scenario/`, `pages/scenario-attempt/` — страницы.
- `containers/scenario-catalog/` — `ScenarioCatalog`: карточки сценариев
  с темами, длительностью, лимитом и «Играть».
- `containers/scenario-player/`:
  - `scenario-player.tsx` — загрузка сценария, переключение по статусу
    попытки, «Выйти», `runLeft` при уходе;
  - `intro.tsx` — заставка и «Начать»;
  - `scene.tsx` — фон, слоты, реплика, варианты, «Далее»;
  - `hud.tsx` — «Выйти», название, шкалы, таймер, «Во весь экран»;
  - `finale.tsx` — штамп и «К отчёту» с сохранением попытки;
  - `use-run-timers.ts`, `use-player-keys.ts`, `use-fullscreen.ts`,
    `speaker-layout.ts`, `meter-thresholds.ts` — хуки и расчёты сцены.
- `containers/scenario-report/` — `ScenarioReport`: итог, шкалы с
  графиком, разбор решений, темы, рекомендации, действия
  ([ui-report.md](../../specs/scenario-engine/ui-report.md)).
- `utils/scenario-engine/build-report.ts`, `recommend.ts` — отчёт и
  рекомендации.
- `components/*` — `Button`, `ChoiceList`, `SpeechBubble`, `Stamp` и
  другие примитивы сцены.
- `store/apis/scenarios-api.ts` — `getScenarios`, `getScenario`.
- `store/apis/attempts-api.ts` — `saveAttempt`, `getAttempt`,
  `getAttempts`.
- `store/apis/courses-api.ts` — `getCourse` для «Следующего сценария».
- `store/slices/scenario-run/` — слайс попытки.

## Поток (step-by-step)

1. «Играть» в каталоге на главной.
2. Заставка, «Начать» → `runStarted`.
3. Реплики: клик по сцене, «Далее», `Enter` / `Space` → `advanced`.
4. Выбор: клик или `1`–`4` → `optionChosen`.
5. Финал: штамп, «К отчёту» → `saveAttempt` → `SCENARIO_ATTEMPT`.
6. Отчёт: `buildReport` из попытки, сценария, каталога и всех попыток;
   «Пройти ещё раз» и «Следующий сценарий» ведут на `SCENARIO` с тем же
   `course`, рекомендации — без него.
7. «Выйти» → `confirm` → главная; уход со страницы → `runLeft`.

## API

HTTP-запросов нет: `queryFn` поверх бандла сценариев и `localStorage`
([../api.md](../api.md)).

## Зависимости / гочи

- Fullscreen API вызывается только по клику; отказ браузера молча
  игнорируется.
- Клавиши сцены пропускают `Enter` / `Space`, когда фокус на кнопке.
- На финале `Enter` / `Space` нажимают «К отчёту»: после последней
  реплики фокус на `body`, без этого клавиатура упиралась бы в тупик.
- Сцена игнорирует второй клик двойного клика (`event.detail > 1`):
  двойной клик по «Начать» или варианту не пропускает следующую реплику.
- Перезагрузка страницы показывает заставку: попытка теряется намеренно.
- `window.confirm` на «Выйти» блокирует страницу, а игровое время идёт:
  попытка может истечь сразу после отмены диалога — так задумано правилом
  реального времени.
- Отчёт по попытке старой версии сценария показывает только итог и
  шкалы: тексты узлов могли измениться.
- «К курсу» в отчёте появится вместе со страницами курсов (этап 6).
- Таймеры сценария и узла — из `useRunTimers`
  ([../scenario-engine.md](../scenario-engine.md)).

## См. также

- [../../specs/scenario-engine/ui.md](../../specs/scenario-engine/ui.md) —
  экраны и поведение плеера.
- [../../specs/scenario-engine/ui-visual.md](../../specs/scenario-engine/ui-visual.md)
  — визуальный стиль.
- [../scenario-engine.md](../scenario-engine.md) — движок попытки.
- [../../product/flows/scenario-run.md](../../product/flows/scenario-run.md)
  — продуктовый флоу.
