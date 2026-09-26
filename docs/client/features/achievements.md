# Достижения

## Что делает

Страница достижений с двумя табами: «Мои» — полученные с датой, «Все» —
каталог с условиями получения. Только UI: начисления нет, полученные —
заглушка. Продуктовый флоу — [../../product/flows/achievements.md](../../product/flows/achievements.md).

## Маршруты

- `/achievements` → `AchievementsPage` (`achievement-list`, в `AppLayout`).
- `/achievements?tab=all` — таб «Все»; без параметра — «Мои».

Пункт «Достижения» — в навигации `AppLayout`.

## Файлы

- `pages/achievements/` — страница, заголовок вкладки.
- `containers/achievement-list/` — данные, «Получено N из M», табы, сетка,
  пустое состояние «Моих»; `useAchievementTab` — таб в search-параметре
  ([../containers.md](../containers.md)).
- `components/tabs/` — `Tabs`: табы WAI-ARIA, стрелки, Home, End.
- `components/achievement-card/` — `AchievementCard`, `AchievementGrid`.
- `utils/achievement-views.ts` — `achievementViews`: каталог с датами,
  «мои» — новые первыми.
- `content/achievements.json` — каталог; `content/earned-achievements.mock.ts`
  — заглушка полученных.
- `store/apis/achievements-api.ts`, `types/achievement.ts`.
- `public/achievements/placeholder.svg` — картинка-заглушка для всех.

## Поток (step-by-step)

1. «Достижения» в шапке → таб «Мои»: полученные карточки — картинка,
   название, «Получено дд.мм.гггг».
2. Наведение или фокус на карточке → подсказка с описанием поверх
   картинки.
3. Таб «Все» (клик, стрелки) → `?tab=all`: весь каталог, неполученные
   притушены (`filters.locked`) с меткой «Не получено», у каждой карточки
   «Как получить».
4. «Мои» пусто → пояснение и кнопка «Все достижения ▸».

## API

HTTP-запросов нет: `useGetAchievementsQuery` (бандл) и
`useGetMyAchievementsQuery` (заглушка) на `queryFn` ([../api.md](../api.md)).
При появлении сервера меняется только `queryFn` на `query`.

## Зависимости / гочи

- Картинка — поле `image` достижения; сейчас у всех одна заглушка,
  настоящие подставляются в `achievements.json` без правки UI.
- Описание не видно без наведения, поэтому карточка фокусируемая
  (`tabIndex=0`): подсказка открывается с клавиатуры и по тапу, скринридер
  читает её через `aria-describedby`.
- Переключение таба заменяет запись истории: «назад» уводит со страницы.
- Полученное достижение не из каталога не показывается; для заглушки это
  проверяет тест `content`.
- Запрос полученных упал — каталог показывается, все «не получены».

## См. также

- [../routing.md](../routing.md) — search-параметр `tab`.
- [../styling.md](../styling.md) — токены страницы.
