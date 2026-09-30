import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats';
import { CourseListComponent } from './components/course-list/course-list';
import { CourseDetailComponent } from './components/course-detail/course-detail';
import { AddCourseModalComponent } from './components/add-course-modal/add-course-modal';
import { CourseService } from './services/course.service';
import { Course, CourseStatus } from './models/course.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStatsComponent,
    CourseListComponent,
    CourseDetailComponent,
    AddCourseModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private courseService = inject(CourseService);

  selectedFilter = signal<string>('All');
  selectedCourse = signal<Course | null>(null);
  showAddCourseModal = signal<boolean>(false);
  toastMessage = signal<string | null>(null);

  onFilterChangedFromStats(filter: string): void {
    this.selectedFilter.set(filter);
  }

  onSelectCourse(course: Course): void {
    this.selectedCourse.set(course);
  }

  onCloseCourseDetail(): void {
    this.selectedCourse.set(null);
  }

  onCourseActionTriggered(event: { courseId: string; newStatus: CourseStatus }): void {
    const updated = this.courseService.courses().find(c => c.id === event.courseId);
    if (updated) {
      this.selectedCourse.set(updated);
      this.showToast(`Updated "${updated.name}" to ${event.newStatus}!`);
    }
  }

  onCourseAdded(): void {
    this.showToast('New course successfully added to your dashboard!');
  }

  onResetData(): void {
    if (confirm('Reset dashboard courses back to default demo data?')) {
      this.courseService.resetToDefaults();
      this.selectedCourse.set(null);
      this.selectedFilter.set('All');
      this.showToast('Reset dashboard data to defaults.');
    }
  }

  showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      if (this.toastMessage() === message) {
        this.toastMessage.set(null);
      }
    }, 3500);
  }
}
