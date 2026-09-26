import { useMemo } from 'react';

import {
  AchievementCard,
  AchievementGrid,
} from '@/components/achievement-card';
import { Button, ButtonVariant } from '@/components/button';
import { LoadingText, MutedText } from '@/components/muted-text';
import { Page, PageHeader } from '@/components/page';
import { Tabs } from '@/components/tabs';
import { useGetAchievementsQuery, useGetMyAchievementsQuery } from '@/store';
import type { Achievement } from '@/types';
import { achievementViews, isAwaitingData } from '@/utils';

import { AchievementTab } from './achievement-list.enums';
import { EmptyState } from './achievement-list.styles';
import { useAchievementTab } from './use-achievement-tab';

interface GridProps {
  views: Achievement.View[];
  withHowTo: boolean;
}

const Grid = ({ views, withHowTo }: GridProps) => (
  <AchievementGrid>
    {views.map((view) => (
      <AchievementCard
        key={view.id}
        title={view.title}
        description={view.description}
        image={view.image}
        earnedAt={view.earnedAt}
        howTo={withHowTo ? view.howTo : undefined}
      />
    ))}
  </AchievementGrid>
);

export const AchievementList = () => {
  const catalogQuery = useGetAchievementsQuery();
  const earnedQuery = useGetMyAchievementsQuery();
  const [tab, setTab] = useAchievementTab();
  const catalog = catalogQuery.currentData;
  // Без полученных (запрос упал) каталог всё равно показывается
  const earned = earnedQuery.currentData;

  const { all, mine } = useMemo(
    () => achievementViews(catalog ?? [], earned ?? []),
    [catalog, earned]
  );

  if (isAwaitingData([catalogQuery, earnedQuery])) return <LoadingText />;
  if (catalog === undefined) {
    return <MutedText>Не удалось загрузить достижения</MutedText>;
  }

  return (
    <Page>
      <PageHeader kicker="Коллекция" title="Достижения">
        <MutedText>
          Получено {mine.length} из {all.length}
        </MutedText>
      </PageHeader>
      <Tabs
        aria-label="Достижения"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: AchievementTab.Mine, label: `Мои · ${mine.length}` },
          { id: AchievementTab.All, label: `Все · ${all.length}` },
        ]}
      >
        {tab === AchievementTab.All ? (
          <Grid views={all} withHowTo />
        ) : mine.length > 0 ? (
          <Grid views={mine} withHowTo={false} />
        ) : (
          <EmptyState>
            <MutedText>
              Пока нет достижений. Проходите сценарии и курсы, чтобы их
              получить.
            </MutedText>
            <div>
              <Button
                variant={ButtonVariant.Secondary}
                onClick={() => setTab(AchievementTab.All)}
              >
                Все достижения ▸
              </Button>
            </div>
          </EmptyState>
        )}
      </Tabs>
    </Page>
  );
};
