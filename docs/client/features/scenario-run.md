# Прохождение сценария

## Что делает

Прохождение сценария во всё окно: каталог → заставка → сцена → финал →
отчёт.

## Маршруты

- `/` → `HomePage` (`scenario-catalog`).
- `/scenarios/:scenarioId` → `ScenarioPage` (`scenario-player`, без
  `AppLayout`).
- `/scenarios/:scenarioId/attempts/:attemptId` → `ScenarioAttemptPage`
  (заглушка до этапа 5).

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
- `components/*` — `Button`, `ChoiceList`, `SpeechBubble`, `Stamp` и
  другие примитивы сцены.
- `store/apis/scenarios-api.ts` — `getScenarios`, `getScenario`.
- `store/apis/attempts-api.ts` — `saveAttempt`.
- `store/slices/scenario-run/` — слайс попытки.

## Поток (step-by-step)

1. «Играть» в каталоге на главной.
2. Заставка, «Начать» → `runStarted`.
3. Реплики: клик по сцене, «Далее», `Enter` / `Space` → `advanced`.
4. Выбор: клик или `1`–`4` → `optionChosen`.
5. Финал: штамп, «К отчёту» → `saveAttempt` → `SCENARIO_ATTEMPT`.
6. «Выйти» → `confirm` → главная; уход со страницы → `runLeft`.

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
