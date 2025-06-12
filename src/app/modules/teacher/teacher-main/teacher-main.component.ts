import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { DashboardService } from '../../../core/services/dashboard.service';
@Component({
  selector: 'app-teacher-main',
  imports: [],
  templateUrl: './teacher-main.component.html',
  styleUrl: './teacher-main.component.css',
})
export class TeacherMainComponent implements OnInit {
  userName: string = '';
  courseCount:number = 0;
  studentCount:number = 0;
  examCount:number = 0;
  questionCount:number = 0;
  constructor(private authService: AuthService, private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.me();
    this.getUserCount();
    this.getStudentCount();
    this.getExamCount();
  }
  me() {
    this.authService.me().subscribe({
      next: (user) => {
        this.userName = user.name;
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
  getUserCount(){
    this.dashboardService.getCourseCount().subscribe({
      next: (courseCount) => {
        this.courseCount = courseCount;
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
  getStudentCount(){
    this.dashboardService.getStudentCount().subscribe({
      next: (studentCount) => {
        this.studentCount = studentCount;
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
  getExamCount(){
    this.dashboardService.getExamCount().subscribe({
      next: (examCount) => {
        this.examCount = examCount;
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
  getQuestionCount(){
    this.dashboardService.getQuestionCount().subscribe({
      next: (questionCount) => {
        this.questionCount = questionCount;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        Swal.fire(
          'Error',
          'Failed to fetch user data. Please try again later.',
          'error'
        );
      },
    })
  }
}
