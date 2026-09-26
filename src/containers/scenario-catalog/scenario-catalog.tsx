import { ButtonLink } from '@/components/button';
import { CatalogCard, CatalogGrid } from '@/components/catalog-card';
import { LoadingText, MutedText } from '@/components/muted-text';
import { TagList } from '@/components/tag';
import { useGetScenariosQuery } from '@/store';
import {
  formatEstimate,
  formatTimeLimit,
  scenarioLink,
  topicLabel,
} from '@/utils';

export const ScenarioCatalog = () => {
  const { data: scenarios, isLoading } = useGetScenariosQuery();

  if (isLoading) return <LoadingText />;
  if (scenarios === undefined) {
    return <MutedText>Не удалось загрузить сценарии</MutedText>;
  }

  return (
    <CatalogGrid>
      {scenarios.map((scenario) => (
        <CatalogCard
          key={scenario.id}
          title={scenario.title}
          heading="h3"
          description={scenario.description}
          meta={
            <>
              {formatEstimate(scenario.estimatedMinutes)}
              {scenario.timeLimitSec !== undefined &&
                ` · ${formatTimeLimit(scenario.timeLimitSec)}`}
            </>
          }
          action={
            <ButtonLink to={scenarioLink(scenario.id)}>Играть</ButtonLink>
          }
        >
          <TagList tags={scenario.topics.map(topicLabel)} />
        </CatalogCard>
      ))}
    </CatalogGrid>
  );
};
