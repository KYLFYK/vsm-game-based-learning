import { keyframes } from 'styled-components';

// keyframes не видят тему: значения движения живут здесь, длительности —
// в theme.durations. Масштаб и сдвиг — отдельными свойствами scale и
// translate, чтобы не затирать наклон из transform.
export const popIn = keyframes`
  from { opacity: 0; scale: 0.92; }
  to { opacity: 1; scale: 1; }
`;

export const floatUp = keyframes`
  from { opacity: 1; translate: 0 0; }
  to { opacity: 0; translate: 0 -14px; }
`;

export const stampHit = keyframes`
  from { opacity: 0; scale: 1.4; }
  to { opacity: 1; scale: 1; }
`;

export const pulse = keyframes`
  from { scale: 1; }
  to { scale: 1.06; }
`;
