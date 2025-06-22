import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../core/models/course';
import { CourseService } from '../../../core/services/course.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-course',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-add-course.component.html',
  styleUrl: './admin-add-course.component.css',
})
export class AdminAddCourseComponent implements OnInit {
  adminName: string = '';
  newCourse = new Course('', '', 0);
  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (response) => {
        this.adminName = response.name;
        this.newCourse.adminId = response.id;
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
  onSubmit(form: any) {
    if (form.valid) {
      const courseToCreate = new Course(
        form.value.name,
        form.value.description,
        this.newCourse.adminId
      );
      this.courseService.createCourse(courseToCreate).subscribe({
        next: () => {
          form.resetForm();
          this.router.navigate(['admin/view-all-course']);
          Swal.fire('Success', 'Course created successfully!', 'success');
        },
        error: (error) => {
          console.error('Error creating course', error);
          Swal.fire(
            'Error',
            'Failed to create course. Please try again.',
            'error'
          );
        },
      });
    }
  }
}
