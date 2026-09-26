# Стилизация client

Связка **styled-components 6** + `ThemeProvider` + `createGlobalStyle`.
UI-кита нет: компоненты пишутся на styled-components с токенами темы.

## Тема

Единственный источник токенов — [src/styles/theme.ts](../../src/styles/theme.ts):
`colors`, `spacing`, `fontSizes`, `gameFontSizes`, `fontFamily`,
`fontFamilyDisplay`, `radii`, `borders`, `shadows`, `tilts`, `filters`,
`offsets`, `zIndices`, `durations` (мс), `stage`, собранные в объект
`theme`. Тип `AppTheme` расширяет `DefaultTheme` styled-components через
[src/styled.d.ts](../../src/styled.d.ts), поэтому проп `theme` типизирован:
опечатка в имени токена — ошибка `tsc`.

`ThemeProvider` подключается один раз в [src/app.tsx](../../src/app.tsx).
Палитра приложения нейтральная светлая (один акцент `primary`, серые фоны
и текст); игровые экраны сценария используют отдельную игровую палитру.
Значения игровых токенов (`gameFontSizes`, `borders`, `shadows`, `tilts`,
`filters`, `offsets`, `zIndices`, `durations`, `stage` и часть `colors`)
описаны в [specs/scenario-engine/ui-visual.md](../specs/scenario-engine/ui-visual.md),
здесь не дублируются.

### Шрифты

- Системный `fontFamily` — текст по умолчанию.
- `fontFamilyDisplay` — Unbounded (лицензия OFL), только для акцентов
  игрового экрана: заголовки, HUD, кнопки, штамп, имена.
- Файлы шрифта — `public/fonts/unbounded-cyrillic.woff2`,
  `unbounded-latin.woff2`, `OFL.txt`. `@font-face` объявлены в
  [global-style.ts](../../src/styles/global-style.ts), preload
  подмножества cyrillic — в [index.html](../../index.html).

### Анимации

- Keyframes — [src/styles/animations.ts](../../src/styles/animations.ts):
  `popIn`, `floatUp`, `stampHit`, `pulse`. Значения движения (масштаб,
  сдвиг) живут там, потому что keyframes не видят тему; длительности —
  токены `theme.durations` (мс), подставляются в styled-компоненте.
- Масштаб и сдвиг задаются свойствами `scale`/`translate`, а не
  `transform`, чтобы не затирать наклон (`tilts`), заданный отдельным
  `transform`.
- Глобальное правило `prefers-reduced-motion: reduce` — в
  [global-style.ts](../../src/styles/global-style.ts): отключает
  анимации и переходы для всего приложения.

## Основной паттерн

Styled-компоненты объявляются в файле компонента **до** React-компонента:

```tsx
import { styled } from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
`;

export const MyBlock = () => <Wrapper>…</Wrapper>;
```

Для крупных компонентов с большим числом styled-элементов — отдельный файл
`<component-name>.styles.ts` рядом.

## Правила

- Токены — только через `theme`. Литералы цветов, отступов и шрифтов в
  styled-компонентах запрещены: нужен новый токен — добавь его в `theme.ts`
  и опиши здесь.
- Имена styled-компонентов — PascalCase по роли: `Root`, `Header`, `Title`.
  Не дублировать имя компонента (`Root`, а не `AppLayoutRoot`).
- Inline-стили, CSS Modules, `&&` — запрещены
  ([requirements/client.md](../requirements/client.md#стили)).
- Глобальные стили (reset, `html/body/#root`, шрифт, фон) — только в
  [src/styles/global-style.ts](../../src/styles/global-style.ts).

## Когда что использовать

| Что нужно | Решение |
|-----------|---------|
| Лейаут, отступы, цвета компонента | styled-компонент с токенами `theme` |
| Новый цвет или размер | Токен в `theme.ts` |
| Сбросы, `*`-селекторы, `body` | `global-style.ts` |
| Тёмная тема | Второй объект темы того же типа `AppTheme` и переключение в `ThemeProvider` |
| Анимация | keyframes в `styles/animations.ts`, длительность из `theme.durations` |
| Текст только для скринридеров | `VisuallyHidden` из `@/components` (sr-only; единственное место с литералами `1px`/`-1px`/`0`) |

## См. также

- [src/styles/theme.ts](../../src/styles/theme.ts), [src/styles/global-style.ts](../../src/styles/global-style.ts)
- [architecture.md](architecture.md) — слои.
