import { COURSES } from '@/content';
import type { Course } from '@/types';

import { api } from '../api';
import { orNotFound } from './api-error';

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course.Definition[], void>({
      queryFn: () => ({ data: COURSES }),
      providesTags: ['Courses'],
    }),
    getCourse: builder.query<Course.Definition, Course.Id>({
      queryFn: (id) => orNotFound(COURSES.find((item) => item.id === id)),
      providesTags: (_result, _error, id) => [{ type: 'Courses', id }],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseQuery } = coursesApi;
