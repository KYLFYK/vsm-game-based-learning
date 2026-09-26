# Экран отчёта

Контейнер `scenario-report` на маршруте `SCENARIO_ATTEMPT` внутри
`AppLayout`. Порядок блоков — [../../plans/scenario-engine/ux.md](../../plans/scenario-engine/ux.md#экран-отчёта),
данные — `buildReport` ([report.md](report.md)). Общие маршруты и
плеер — [ui.md](ui.md).

## Файлы `containers/scenario-report/`

| Файл | Ответственность |
|------|-----------------|
| `scenario-report.tsx` | Данные, `buildReport` в `useMemo`, загрузка и «не найдено», порядок блоков, заголовок вкладки |
| `outcome-section.tsx` | `Stamp`, `outcome.text`, балл (если не `null`), время `finishedAt - startedAt` в `мм:сс`, пометка о `versionMismatch` |
| `meters-section.tsx`, `meter-chart.tsx` | Плитка на шкалу: подпись, итог, плашка порога, график по решениям |
| `decisions-section.tsx` | Разбор решений: номер, оценка, вопрос, ответ, пояснение, изменения шкал, тема, «Лучше было бы» |
| `topics-section.tsx` | Темы: счётчики `best` / `ok` / `bad`, метка «Стоит подтянуть» или «Сильная сторона» |
| `recommendations-section.tsx` | До трёх сценариев: название, темы-пересечения, «Играть» |
| `report-actions.tsx` | «Пройти ещё раз», «Следующий сценарий», «К курсу» или «К сценариям» |
| `report-view.ts` | Чистые помощники: `VERDICT_LABELS`, `isRetryPrimary`, `meterEffectLabels`, `speakerName` |
| `sparkline.ts` | `sparklinePoints`, `sparklineY` — координаты графика в `viewBox` |
| `scenario-report.styles.ts` | `Root`, заголовки, `cardStyles`, списки, теги, `Actions` |

## Данные

- `useGetAttemptQuery(attemptId)`, `useGetScenarioQuery(scenarioId)`,
  `useGetScenariosQuery()` (каталог рекомендаций),
  `useGetAttemptsQuery({})` (зачтённые сценарии), `useGetCourseQuery(course)`
  при search-параметре `course`, иначе `skip`.
- Берётся `currentData`, как в плеере: при смене параметров `data`
  держит прошлый ответ.
- Загрузка — «Загрузка…», пока любой из запросов идёт без данных.
- Попытки или сценария нет, либо `attempt.scenarioId` не совпадает со
  `scenarioId` из URL — «Попытка не найдена» и `ButtonLink` на `HOME`.
- Курс не найден — отчёт без курса: нет «Следующего сценария».

## Блоки

| Блок | Показ |
|------|-------|
| Итог | Всегда. Статус для скринридера — `VisuallyHidden` с `STAMP_LABELS` перед текстом: `Stamp` декоративен |
| Шкалы | Есть шкалы в сценарии |
| Разбор решений | Есть решения и нет `versionMismatch`; номер — `index + 1`, так же подписаны точки графика |
| Темы | Есть темы |
| Рекомендации | Есть рекомендации; ссылка без `course` — каталог общий |
| Действия | Всегда |

- Вопрос предваряется именем говорящего (`speakerName`); у автора имени
  нет — вопрос и есть его реплика.
- Изменения шкал — только `MeterEffect` (`«Доверие +10»`), флаги —
  внутренние `id` и не показываются.
- Оценка решения — плашка с текстом `VERDICT_LABELS`: `Best` «Лучший
  ответ», `Ok` «Допустимо», `Bad` «Ошибка».

## Действия

- «Пройти ещё раз» → `SCENARIO` с тем же `course`. `isRetryPrimary`
  (`Failed` или балл ниже 100) — первая кнопка и `Primary`, иначе после
  «Следующего сценария» и `Secondary`.
- «Следующий сценарий ▸» → `SCENARIO` для `nextScenarioId` с тем же
  `course`, только при `nextScenarioId`.
- Последняя кнопка: «К курсу» → `COURSE`, если курс из `course` найден,
  иначе «К сценариям» → `HOME`.
- Ссылки собирает `scenarioLink` из `utils/route-links.ts`.

## График шкалы

- SVG с `viewBox` из токенов `report.chartWidth` × `report.chartHeight`,
  отступ `report.chartPad`; ширина растягивается по плитке.
- Линия ряда `series` — `accentRed`, толщина `report.lineWidth`; риска
  порога — горизонталь `accentNavy`; основание — волосяная линия
  `meterTrack`; точка итога — `accentRed` с кольцом цвета фона.
- Одна серия — легенды нет, заголовок плитки называет шкалу.
- `role="img"` и `aria-label` со всеми значениями ряда — текстовая
  замена графика. Наведение на точку показывает `<title>`: «Начало» или
  «После решения N» и значение; зона наведения — `report.hitRadius`.

## Внешний вид

Комиксный стиль карточек каталога ([ui-visual.md](ui-visual.md#экраны)):
белые карточки с контуром `ink` и тенью `navyMd`, заголовки Unbounded в
верхнем регистре, чёрная плашка «Отчёт о попытке» с наклоном, штамп
итога. Колонка ограничена `report.contentWidth`.

## Тесты

`__tests__/sparkline.spec.ts`, `report-view.spec.ts` — чистые помощники; компоненты не тестируются
([../../requirements/general.md](../../requirements/general.md#тесты)).

## См. также

- [report.md](report.md) — правила отчёта и рекомендаций.
- [ui.md](ui.md) — маршруты и остальные экраны.
