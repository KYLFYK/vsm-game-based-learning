/**
 * Индекс таба после клавиши в списке табов: стрелки по кругу, Home и End —
 * к краям (паттерн WAI-ARIA Tabs). Не клавиша навигации — `null`
 */
export const nextTabIndex = (
  key: string,
  index: number,
  count: number
): number | null => {
  switch (key) {
    case 'ArrowRight':
      return (index + 1) % count;
    case 'ArrowLeft':
      return (index - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
};
