import { ACHIEVEMENTS, EARNED_ACHIEVEMENTS_MOCK } from '@/content';
import type { Achievement } from '@/types';

import { api } from '../api';

export const achievementsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAchievements: builder.query<Achievement.Definition[], void>({
      queryFn: () => ({ data: ACHIEVEMENTS }),
      providesTags: ['Achievements'],
    }),
    getMyAchievements: builder.query<Achievement.Earned[], void>({
      queryFn: () => ({ data: EARNED_ACHIEVEMENTS_MOCK }),
      providesTags: ['Achievements'],
    }),
  }),
});

export const { useGetAchievementsQuery, useGetMyAchievementsQuery } =
  achievementsApi;
