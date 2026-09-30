import { Component, inject, computed, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course, CourseStatus } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="course-list-container">
      
      <!-- Controls Toolbar -->
      <div class="list-controls-bar">
        
        <!-- Search Input -->
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search by course title or keyword..."
          />
          @if (searchQuery()) {
            <button class="clear-search-btn" (click)="searchQuery.set('')" title="Clear search">✕</button>
          }
        </div>

        <!-- Filters & Sort Group -->
        <div class="filters-group">
          
          <!-- Status Filter Pills -->
          <div class="status-pills">
            <button 
              class="pill-btn" 
              [class.active]="selectedStatus() === 'All'"
              (click)="selectedStatus.set('All')"
            >
              All ({{ totalCount() }})
            </button>
            <button 
              class="pill-btn" 
              [class.active]="selectedStatus() === 'Completed'"
              (click)="selectedStatus.set('Completed')"
            >
              Completed
            </button>
            <button 
              class="pill-btn" 
              [class.active]="selectedStatus() === 'In Progress'"
              (click)="selectedStatus.set('In Progress')"
            >
              In Progress
            </button>
            <button 
              class="pill-btn" 
              [class.active]="selectedStatus() === 'Not Started'"
              (click)="selectedStatus.set('Not Started')"
            >
              Not Started
            </button>
          </div>

          <!-- Sort Select -->
          <div class="sort-wrapper">
            <label for="sortSelect" class="sort-label">Sort by:</label>
            <select id="sortSelect" [(ngModel)]="sortBy">
              <option value="nameAsc">Name (A - Z)</option>
              <option value="nameDesc">Name (Z - A)</option>
              <option value="lessons">Most Lessons</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Results Summary Counter -->
      <div class="results-meta">
        <span>Showing <strong>{{ filteredCourses().length }}</strong> of {{ totalCount() }} courses</span>
        @if (searchQuery() || selectedStatus() !== 'All') {
          <button class="reset-filters-link" (click)="resetFilters()">Clear Filters</button>
        }
      </div>

      <!-- Courses Grid / Empty State -->
      @if (filteredCourses().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search query or status filter criteria.</p>
          <button class="btn-secondary" (click)="resetFilters()">Reset All Filters</button>
        </div>
      } @else {
        <div class="courses-grid">
          @for (course of filteredCourses(); track course.id) {
            <div class="course-card" (click)="selectCourse.emit(course)">
              
              <!-- Card Header -->
              <div class="card-header">
                <span class="category-badge">{{ course.category || 'General' }}</span>
                <span class="status-badge" [ngClass]="getStatusBadgeClass(course.status)">
                  <span class="status-dot"></span>
                  {{ course.status }}
                </span>
              </div>

              <!-- Title & Description -->
              <h3 class="course-title">{{ course.name }}</h3>
              <p class="course-description">{{ course.description }}</p>

              <!-- Progress Bar -->
              <div class="card-progress">
                <div class="progress-info">
                  <span>Progress</span>
                  <span class="progress-percentage">{{ course.progressPercent }}%</span>
                </div>
                <div class="bar-track">
                  <div 
                    class="bar-fill" 
                    [style.width.%]="course.progressPercent"
                    [ngClass]="getProgressBarClass(course.status)"
                  ></div>
                </div>
              </div>

              <!-- Footer Meta & Actions -->
              <div class="card-footer">
                <div class="meta-items">
                  <span class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ course.duration }}
                  </span>
                  <span class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                    </svg>
                    {{ course.numberOfLessons }} Lessons
                  </span>
                </div>

                <button 
                  class="action-btn"
                  [ngClass]="getActionButtonClass(course.status)"
                  (click)="$event.stopPropagation(); handleAction(course)"
                >
                  @if (course.status === 'Not Started') {
                    Start
                  } @else if (course.status === 'In Progress') {
                    Continue
                  } @else {
                    Review
                  }
                </button>
              </div>

            </div>
          }
        </div>
      }

    </div>
  `,
  styles: [`
    .course-list-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .list-controls-bar {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1rem 1.25rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 260px;
    }

    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .search-box input {
      width: 100%;
      padding: 0.65rem 2.25rem 0.65rem 2.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.875rem;
      color: #0f172a;
      outline: none;
      transition: all 0.2s;
    }

    .search-box input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .clear-search-btn {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .filters-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .status-pills {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      background: #f8fafc;
      padding: 0.25rem;
      border-radius: 10px;
      border: 1px solid #f1f5f9;
    }

    .pill-btn {
      background: transparent;
      border: none;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pill-btn.active {
      background: #ffffff;
      color: #4f46e5;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sort-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
    }

    .sort-wrapper select {
      padding: 0.45rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #0f172a;
      background: #ffffff;
      outline: none;
      cursor: pointer;
    }

    .results-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #64748b;
      padding: 0 0.25rem;
    }

    .reset-filters-link {
      background: transparent;
      border: none;
      color: #6366f1;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
      gap: 1.25rem;
    }

    .course-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .course-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px -4px rgba(0,0,0,0.08);
      border-color: #a5b4fc;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .category-badge {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #4f46e5;
      background: #e0e7ff;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
    }

    .status-badge {
      font-size: 0.725rem;
      font-weight: 600;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .badge-completed { background: #d1fae5; color: #047857; }
    .badge-progress { background: #fef3c7; color: #b45309; }
    .badge-pending { background: #f1f5f9; color: #475569; }

    .course-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
      margin: 0 0 0.5rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .course-description {
      font-size: 0.85rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-progress {
      margin-top: auto;
      margin-bottom: 1rem;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 0.35rem;
    }

    .progress-percentage { color: #0f172a; }

    .bar-track {
      height: 6px;
      background: #f1f5f9;
      border-radius: 999px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.3s ease;
    }

    .bg-success { background: #10b981; }
    .bg-progress { background: #f59e0b; }
    .bg-pending { background: #94a3b8; }

    .card-footer {
      border-top: 1px solid #f1f5f9;
      padding-top: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .meta-items {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .action-btn {
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      font-size: 0.775rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-start { background: #4f46e5; color: #ffffff; }
    .btn-start:hover { background: #4338ca; }

    .btn-continue { background: #f59e0b; color: #ffffff; }
    .btn-continue:hover { background: #d97706; }

    .btn-review { background: #e2e8f0; color: #475569; }
    .btn-review:hover { background: #cbd5e1; }

    .empty-state {
      background: #ffffff;
      border: 1px dashed #cbd5e1;
      border-radius: 16px;
      padding: 3rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .empty-icon { font-size: 2.5rem; }
    .empty-state h3 { margin: 0; color: #0f172a; font-size: 1.1rem; }
    .empty-state p { margin: 0; color: #64748b; font-size: 0.875rem; }

    .btn-secondary {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
    }
  `]
})
export class CourseListComponent {
  private courseService = inject(CourseService);

  externalStatusFilter = input<string>('All');
  selectCourse = output<Course>();

  searchQuery = signal<string>('');
  selectedStatus = signal<string>('All');
  sortBy = signal<string>('nameAsc');

  constructor() {
    // Sync external status filter if set from stats card click
    computed(() => {
      const ext = this.externalStatusFilter();
      if (ext) {
        this.selectedStatus.set(ext);
      }
    });
  }

  courses = this.courseService.courses;
  totalCount = computed(() => this.courses().length);

  filteredCourses = computed(() => {
    let list = [...this.courses()];

    // Search filter
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    }

    // Status filter
    const status = this.selectedStatus();
    if (status !== 'All') {
      list = list.filter(c => c.status === status);
    }

    // Sort
    const sort = this.sortBy();
    list.sort((a, b) => {
      if (sort === 'nameAsc') {
        return a.name.localeCompare(b.name);
      } else if (sort === 'nameDesc') {
        return b.name.localeCompare(a.name);
      } else if (sort === 'lessons') {
        return b.numberOfLessons - a.numberOfLessons;
      } else if (sort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return list;
  });

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedStatus.set('All');
    this.sortBy.set('nameAsc');
  }

  getStatusBadgeClass(status: CourseStatus): string {
    switch (status) {
      case 'Completed': return 'badge-completed';
      case 'In Progress': return 'badge-progress';
      default: return 'badge-pending';
    }
  }

  getProgressBarClass(status: CourseStatus): string {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'In Progress': return 'bg-progress';
      default: return 'bg-pending';
    }
  }

  getActionButtonClass(status: CourseStatus): string {
    switch (status) {
      case 'Not Started': return 'btn-start';
      case 'In Progress': return 'btn-continue';
      default: return 'btn-review';
    }
  }

  handleAction(course: Course): void {
    if (course.status === 'Not Started') {
      this.courseService.updateCourseStatus(course.id, 'In Progress');
    } else if (course.status === 'In Progress') {
      this.courseService.updateCourseStatus(course.id, 'Completed');
    }
    this.selectCourse.emit(course);
  }
}
