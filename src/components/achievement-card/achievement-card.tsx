import { useId } from 'react';

import { Badge } from '@/components/tag';
import { formatDate } from '@/utils';

import {
  Card,
  HowTo,
  HowToLabel,
  Image,
  Picture,
  Status,
  Title,
  Tooltip,
} from './achievement-card.styles';

interface AchievementCardProps {
  title: string;
  description: string;
  image: string;
  /** Дата получения; не получено — `null` */
  earnedAt: number | null;
  /** Условие получения; без него блок «Как получить» не показывается */
  howTo?: string;
}

/**
 * Карточка достижения в сетке (`AchievementGrid`). Описание — подсказка при
 * наведении и фокусе; карточка фокусируемая, чтобы подсказка открывалась с
 * клавиатуры и по тапу, а скринридер читал описание через aria-describedby
 */
export const AchievementCard = ({
  title,
  description,
  image,
  earnedAt,
  howTo,
}: AchievementCardProps) => {
  const tooltipId = useId();
  const locked = earnedAt === null;

  return (
    <Card tabIndex={0} aria-describedby={tooltipId}>
      <Picture>
        <Image src={image} alt="" $locked={locked} />
        <Tooltip id={tooltipId} role="tooltip">
          {description}
        </Tooltip>
      </Picture>
      <Title>{title}</Title>
      {locked ? (
        <Status>
          <Badge>Не получено</Badge>
        </Status>
      ) : (
        <Status>
          Получено{' '}
          <time dateTime={new Date(earnedAt).toISOString()}>
            {formatDate(earnedAt)}
          </time>
        </Status>
      )}
      {howTo !== undefined && (
        <HowTo>
          <HowToLabel>Как получить</HowToLabel>
          {howTo}
        </HowTo>
      )}
    </Card>
  );
};
