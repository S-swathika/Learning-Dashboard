export type CourseStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  numberOfLessons: number;
  status: CourseStatus;
  createdAt: string;
  progressPercent: number;
  category?: string;
  icon?: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
}
