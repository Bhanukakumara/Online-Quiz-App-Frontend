import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-main',
  imports: [],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent implements OnInit {
  userName: string = '';
  userCount: number = 0;
  courseCount: number = 0;
  examCount: number = 0;
  questionCount: number = 0;
  constructor(
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService
  ) { }
  ngOnInit(): void {
    this.me();
    this.getUserCount();
    this.getCourseCount();
    this.getExamCount();
    this.getQuestionCount();
  }
  me(){
    this.authService.me().subscribe({
      next: (user) => {
        this.userName = user.name;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        alert('Error fetching user data. Please try again later.');
      }
    });
  }
  getUserCount(){
    this.dashboardService.getUserCount().subscribe({
      next: (count) => {
        this.userCount = count;
      },
      error: (error) => {
        console.error('Error fetching user count', error);
        alert('Error fetching user count. Please try again later.');
      }
    });
  }
  getCourseCount() {
    this.dashboardService.getCourseCount().subscribe({
      next: (count) => {
        this.courseCount = count;
      },
      error: (error) => {
        console.error('Error fetching course count', error);
        alert('Error fetching course count. Please try again later.');
      }
    });
  }
  getExamCount() {
    this.dashboardService.getExamCount().subscribe({
      next: (count) => {
        this.examCount = count;
      },
      error: (error) => {
        console.error('Error fetching exam count', error);
        alert('Error fetching exam count. Please try again later.');
      }
    });
  }
  getQuestionCount() {
    this.dashboardService.getQuestionCount().subscribe({
      next: (count) => {
        this.questionCount = count;
      },
      error: (error) => {
        console.error('Error fetching question count', error);
        alert('Error fetching question count. Please try again later.');
      }
    });
  }
  addNewUser(){
    this.router.navigate(['admin/add-user']);
  }
  createCourse(){
    this.router.navigate(['admin/create-course']);
  }
}
