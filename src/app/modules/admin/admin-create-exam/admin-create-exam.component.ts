import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';
import { Exam } from '../../../core/models/exam';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-create-exam',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create-exam.component.html',
  styleUrl: './admin-create-exam.component.css'
})
export class AdminCreateExamComponent implements OnInit{
  newExam = new Exam('', '', 0, 0, 0, 0);
  createdBy: any;
  courseList: any[] = [];
  createdByName: string = '';
  constructor(
    private examService: ExamService,
    private courseService: CourseService,
    private authService: AuthService){}
  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (response) => {
        this.createdBy = response.id;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        Swal.fire('Error', 'Failed to fetch user data. Please try again later.', 'error');
      }
    });
    this.courseService.getAllCourses().subscribe({
      next: (course) => {
        this.courseList = course;
      },
      error: (error) => {
        console.error('Error fetching courses', error);
        Swal.fire('Error', 'Failed to load courses. Please try again later.', 'error');
      }
    });
    this.authService.me().subscribe({
      next: (response) => {
        this.createdBy = response;
        this.createdByName = response.name;
      }
    })
  }
  onSubmit(form:any) {
    if(form.valid){
      const examToCreate = new Exam(
        form.value.title,
        form.value.description,
        form.value.questionCount,
        form.value.maxAttempts,
        form.value.courseId,
        this.createdBy.id
      );
      this.examService.createExam(examToCreate).subscribe({
        next: () => {
          form.resetForm();
          Swal.fire('Success', 'Exam created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating exam', error);
          Swal.fire('Error', 'Failed to create exam. Please try again.', 'error');
        },
      });
    }
  }
}
