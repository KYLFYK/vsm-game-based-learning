const DATE_TIME = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** Дата и время по местному часовому поясу: `дд.мм.гггг, чч:мм` */
export const formatDateTime = (timestamp: number): string =>
  DATE_TIME.format(timestamp);
