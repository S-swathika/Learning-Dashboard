import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course, CourseStatus } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (course()) {
      <div class="modal-backdrop" (click)="close.emit()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="modal-header">
            <div class="header-title-area">
              <span class="category-pill">{{ course()?.category || 'General' }}</span>
              <h2 class="course-modal-title">{{ course()?.name }}</h2>
            </div>
            <button class="close-btn" (click)="close.emit()" title="Close details">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            
            <!-- Description -->
            <p class="course-desc">{{ course()?.description }}</p>

            <!-- Key Info Grid -->
            <div class="info-tiles-grid">
              <div class="info-tile">
                <div class="tile-icon font-duration">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <span class="tile-label">Duration</span>
                  <span class="tile-val">{{ course()?.duration }}</span>
                </div>
              </div>

              <div class="info-tile">
                <div class="tile-icon font-lessons">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                  </svg>
                </div>
                <div>
                  <span class="tile-label">Lessons</span>
                  <span class="tile-val">{{ course()?.numberOfLessons }} Lessons</span>
                </div>
              </div>

              <div class="info-tile">
                <div class="tile-icon font-status">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div>
                  <span class="tile-label">Current Status</span>
                  <span class="badge" [ngClass]="getStatusBadgeClass(course()?.status)">
                    {{ course()?.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Learning Progress -->
            <div class="progress-section">
              <div class="progress-header">
                <span>Overall Progress</span>
                <span class="progress-num">{{ course()?.progressPercent }}%</span>
              </div>
              <div class="progress-bar-track">
                <div 
                  class="progress-bar-fill" 
                  [style.width.%]="course()?.progressPercent"
                  [ngClass]="getProgressBarClass(course()?.status)"
                ></div>
              </div>
            </div>

            <!-- Curriculum Outline -->
            <div class="curriculum-preview">
              <h4 class="curriculum-title">Curriculum Modules</h4>
              <ul class="curriculum-list">
                <li class="module-item completed">
                  <span class="mod-icon">✓</span>
                  <span class="mod-name">Module 1: Introduction & Concepts</span>
                  <span class="mod-time">15 min</span>
                </li>
                <li class="module-item" [class.completed]="(course()?.progressPercent || 0) >= 50">
                  <span class="mod-icon">{{ (course()?.progressPercent || 0) >= 50 ? '✓' : '2' }}</span>
                  <span class="mod-name">Module 2: Practical Implementation & Best Practices</span>
                  <span class="mod-time">45 min</span>
                </li>
                <li class="module-item" [class.completed]="(course()?.progressPercent || 0) >= 100">
                  <span class="mod-icon">{{ (course()?.progressPercent || 0) >= 100 ? '✓' : '3' }}</span>
                  <span class="mod-name">Module 3: Assessment & Certification</span>
                  <span class="mod-time">30 min</span>
                </li>
              </ul>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="modal-footer">
            <button class="secondary-btn" (click)="close.emit()">Close</button>
            
            @if (course()?.status === 'Not Started') {
              <button class="primary-btn start-btn" (click)="handleStartCourse()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Start Course
              </button>
            } @else if (course()?.status === 'In Progress') {
              <button class="primary-btn continue-btn" (click)="handleContinueCourse()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                Continue Course
              </button>
            } @else {
              <button class="success-btn" (click)="handleRevisitCourse()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Review Completed Course
              </button>
            }
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-card {
      background: #ffffff;
      border-radius: 20px;
      max-width: 620px;
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    @keyframes slideUp {
      from { transform: translateY(20px) scale(0.98); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .category-pill {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6366f1;
      background: #e0e7ff;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 0.4rem;
    }

    .course-modal-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
      margin: 0;
    }

    .close-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .course-desc {
      font-size: 0.95rem;
      color: #334155;
      line-height: 1.6;
      margin: 0;
    }

    .info-tiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
    }

    .info-tile {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .tile-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .font-duration { background: #e0f2fe; color: #0284c7; }
    .font-lessons { background: #f3e8ff; color: #9333ea; }
    .font-status { background: #fef3c7; color: #d97706; }

    .tile-label {
      font-size: 0.725rem;
      color: #64748b;
      font-weight: 600;
      display: block;
    }

    .tile-val {
      font-size: 0.875rem;
      font-weight: 700;
      color: #0f172a;
    }

    .badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      display: inline-block;
    }

    .badge-completed { background: #d1fae5; color: #047857; }
    .badge-progress { background: #fef3c7; color: #b45309; }
    .badge-pending { background: #f1f5f9; color: #475569; }

    .progress-section {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      margin-bottom: 0.5rem;
    }

    .progress-num {
      color: #6366f1;
      font-weight: 700;
    }

    .progress-bar-track {
      height: 8px;
      background: #f1f5f9;
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.4s ease;
    }

    .bg-success { background: #10b981; }
    .bg-progress { background: #f59e0b; }
    .bg-pending { background: #94a3b8; }

    .curriculum-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.75rem 0;
    }

    .curriculum-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .module-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      background: #f8fafc;
      font-size: 0.85rem;
      color: #475569;
    }

    .module-item.completed {
      background: #f0fdf4;
      color: #166534;
    }

    .mod-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
    }

    .module-item.completed .mod-icon {
      background: #10b981;
      color: #ffffff;
    }

    .mod-name { flex: 1; }
    .mod-time { font-size: 0.75rem; color: #94a3b8; }

    .modal-footer {
      padding: 1.25rem 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    button {
      padding: 0.65rem 1.25rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .secondary-btn {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
    }

    .secondary-btn:hover { background: #f1f5f9; }

    .primary-btn {
      background: #4f46e5;
      border: none;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .primary-btn:hover {
      background: #4338ca;
      transform: translateY(-1px);
    }

    .success-btn {
      background: #10b981;
      border: none;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .success-btn:hover { background: #059669; }
  `]
})
export class CourseDetailComponent {
  private courseService = inject(CourseService);

  course = input<Course | null>(null);
  close = output<void>();
  actionTriggered = output<{ courseId: string; newStatus: CourseStatus }>();

  getStatusBadgeClass(status?: CourseStatus): string {
    switch (status) {
      case 'Completed': return 'badge-completed';
      case 'In Progress': return 'badge-progress';
      default: return 'badge-pending';
    }
  }

  getProgressBarClass(status?: CourseStatus): string {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'In Progress': return 'bg-progress';
      default: return 'bg-pending';
    }
  }

  handleStartCourse(): void {
    const c = this.course();
    if (c) {
      this.courseService.updateCourseStatus(c.id, 'In Progress');
      this.actionTriggered.emit({ courseId: c.id, newStatus: 'In Progress' });
    }
  }

  handleContinueCourse(): void {
    const c = this.course();
    if (c) {
      // Progress to Completed
      this.courseService.updateCourseStatus(c.id, 'Completed');
      this.actionTriggered.emit({ courseId: c.id, newStatus: 'Completed' });
    }
  }

  handleRevisitCourse(): void {
    const c = this.course();
    if (c) {
      this.actionTriggered.emit({ courseId: c.id, newStatus: 'Completed' });
    }
  }
}
