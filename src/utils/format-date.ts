const DATE = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** Дата по местному часовому поясу: `дд.мм.гггг` */
export const formatDate = (timestamp: number): string => DATE.format(timestamp);
