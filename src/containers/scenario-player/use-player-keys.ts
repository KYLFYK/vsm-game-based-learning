import { useEffect, useRef } from 'react';

import { MAX_CHOICE_OPTIONS } from '@/utils';

export interface PlayerKeyHandlers {
  onAdvance?: () => void;
  /** Индекс видимого варианта с нуля */
  onChoose?: (index: number) => void;
}

// Enter и Space на кнопке браузер сам превращает в клик; обработав их ещё и
// здесь, получили бы двойной переход
const INTERACTIVE = 'button, a[href], input, select, textarea';

const isInteractive = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(INTERACTIVE) !== null;

const hasModifier = (event: KeyboardEvent): boolean =>
  event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

/** Клавиатура сцены: `Enter`/`Space` — далее, `1`–`4` — вариант. */
export const usePlayerKeys = (
  active: boolean,
  handlers: PlayerKeyHandlers
): void => {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || hasModifier(event)) return;
      const { onAdvance, onChoose } = handlersRef.current;

      if (event.key === 'Enter' || event.key === ' ') {
        if (onAdvance === undefined || isInteractive(event.target)) return;
        event.preventDefault();
        onAdvance();
        return;
      }

      const digit = Number(event.key);
      if (
        onChoose !== undefined &&
        Number.isInteger(digit) &&
        digit >= 1 &&
        digit <= MAX_CHOICE_OPTIONS
      ) {
        event.preventDefault();
        onChoose(digit - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);
};
