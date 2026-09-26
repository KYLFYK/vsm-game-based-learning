import { useSearchParams } from 'react-router';

import { COURSE_SEARCH_PARAM } from '@/constants/routes';
import type { Course } from '@/types';

/** Курс из search-параметра, с которым открыт сценарий или отчёт; вне курса — `null` */
export const useCourseParam = (): Course.Id | null => {
  const [searchParams] = useSearchParams();
  return searchParams.get(COURSE_SEARCH_PARAM);
};
