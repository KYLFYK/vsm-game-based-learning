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
        const scenario = SCENARIOS[id];
        return scenario
          ? { data: scenario }
          : { error: apiError(Api.ErrorCode.NotFound) };
      },
      providesTags: (_result, _error, id) => [{ type: 'Scenarios', id }],
    }),
  }),
});

export const { useGetScenariosQuery, useGetScenarioQuery } = scenariosApi;
