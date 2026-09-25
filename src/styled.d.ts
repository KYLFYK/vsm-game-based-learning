import type { AppTheme } from '@/styles/theme';

// Файл — модуль (есть import), поэтому declare module расширяет типы
// styled-components, а не подменяет их
declare module 'styled-components' {
  // oxlint-disable-next-line typescript/no-empty-object-type -- расширение типа темы
  export interface DefaultTheme extends AppTheme {}
}
