import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Enrollment } from '../../../core/models/enrollment';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-exam',
  imports: [CommonModule],
  templateUrl: './student-exam.component.html',
  styleUrl: './student-exam.component.css',
})
export class StudentExamComponent implements OnInit {
  exams: any[] = [];
  newEnrollment: Enrollment = new Enrollment(0, 0);

  constructor(
    private examService: ExamService,
    private router: Router,
    private authService: AuthService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.examService.getAllExams().subscribe({
      next: (response) => {
        this.exams = response;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load exams. Please try again later.', 'error');
      },
    });
  }

  getQuestionPaper(examId: number) {
    this.authService.me().pipe(
        switchMap((user) => {
          this.newEnrollment.studentId = user.id;
          return this.examService.getExamById(examId);
        }),
        switchMap((exam) => {
          this.newEnrollment.examId = exam.id;
          return this.enrollmentService.createEnrollment(this.newEnrollment);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/student/exam/paper'], {
            queryParams: { examId: examId },
          });
        },
        error: (error) => {
          console.log('Error creating enrollment', error);
          Swal.fire('Error', 'Maximum attempts reached for this exam', 'error');
  
        },
      });
  }
}
