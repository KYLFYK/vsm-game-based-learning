import { SCENARIOS, toSummary } from '@/content';
import { Api } from '@/types';
import type { Scenario } from '@/types';

import { api } from '../api';
import { apiError } from './api-error';

export const scenariosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getScenarios: builder.query<Scenario.Summary[], void>({
      queryFn: () => ({ data: Object.values(SCENARIOS).map(toSummary) }),
      providesTags: ['Scenarios'],
    }),
    getScenario: builder.query<Scenario.Definition, Scenario.Id>({
      queryFn: (id) => {
        // Object.hasOwn — id вроде `constructor` не должен находиться через прототип
        const scenario = Object.hasOwn(SCENARIOS, id)
          ? SCENARIOS[id]
          : undefined;
        return scenario
          ? { data: scenario }
          : { error: apiError(Api.ErrorCode.NotFound) };
      },
      // Тег только на успех: RTK Query индексирует `draft.tags[type][id]` как
      // обычный объект, и `id` вроде `constructor` иначе резолвится через
      // прототип и ломает инвалидацию
      providesTags: (result, _error, id) =>
        result ? [{ type: 'Scenarios', id }] : [],
    }),
  }),
});

export const { useGetScenariosQuery, useGetScenarioQuery } = scenariosApi;
