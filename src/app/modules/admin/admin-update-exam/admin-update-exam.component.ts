import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';
import { ExamService } from '../../../core/services/exam.service';
import { Exam } from '../../../core/models/exam';

@Component({
  selector: 'app-admin-update-exam',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-update-exam.component.html',
  styleUrl: './admin-update-exam.component.css',
})
export class AdminUpdateExamComponent implements OnInit {
  examEditing: Exam = {
    title: '',
    description: '',
    questionCount: 0,
    maxAttempts: 0,
    courseId: 0,
    teacherId: 0,
  };

  courseList: any[] = [];
  teacherList: any[] = [];
  userId: number = 0;
  userName: string = '';
  examId: number = 0;

  @ViewChild('examForm') examForm!: NgForm;

  constructor(
    private readonly examService: ExamService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const examIdParam = this.route.snapshot.paramMap.get('examId');
    this.examId = examIdParam ? +examIdParam : 0;

    this.loadCoursesAndTeachers();

    if (this.examId) {
      this.examService.getExamById(this.examId).subscribe({
        next: (res) => {
          this.examEditing = res;
        },
        error: (error) => {
          console.error('Error fetching exam data', error);
          Swal.fire(
            'Error',
            'Failed to fetch exam data. Please try again later.',
            'error'
          );
        },
      });
    }

    this.authService.me().subscribe({
      next: (response) => {
        this.userId = response.id;
        this.userName = response.name;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        Swal.fire(
          'Error',
          'Failed to fetch user data. Please try again later.',
          'error'
        );
      },
    });
  }

  loadCoursesAndTeachers(): void {
    this.examService.getAllExams().subscribe({
      next: (exams) => {
        const courseMap = new Map();
        const teacherMap = new Map();

        exams.forEach((exam) => {
          if (exam.courseId && exam.courseName) {
            courseMap.set(exam.courseId, {
              id: exam.courseId,
              name: exam.courseName,
            });
          }
          if (exam.teacherId && exam.teacherName) {
            teacherMap.set(exam.teacherId, {
              id: exam.teacherId,
              name: exam.teacherName,
            });
          }
        });

        this.courseList = Array.from(courseMap.values());
        this.teacherList = Array.from(teacherMap.values());
      },
      error: (error) => {
        console.error('Error fetching courses and teachers', error);
        Swal.fire(
          'Error',
          'Failed to load courses and teachers. Please try again later.',
          'error'
        );
      },
    });
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.examId) {
      const examToSave: Exam = {
        title: form.value.title,
        description: form.value.description,
        questionCount: +form.value.questionCount,
        maxAttempts: +form.value.maxAttempts,
        courseId: +form.value.courseId,
        teacherId: +form.value.teacherId,
      };

      this.examService.updateExam(this.examId, examToSave).subscribe({
        next: () => {
          Swal.fire('Success', 'Exam updated successfully!', 'success').then(
            () => {
              this.router.navigate(['/admin/view-all-exam']);
            }
          );
        },
        error: (error) => {
          console.error('Error updating exam', error);
          Swal.fire(
            'Error',
            'Failed to update exam. Please try again later.',
            'error'
          );
        },
      });
    } else {
      Swal.fire(
        'Error',
        'Form is invalid or exam ID is missing. Please try again.',
        'error'
      );
    }
  }
}
