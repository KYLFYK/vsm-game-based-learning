import { useEffect } from 'react';

/** Ставит заголовок вкладки на время жизни компонента и возвращает прежний. */
export const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    const previous = document.title;
    document.title = title;

    return () => {
      document.title = previous;
    };
  }, [title]);
};
