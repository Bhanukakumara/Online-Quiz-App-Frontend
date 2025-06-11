import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';

@Component({
  selector: 'app-admin-update-exam',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-update-exam.component.html',
  styleUrl: './admin-update-exam.component.css'
})
export class AdminUpdateExamComponent implements OnInit {

  updateExamForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  examId!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService
  ) {
    this.updateExamForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      questionCount: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      maxAttempts: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      teacherId: ['', Validators.required],
      courseId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.examId = +this.route.snapshot.params['id'];
    if (this.examId) {
      this.loadExamData();
    } else {
      console.error('No exam ID provided');
      this.router.navigate(['/admin/view-all-exam']);
    }
  }

  loadExamData(): void {
    this.isLoading = true;
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        console.log('Loaded exam data:', exam);
        this.updateExamForm.patchValue({
          title: exam.title,
          description: exam.description,
          questionCount: exam.questionCount,
          maxAttempts: exam.maxAttempts,
          teacherId: exam.teacherId,
          courseId: exam.courseId
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        alert('Error loading exam data. Please try again.');
        this.isLoading = false;
        this.router.navigate(['/admin/view-all-exam']);
      }
    });
  }

  onSubmit(): void {
    if (this.updateExamForm.valid) {
      this.isSubmitting = true;
      
      const examData = {
        title: this.updateExamForm.value.title,
        description: this.updateExamForm.value.description,
        questionCount: this.updateExamForm.value.questionCount,
        maxAttempts: this.updateExamForm.value.maxAttempts,
        teacherId: this.updateExamForm.value.teacherId,
        courseId: this.updateExamForm.value.courseId
      };

      this.examService.updateExam(this.examId, examData).subscribe({
        next: (response) => {
          console.log('Exam updated successfully:', response);
          this.isSubmitting = false;
          alert('Exam updated successfully!');
          this.router.navigate(['/admin/view-all-exam']);
        },
        error: (error) => {
          console.error('Error updating exam:', error);
          this.isSubmitting = false;
          alert('Error updating exam. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    if (this.updateExamForm.dirty && confirm('Are you sure? Any unsaved changes will be lost.')) {
      this.router.navigate(['/admin/view-all-exam']);
    } else if (!this.updateExamForm.dirty) {
      this.router.navigate(['/admin/view-all-exam']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.updateExamForm.controls).forEach(key => {
      const control = this.updateExamForm.get(key);
      control?.markAsTouched();
    });
  }

  get title() { return this.updateExamForm.get('title'); }
  get description() { return this.updateExamForm.get('description'); }
  get questionCount() { return this.updateExamForm.get('questionCount'); }
  get maxAttempts() { return this.updateExamForm.get('maxAttempts'); }
  get teacherId() { return this.updateExamForm.get('teacherId'); }
  get courseId() { return this.updateExamForm.get('courseId'); }

}