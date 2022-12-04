export interface PopularEvent {
  id: string;
  name: string;
  image: string;
  description: string;
  startDate: Date;
  endDate: Date;
  local: string;
  courseId: string;
  course: string;
  favorites: number;
  isFavorite: boolean;
}
