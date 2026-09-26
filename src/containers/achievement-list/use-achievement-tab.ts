import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

import { ACHIEVEMENT_TAB_SEARCH_PARAM } from '@/constants/routes';

import { AchievementTab } from './achievement-list.enums';

/**
 * Активный таб из search-параметра: переживает перезагрузку и даёт ссылку
 * на таб. Без параметра или с неизвестным значением — «Мои»; переключение
 * заменяет запись истории, чтобы «назад» уводил со страницы, а не по табам
 */
export const useAchievementTab = (): [
  AchievementTab,
  (tab: AchievementTab) => void,
] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab =
    searchParams.get(ACHIEVEMENT_TAB_SEARCH_PARAM) === AchievementTab.All
      ? AchievementTab.All
      : AchievementTab.Mine;

  const setTab = useCallback(
    (next: AchievementTab) => {
      setSearchParams(
        (current) => {
          const params = new URLSearchParams(current);
          if (next === AchievementTab.Mine) {
            params.delete(ACHIEVEMENT_TAB_SEARCH_PARAM);
          } else {
            params.set(ACHIEVEMENT_TAB_SEARCH_PARAM, next);
          }
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return [tab, setTab];
};
