export interface CourseListProps {
  projectId: string;
  dataset: string;
}

export interface CourseData {
  title?: string;
  description?: string;

  thumbnail?: {
    url?: string;
  } | null;
  moduleCount?: number;
  lessonCount?: number;
}
