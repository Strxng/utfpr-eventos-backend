export interface EventResponse {
  id: string;
  name: string;
  image: string;
  description: string;
  startDate: Date;
  endDate: Date;
  local: string;
  courseId: string;
  course: string;
  campus: string;
  favorites: number;
  isFavorite: boolean;
}

export interface SearchEventProps {
  page: number;
  limit: number;
  search: string;
  campusId: string;
  courseId: string;
  userId: string;
}
