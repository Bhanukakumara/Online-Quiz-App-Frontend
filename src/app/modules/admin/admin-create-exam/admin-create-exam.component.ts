import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/services/exam.service';
import { Exam } from '../../../core/models/exam';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-create-exam',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-create-exam.component.html',
  styleUrl: './admin-create-exam.component.css'
})
export class AdminCreateExamComponent implements OnInit{
  newExam = new Exam('', '', 0, 0, 0, 0, 0);
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
        alert('Error fetching user data. Please try again.');
      }
    });
    this.courseService.getAllCourses().subscribe({
      next: (course) => {
        this.courseList = course;
      },
      error: (error) => {
        console.error('Error fetching courses', error);
        alert('Error fetching courses. Please try again.');
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
        form.value.totalTimeMinutes,
        form.value.courseId,
        this.createdBy.id
      );
      this.examService.createExam(examToCreate).subscribe({
        next: (response) => {
          console.log('Exam Created Successfully', response);
          form.resetForm();
          alert('Exam created successfully!');
        },
        error: (error) => {
          console.error('Error creating exam', error);
          alert('Error creating exam. Please try again.');
        },
      });
    }
  }
}
