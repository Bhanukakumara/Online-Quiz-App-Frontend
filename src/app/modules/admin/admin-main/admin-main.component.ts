import {Component,OnInit} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AdminSubmissionChartComponent } from "../admin-submission-chart/admin-submission-chart.component";

@Component({
  selector: 'app-admin-main',
  imports: [CommonModule, AdminSubmissionChartComponent],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css',
})
export class AdminMainComponent implements OnInit {
  userName: string = '';
  userCount: number = 0;
  courseCount: number = 0;
  examCount: number = 0;
  questionCount: number = 0;
  adminCount: number = 0;
  teacherCount: number = 0;
  studentCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.me();
    this.getUserCount();
    this.getCourseCount();
    this.getExamCount();
    this.getQuestionCount();
    this.getAdminCount();
    this.getTeacherCount();
    this.getStudentCount();
  }
  me() {
    this.authService.me().subscribe({
      next: (user) => {
        this.userName = user.name;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        Swal.fire("Error", "Failed to fetch user data. Please try again later.", "error");
      },
    });
  }
  getUserCount() {
    this.dashboardService.getUserCount().subscribe({
      next: (count) => {
        this.userCount = count;
      },
      error: (error) => {
        console.error('Error fetching user count', error);
        Swal.fire('Error', 'Failed to fetch user count. Please try again later.', 'error');
      },
    });
  }
  getCourseCount() {
    this.dashboardService.getCourseCount().subscribe({
      next: (count) => {
        this.courseCount = count;
      },
      error: (error) => {
        console.error('Error fetching course count', error);
        Swal.fire('Error', 'Failed to fetch course count. Please try again later.', 'error');
      },
    });
  }
  getExamCount() {
    this.dashboardService.getExamCount().subscribe({
      next: (count) => {
        this.examCount = count;
      },
      error: (error) => {
        console.error('Error fetching exam count', error);
        Swal.fire('Error', 'Failed to fetch exam count. Please try again later.', 'error');
      },
    });
  }
  getQuestionCount() {
    this.dashboardService.getQuestionCount().subscribe({
      next: (count) => {
        this.questionCount = count;
      },
      error: (error) => {
        console.error('Error fetching question count', error);
        Swal.fire('Error', 'Failed to fetch question count. Please try again later.', 'error');
      },
    });
  }
  addNewUser() {
    this.router.navigate(['admin/add-user']);
  }
  createCourse() {
    this.router.navigate(['admin/create-course']);
  }

  viewReports(){
    this.router.navigate(['admin/view-all-result']);
  }

  getAdminCount() {
    this.dashboardService.getAdminCount().subscribe({
      next: (count) => {
        this.adminCount = count;
      },
      error: (error) => {
        console.error('Error fetching admin count', error);
        Swal.fire('Error', 'Failed to fetch admin count. Please try again later.', 'error');
      }
    });
  }

  getTeacherCount() {
    this.dashboardService.getTeacherCount().subscribe({
      next: (count) => {
        this.teacherCount = count;
      },
      error: (error) => {
        console.error('Error fetching teacher count', error);
        Swal.fire('Error', 'Failed to fetch teacher count. Please try again later.', 'error');
      }
    });
  }

  getStudentCount() {
    this.dashboardService.getStudentCount().subscribe({
      next: (count) => {
        this.studentCount = count;
      },
      error: (error) => {
        console.error('Error fetching student count', error);
        Swal.fire('Error', 'Failed to fetch student count. Please try again later.', 'error');
      }
    });
  }
}
