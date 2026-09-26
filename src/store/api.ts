import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@/config/env';

/**
 * Единственный экземпляр RTK Query. Endpoints добавляются через
 * api.injectEndpoints(...) в файлах store/apis/<entity>-api.ts.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: env.apiUrl }),
  tagTypes: ['Scenarios', 'Courses', 'Attempts', 'Achievements'],
  endpoints: () => ({}),
});
