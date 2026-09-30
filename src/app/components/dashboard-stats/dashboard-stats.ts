import { Component, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { CourseStatus } from '../../models/course.model';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      <!-- Total Courses Card -->
      <div 
        class="stat-card total"
        [class.active]="selectedFilter() === 'All'"
        (click)="onSelectFilter('All')"
      >
        <div class="stat-icon-wrapper total-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Courses</span>
          <div class="stat-value-container">
            <span class="stat-number">{{ stats().total }}</span>
            <span class="stat-badge info">All Enrolled</span>
          </div>
          <div class="stat-meter-bar">
            <div class="stat-meter-fill info-fill" style="width: 100%"></div>
          </div>
        </div>
      </div>

      <!-- Completed Courses Card -->
      <div 
        class="stat-card completed"
        [class.active]="selectedFilter() === 'Completed'"
        (click)="onSelectFilter('Completed')"
      >
        <div class="stat-icon-wrapper completed-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Courses Completed</span>
          <div class="stat-value-container">
            <span class="stat-number">{{ stats().completed }}</span>
            <span class="stat-badge success">{{ stats().completionRate }}% Rate</span>
          </div>
          <div class="stat-meter-bar">
            <div class="stat-meter-fill success-fill" [style.width.%]="stats().completionRate"></div>
          </div>
        </div>
      </div>

      <!-- In Progress Courses Card -->
      <div 
        class="stat-card in-progress"
        [class.active]="selectedFilter() === 'In Progress'"
        (click)="onSelectFilter('In Progress')"
      >
        <div class="stat-icon-wrapper progress-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Courses in Progress</span>
          <div class="stat-value-container">
            <span class="stat-number">{{ stats().inProgress }}</span>
            <span class="stat-badge warning">Active Learning</span>
          </div>
          <div class="stat-meter-bar">
            <div class="stat-meter-fill warning-fill" [style.width.%]="stats().total ? (stats().inProgress / stats().total * 100) : 0"></div>
          </div>
        </div>
      </div>

      <!-- Not Started Courses Card -->
      <div 
        class="stat-card not-started"
        [class.active]="selectedFilter() === 'Not Started'"
        (click)="onSelectFilter('Not Started')"
      >
        <div class="stat-icon-wrapper pending-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">Courses Not Started</span>
          <div class="stat-value-container">
            <span class="stat-number">{{ stats().notStarted }}</span>
            <span class="stat-badge neutral">Pending</span>
          </div>
          <div class="stat-meter-bar">
            <div class="stat-meter-fill neutral-fill" [style.width.%]="stats().total ? (stats().notStarted / stats().total * 100) : 0"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--card-bg, #ffffff);
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
      position: relative;
      overflow: hidden;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
      border-color: var(--primary-light, #818cf8);
    }

    .stat-card.active {
      border-color: #6366f1;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(255, 255, 255, 1) 100%);
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25), 0 8px 16px -4px rgba(99, 102, 241, 0.15);
    }

    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .total-icon { background: rgba(99, 102, 241, 0.12); color: #6366f1; }
    .completed-icon { background: rgba(16, 185, 129, 0.12); color: #10b981; }
    .progress-icon { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
    .pending-icon { background: rgba(100, 116, 139, 0.12); color: #64748b; }

    .stat-content {
      flex: 1;
      min-width: 0;
    }

    .stat-label {
      font-size: 0.825rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 0.35rem;
    }

    .stat-value-container {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .stat-number {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
    }

    .stat-badge {
      font-size: 0.725rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .stat-badge.info { background: #e0e7ff; color: #4338ca; }
    .stat-badge.success { background: #d1fae5; color: #047857; }
    .stat-badge.warning { background: #fef3c7; color: #b45309; }
    .stat-badge.neutral { background: #f1f5f9; color: #475569; }

    .stat-meter-bar {
      height: 4px;
      width: 100%;
      background: #f1f5f9;
      border-radius: 999px;
      overflow: hidden;
    }

    .stat-meter-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.5s ease-out;
    }

    .info-fill { background: #6366f1; }
    .success-fill { background: #10b981; }
    .warning-fill { background: #f59e0b; }
    .neutral-fill { background: #94a3b8; }
  `]
})
export class DashboardStatsComponent {
  private courseService = inject(CourseService);
  stats = this.courseService.stats;

  selectedFilter = input<string>('All');
  filterChange = output<string>();

  onSelectFilter(filter: string): void {
    this.filterChange.emit(filter);
  }
}
