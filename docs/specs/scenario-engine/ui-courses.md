# Экраны курсов

Контейнеры `course-list` и `course-view` на маршрутах `COURSES` и
`COURSE` внутри `AppLayout`. Правила лучшей попытки и прогресса —
[report.md](report.md#лучшая-попытка), общие маршруты — [ui.md](ui.md).

## Навигация

- `AppLayout`: `APP_NAME` — ссылка на `HOME`; `NavLink` «Главная» (`end`)
  и «Курсы». Активный пункт — `accentRed` по `aria-current="page"`.
- На главной — `ButtonLink` «Курсы ▸» (`Secondary`) над каталогом.
- Контекст курса — search-параметр `course`: из курса в сценарий, из
  сценария в отчёт. Ссылки — `scenarioLink`, `attemptLink`, `courseLink`
  из `utils/route-links.ts`.

## `course-list`

- Данные: `useGetCoursesQuery`, `useGetAttemptsQuery({})`.
- Карточка на курс (стиль карточек каталога): название, описание,
  «Зачтено N из M» или «Курс пройден», `ButtonLink` «Открыть» на `COURSE`.
- Загрузка — «Загрузка…»; курсов нет — «Курсов пока нет»; ошибка курсов —
  «Не удалось загрузить курсы». Ошибка попыток — прогресс по пустому
  списку.

## `course-view`

| Файл | Ответственность |
|------|-----------------|
| `course-view.tsx` | Данные, `courseProgress` в `useMemo`, загрузка, «Курс не найден», заголовок вкладки «Курс: <название>» |
| `course-scenario.tsx` | Карточка сценария: «N. Название», `Badge` статуса, описание, `~мин`, лучшая попытка, кнопка |
| `attempt-history.tsx` | История попыток сценария |
| `course-view-model.ts` | `SCENARIO_STATUS_LABELS`, `SCENARIO_STATUS_TONES`, `playLabel`, `nextToPlay` |
| `course-view.styles.ts` | Прогресс, карточка сценария, `StatusBadge`; колонка и плашка «Курс» — `Page`, `PageHeader` из `@/components/page` |

- Данные: `useGetCourseQuery(courseId)`, `useGetScenariosQuery()`,
  `useGetAttemptsQuery({})`; берётся `currentData`.
- Курс не найден — `NotFound` «Курс не найден» с кнопкой «К курсам».
- Прогресс над списком: «Зачтено N из M» или «Курс пройден: все сценарии
  зачтены».
- Метка статуса: `Passed` — «Зачтено» (`accentNavy`), `Failed` —
  «Не зачтено» (`accentRed`), `NotStarted` — «Не начат» (`chipBg`).
- Лучшая попытка: «Лучшая попытка: балл N · мм:сс», без балла — только
  время.
- Кнопка: «Играть» для `NotStarted`, иначе «Пройти ещё раз»;
  `nextToPlay` — первый по порядку незачтённый сценарий, его кнопка
  `Primary`, остальные `Secondary`. Ссылка — `SCENARIO` с `course`.
- Внизу — «◂ К курсам».

## История попыток

- `<details>` с `<summary>` «История попыток (N)», свёрнута; нет попыток —
  блока нет.
- Таблица: «Когда» (`formatDateTime(finishedAt)`, у лучшей — метка
  «Лучшая»), «Итог» (`STAMP_LABELS`), «Балл» (`—` при `null`), «Время»
  (`мм:сс`), «Отчёт» — ссылка «Открыть ▸» на `SCENARIO_ATTEMPT` с `course`.
- Порядок — новые первыми, как отдаёт `getAttempts`.
- Попытки — все попытки сценария, не только начатые из курса.

## Возврат на курс

| Где | При `course` | Без `course` |
|-----|--------------|--------------|
| Заставка, угол | «◂ К курсу» → `COURSE` | «◂ К сценариям» → `HOME` |
| HUD, «Выйти» | `COURSE` после `confirm` | `HOME` после `confirm` |
| Отчёт, последняя кнопка | «К курсу», если курс найден | «К сценариям» |

## Тесты

`course-view/__tests__/course-view-model.spec.ts`,
`utils/__tests__/route-links.spec.ts`, `format-date-time.spec.ts`;
`best-attempt.spec.ts`, `course-progress.spec.ts` — по
[report.md](report.md#тесты).

## См. также

- [ui.md](ui.md) — маршруты, плеер.
- [ui-report.md](ui-report.md) — отчёт.
