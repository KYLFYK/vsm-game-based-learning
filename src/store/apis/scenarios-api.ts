import { SCENARIOS, toSummary } from '@/content';
import type { Scenario } from '@/types';
import { ownValue } from '@/utils';

import { api } from '../api';
import { orNotFound } from './api-error';

export const scenariosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getScenarios: builder.query<Scenario.Summary[], void>({
      queryFn: () => ({ data: Object.values(SCENARIOS).map(toSummary) }),
      providesTags: ['Scenarios'],
    }),
    getScenario: builder.query<Scenario.Definition, Scenario.Id>({
      // id вроде `constructor` не должен находиться через прототип
      queryFn: (id) => orNotFound(ownValue(SCENARIOS, id)),
      // Тег только на успех: RTK Query индексирует `draft.tags[type][id]` как
      // обычный объект, и `id` вроде `constructor` иначе резолвится через
      // прототип и ломает инвалидацию
      providesTags: (result, _error, id) =>
        result ? [{ type: 'Scenarios', id }] : [],
    }),
  }),
});

export const { useGetScenariosQuery, useGetScenarioQuery } = scenariosApi;
