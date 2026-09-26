import { COURSES } from '@/content';
import { Api } from '@/types';
import type { Course } from '@/types';

import { api } from '../api';
import { apiError } from './api-error';

export const coursesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course.Definition[], void>({
      queryFn: () => ({ data: COURSES }),
      providesTags: ['Courses'],
    }),
    getCourse: builder.query<Course.Definition, Course.Id>({
      queryFn: (id) => {
        const course = COURSES.find((item) => item.id === id);
        return course
          ? { data: course }
          : { error: apiError(Api.ErrorCode.NotFound) };
      },
      providesTags: (_result, _error, id) => [{ type: 'Courses', id }],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseQuery } = coursesApi;
