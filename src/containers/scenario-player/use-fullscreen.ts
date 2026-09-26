import { useCallback, useEffect, useState } from 'react';

export interface FullscreenControl {
  supported: boolean;
  active: boolean;
  toggle: () => void;
}

const isActive = (): boolean => Boolean(document.fullscreenElement);

// Отказ браузера (нет жеста, iframe без allowfullscreen) — не ошибка
// сценария: кнопка просто ничего не меняет
const ignore = (promise: Promise<void>): void => {
  void promise.catch(() => undefined);
};

/** Полноэкранный режим документа; снимается при размонтировании. */
export const useFullscreen = (): FullscreenControl => {
  const supported = document.fullscreenEnabled;
  const [active, setActive] = useState(isActive);

  useEffect(() => {
    const onChange = () => setActive(isActive());
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      if (isActive()) ignore(document.exitFullscreen());
    };
  }, []);

  const toggle = useCallback(() => {
    ignore(
      isActive()
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen()
    );
  }, []);

  return { supported, active, toggle };
};
