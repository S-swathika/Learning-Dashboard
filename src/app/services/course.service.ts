import { Injectable, signal, computed } from '@angular/core';
import { Course, CourseStatus, DashboardStats } from '../models/course.model';

const STORAGE_KEY = 'rapl_learning_dashboard_courses_v1';

const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    name: 'Angular Fundamentals & Modern Standards',
    description: 'Master Angular Standalone components, Signals, Dependency Injection, RxJS, and clean architecture best practices.',
    duration: '3 hours',
    numberOfLessons: 12,
    status: 'Completed',
    createdAt: '2026-09-01T10:00:00Z',
    progressPercent: 100,
    category: 'Technical',
    icon: 'code'
  },
  {
    id: 'c2',
    name: 'RapL SaaS Platform Onboarding & Workflows',
    description: 'Comprehensive guide to RapL administration, micro-learning content distribution, assessment creation, and user management.',
    duration: '1.5 hours',
    numberOfLessons: 8,
    status: 'In Progress',
    createdAt: '2026-09-10T14:30:00Z',
    progressPercent: 65,
    category: 'Onboarding',
    icon: 'rocket'
  },
  {
    id: 'c3',
    name: 'Building Micro-Learning Content & Quizzes',
    description: 'Learn how to construct bite-sized learning cards, AI-boosted knowledge retention quizzes, and dynamic assessment workflows.',
    duration: '4 hours',
    numberOfLessons: 15,
    status: 'Not Started',
    createdAt: '2026-09-15T09:15:00Z',
    progressPercent: 0,
    category: 'Content Creation',
    icon: 'book'
  },
  {
    id: 'c4',
    name: 'Enterprise Security & Compliance 2026',
    description: 'Essential data security policies, GDPR compliance, web accessibility guidelines, and authentication protocols for enterprise web apps.',
    duration: '1 hour',
    numberOfLessons: 6,
    status: 'In Progress',
    createdAt: '2026-09-18T11:00:00Z',
    progressPercent: 33,
    category: 'Compliance',
    icon: 'shield'
  },
  {
    id: 'c5',
    name: 'Effective AI-Powered Learning Analytics',
    description: 'Utilize RapL AI insights, generate custom learner performance reports, track engagement trends, and optimize training outcomes.',
    duration: '2.5 hours',
    numberOfLessons: 10,
    status: 'Not Started',
    createdAt: '2026-09-22T16:45:00Z',
    progressPercent: 0,
    category: 'Analytics',
    icon: 'chart'
  },
  {
    id: 'c6',
    name: 'Advanced TypeScript & Reactive Patterns',
    description: 'Deep dive into advanced TypeScript generic types, RxJS state management, asynchronous data flows, and performance optimization.',
    duration: '5 hours',
    numberOfLessons: 18,
    status: 'Completed',
    createdAt: '2026-09-05T08:00:00Z',
    progressPercent: 100,
    category: 'Technical',
    icon: 'cpu'
  }
];

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly coursesSignal = signal<Course[]>(this.loadCourses());

  // Exposed read-only signal
  readonly courses = this.coursesSignal.asReadonly();

  // Computed dashboard metrics signal
  readonly stats = computed<DashboardStats>(() => {
    const list = this.coursesSignal();
    const total = list.length;
    const completed = list.filter(c => c.status === 'Completed').length;
    const inProgress = list.filter(c => c.status === 'In Progress').length;
    const notStarted = list.filter(c => c.status === 'Not Started').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      completionRate
    };
  });

  private loadCourses(): Course[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load courses from localStorage, falling back to initial seed data:', e);
    }
    return INITIAL_COURSES;
  }

  private saveCourses(courses: Course[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save courses to localStorage:', e);
    }
  }

  addCourse(newCourseData: {
    name: string;
    description: string;
    duration: string;
    numberOfLessons: number;
    status: CourseStatus;
    category?: string;
  }): Course {
    let progressPercent = 0;
    if (newCourseData.status === 'Completed') {
      progressPercent = 100;
    } else if (newCourseData.status === 'In Progress') {
      progressPercent = 40;
    }

    const newCourse: Course = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: newCourseData.name,
      description: newCourseData.description,
      duration: newCourseData.duration,
      numberOfLessons: Number(newCourseData.numberOfLessons),
      status: newCourseData.status,
      createdAt: new Date().toISOString(),
      progressPercent,
      category: newCourseData.category || 'General',
      icon: 'book'
    };

    const updated = [newCourse, ...this.coursesSignal()];
    this.coursesSignal.set(updated);
    this.saveCourses(updated);
    return newCourse;
  }

  updateCourseStatus(id: string, newStatus: CourseStatus): Course | null {
    const current = this.coursesSignal();
    const index = current.findIndex(c => c.id === id);
    if (index === -1) return null;

    let newProgress = current[index].progressPercent;
    if (newStatus === 'Completed') {
      newProgress = 100;
    } else if (newStatus === 'In Progress') {
      newProgress = newProgress === 0 || newProgress === 100 ? 50 : newProgress;
    } else if (newStatus === 'Not Started') {
      newProgress = 0;
    }

    const updatedCourse: Course = {
      ...current[index],
      status: newStatus,
      progressPercent: newProgress
    };

    const updatedList = [...current];
    updatedList[index] = updatedCourse;
    this.coursesSignal.set(updatedList);
    this.saveCourses(updatedList);
    return updatedCourse;
  }

  deleteCourse(id: string): void {
    const updated = this.coursesSignal().filter(c => c.id !== id);
    this.coursesSignal.set(updated);
    this.saveCourses(updated);
  }

  resetToDefaults(): void {
    this.coursesSignal.set(INITIAL_COURSES);
    this.saveCourses(INITIAL_COURSES);
  }
}
