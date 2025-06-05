import { Component, OnInit } from '@angular/core';
import { Course } from '../../../core/models/course';
import { CourseService } from '../../../core/services/course.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-view-all-course',
  imports: [CommonModule],
  templateUrl: './admin-view-all-course.component.html',
  styleUrl: './admin-view-all-course.component.css'
})
export class AdminViewAllCourseComponent implements OnInit{
  allCourses: any[] = [];
  constructor(private courseService: CourseService) {}
  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.allCourses = response;
      },
      error: (error) => {
        console.error('Error fetching courses', error);
        alert('Error fetching courses. Please try again later.');
      },
    });
  }
}
