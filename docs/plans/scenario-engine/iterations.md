# Этапы и шаги

Один шаг = одна задача: результат, обновление docs и зелёный контур
`yarn lint && yarn format:check && yarn test && yarn build` внутри шага.
Реализация идёт по спецификации
[../../specs/scenario-engine/README.md](../../specs/scenario-engine/README.md).

## Этап 1 — Домен и формат

- [x] **1.1 Типы**: `src/types/scenario.ts`, `course.ts`, `character.ts`,
  `attempt.ts`, `index.ts` по [format.md](format.md).
  Docs: карта `src/` в client/README.md.
- [x] **1.2 Реестры**: `constants/characters.ts` (1–2 наставника, 3–4
  пассажира, автор), `backgrounds.ts`, `topics.ts` с подписями.
  Ассеты пока заглушки в `public/`.
  Docs: client/README.md.
- [x] **1.3 Контент**: папка `src/content/` с первым сценарием (пример из
  format.md, доведённый до полноты) и одним курсом.
  Docs: папка в client/architecture.md и client/README.md.
- [x] **1.4 Валидатор**: `utils/scenario-engine/validate.ts` по
  [engine.md](engine.md), тест прогоняет все JSON из `content/`.
  Docs: client/README.md.

## Этап 2 — Движок

- [x] **2.1 Условия и эффекты**: приватные модули в
  `store/slices/scenario-run/`, тесты на обрезку, порядок применения,
  список условий.
- [x] **2.2 Слайс**: состояние, экшены `runStarted`, `advanced`,
  `optionChosen`, `expired`, `runLeft`, вход в узел, разрешение `next`.
  Тесты через `reducer(state, action)`: ветвление, возврат к узлу,
  истощение шкалы, таймауты, экшены на завершённой попытке.
  Docs: client/state.md, регистрация в `store.ts` и бареле.
- [x] **2.3 Селекторы**: список из [engine.md](engine.md), тесты на
  видимые варианты и `selectAttemptDraft`.
- [x] **2.4 Результат и балл**: правила из [feedback.md](feedback.md)
  внутри слайса и `compareAttempts` в `utils/scenario-engine/`, тесты на
  каждую строку таблицы результата.
  Docs: новый файл `docs/client/scenario-engine.md` с описанием механизма
  (переезжает из плана), ссылка из client/README.md.

## Этап 3 — Данные

- [x] **3.1 Endpoints**: `scenariosApi`, `coursesApi` на `queryFn` из
  бандла; `attemptsApi` на `queryFn` поверх `localStorage` с тегами.
  Docs: client/api.md реестр endpoints.
- [x] **3.2 Хук таймеров**: `containers/scenario-player/use-run-timers.ts`
  читает `selectDeadlines`, тикает, диспатчит `expired`; тест на
  `renderHook` с моком store.

## Этап 4 — Экран сценария

- [ ] **4.1 Маршруты**: `ROUTES.SCENARIO`, `ROUTES.SCENARIO_ATTEMPT`,
  страницы-заглушки. Docs: client/routing.md.
- [ ] **4.2 Компоненты**: `MeterBar`, `Countdown`, `SpeechBubble`,
  `CharacterPortrait`, `ChoiceList`, `Button` в `components/`; токены темы
  для сцены. Docs: client/README.md, client/styling.md.
- [ ] **4.3 Сцена**: `containers/scenario-player/` по [ux.md](ux.md):
  фон, слоты, реплика, варианты, HUD, клавиатура, «Выйти» с подтверждением.
- [ ] **4.4 Карточка и финал**: карточка до старта, финальная реплика,
  сохранение попытки и переход к отчёту.
  Docs: `docs/client/features/scenario-run.md`, ссылка из product flow.

## Этап 5 — Отчёт

- [ ] **5.1 `buildReport`**: блоки из [feedback.md](feedback.md), тесты на
  «лучше было бы», темы, расхождение версий.
- [ ] **5.2 Рекомендации**: слабые темы, кандидаты из каталога, тесты на
  сортировку и лимит.
- [ ] **5.3 Экран отчёта**: `containers/scenario-report/`, страница,
  действия. Docs: features/scenario-run.md.

## Этап 6 — Курсы и результаты

- [ ] **6.1 Лучшая попытка**: селектор по правилу сравнения, тесты.
- [ ] **6.2 Страницы курсов**: `ROUTES.COURSES`, `ROUTES.COURSE`, список
  курсов, курс со сценариями и статусом каждого, «Следующий сценарий» из
  отчёта. Навигация в `AppLayout`, ссылка с главной.
  Docs: routing.md, features, product/flows (курс).
- [ ] **6.3 История попыток**: список попыток на карточке сценария с
  переходом в отчёт.

## Этап 7 — Контент и подготовка к серверу

- [ ] **7.1 Сценарии**: 2–3 полных сценария разных видов: только
  наставник, только пассажир, смешанный с таймерами.
- [ ] **7.2 Персонажи**: портреты по настроениям, фоны; характер каждого
  пассажира описан в product/.
- [ ] **7.3 Контракт API**: описание endpoints, которые заменят `queryFn`,
  в client/api.md; список проверок валидатора, которые переедут на сервер.
- [ ] **7.4 Закрытие плана**: перенос устоявшихся решений в docs/client и
  docs/product, удаление папки плана.

## Вне плана

- Редактор модератора и хранение на сервере.
- Адаптив и мобильная раскладка.
- Достижения и сравнение с коллегами по результатам сценариев.
- Пауза и восстановление прерванной попытки.

## См. также

- [README.md](README.md) — решения и состав плана.
- [../README.md](../README.md) — правила ведения планов.
