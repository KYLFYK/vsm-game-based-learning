import { styled } from 'styled-components';

/** Текст только для скринридеров: визуально скрыт, в дереве доступности есть */
// Литералы — стандартная техника sr-only, а не размеры дизайна: токенам тут не место
export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
