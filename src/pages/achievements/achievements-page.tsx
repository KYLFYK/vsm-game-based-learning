import { AchievementList } from '@/containers/achievement-list';
import { useDocumentTitle } from '@/hooks';

export const AchievementsPage = () => {
  useDocumentTitle('Достижения');

  return <AchievementList />;
};
