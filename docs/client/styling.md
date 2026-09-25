# Стилизация client

Связка **styled-components 6** + `ThemeProvider` + `createGlobalStyle`.
UI-кита нет: компоненты пишутся на styled-components с токенами темы.

## Тема

Единственный источник токенов — [src/styles/theme.ts](../../src/styles/theme.ts):
`colors`, `spacing`, `fontSizes`, `fontFamily`, `radii`, собранные в объект
`theme`. Тип `AppTheme` расширяет `DefaultTheme` styled-components через
[src/styled.d.ts](../../src/styled.d.ts), поэтому проп `theme` типизирован:
опечатка в имени токена — ошибка `tsc`.

`ThemeProvider` подключается один раз в [src/app.tsx](../../src/app.tsx).
Палитра нейтральная светлая (один акцент `primary`, серые фоны и
текст) и заменяется палитрой продукта после решения о брендинге.

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

## См. также

- [src/styles/theme.ts](../../src/styles/theme.ts), [src/styles/global-style.ts](../../src/styles/global-style.ts)
- [architecture.md](architecture.md) — слои.
