import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { CourseStatus } from '../../models/course.model';

@Component({
  selector: 'app-add-course-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="modal-header">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <div>
            <h2 class="modal-title">Add New Course</h2>
            <p class="modal-subtitle">Fill in course details to expand the learning catalog.</p>
          </div>
          <button class="close-btn" (click)="close.emit()" type="button" title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="modal-form">
          
          <div class="form-grid">
            
            <!-- Course Name -->
            <div class="form-group full-width">
              <label for="name">Course Name <span class="req">*</span></label>
              <input 
                id="name"
                type="text"
                formControlName="name"
                placeholder="e.g. Master Angular Standalone Components"
                [class.is-invalid]="isFieldInvalid('name')"
              />
              @if (isFieldInvalid('name')) {
                <div class="error-msg">
                  @if (courseForm.get('name')?.errors?.['required']) {
                    Course name is required.
                  } @else if (courseForm.get('name')?.errors?.['minlength']) {
                    Course name must be at least 3 characters.
                  }
                </div>
              }
            </div>

            <!-- Description -->
            <div class="form-group full-width">
              <label for="description">Description <span class="req">*</span></label>
              <textarea 
                id="description"
                rows="3"
                formControlName="description"
                placeholder="Provide a brief summary of what learners will gain from this course..."
                [class.is-invalid]="isFieldInvalid('description')"
              ></textarea>
              @if (isFieldInvalid('description')) {
                <div class="error-msg">
                  @if (courseForm.get('description')?.errors?.['required']) {
                    Description is required.
                  } @else if (courseForm.get('description')?.errors?.['minlength']) {
                    Description must be at least 10 characters.
                  }
                </div>
              }
            </div>

            <!-- Duration -->
            <div class="form-group">
              <label for="duration">Duration <span class="req">*</span></label>
              <input 
                id="duration"
                type="text"
                formControlName="duration"
                placeholder="e.g. 2 hours or 45 mins"
                [class.is-invalid]="isFieldInvalid('duration')"
              />
              @if (isFieldInvalid('duration')) {
                <div class="error-msg">Duration is required (e.g., '2.5 hours').</div>
              }
            </div>

            <!-- Number of Lessons -->
            <div class="form-group">
              <label for="numberOfLessons">Number of Lessons <span class="req">*</span></label>
              <input 
                id="numberOfLessons"
                type="number"
                min="1"
                formControlName="numberOfLessons"
                placeholder="e.g. 10"
                [class.is-invalid]="isFieldInvalid('numberOfLessons')"
              />
              @if (isFieldInvalid('numberOfLessons')) {
                <div class="error-msg">
                  @if (courseForm.get('numberOfLessons')?.errors?.['required']) {
                    Number of lessons is required.
                  } @else if (courseForm.get('numberOfLessons')?.errors?.['min']) {
                    Must be at least 1 lesson.
                  }
                </div>
              }
            </div>

            <!-- Status -->
            <div class="form-group">
              <label for="status">Initial Status <span class="req">*</span></label>
              <select id="status" formControlName="status" [class.is-invalid]="isFieldInvalid('status')">
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" formControlName="category">
                <option value="Technical">Technical</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Compliance">Compliance</option>
                <option value="Analytics">Analytics</option>
                <option value="General">General</option>
              </select>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="modal-footer">
            <button class="cancel-btn" type="button" (click)="close.emit()">Cancel</button>
            <button class="submit-btn" type="submit" [disabled]="courseForm.invalid">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Create Course
            </button>
          </div>

        </form>

      </div>
    </div>
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
      max-width: 600px;
      width: 100%;
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
      gap: 1rem;
      background: linear-gradient(to right, #f8fafc, #ffffff);
    }

    .header-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(79, 70, 229, 0.1);
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.2rem 0;
    }

    .modal-subtitle {
      font-size: 0.825rem;
      color: #64748b;
      margin: 0;
    }

    .close-btn {
      margin-left: auto;
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .close-btn:hover { color: #0f172a; background: #e2e8f0; }

    .modal-form {
      display: flex;
      flex-direction: column;
    }

    .form-grid {
      padding: 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    label {
      font-size: 0.825rem;
      font-weight: 600;
      color: #334155;
    }

    .req { color: #ef4444; }

    input, textarea, select {
      padding: 0.65rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.875rem;
      color: #0f172a;
      background: #ffffff;
      outline: none;
      transition: all 0.2s;
    }

    input:focus, textarea:focus, select:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    input.is-invalid, textarea.is-invalid, select.is-invalid {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .error-msg {
      font-size: 0.75rem;
      color: #dc2626;
      font-weight: 500;
    }

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

    .cancel-btn {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
    }

    .cancel-btn:hover { background: #f1f5f9; }

    .submit-btn {
      background: #4f46e5;
      border: none;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .submit-btn:hover:not(:disabled) {
      background: #4338ca;
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }
  `]
})
export class AddCourseModalComponent {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);

  close = output<void>();
  courseAdded = output<void>();

  courseForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    duration: ['', [Validators.required]],
    numberOfLessons: [1, [Validators.required, Validators.min(1)]],
    status: ['Not Started' as CourseStatus, [Validators.required]],
    category: ['Technical']
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.courseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.courseService.addCourse(this.courseForm.value);
      this.courseAdded.emit();
      this.close.emit();
    } else {
      this.courseForm.markAllAsTouched();
    }
  }
}
