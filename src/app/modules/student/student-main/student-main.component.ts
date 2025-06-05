import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-student-main',
  imports: [],
  templateUrl: './student-main.component.html',
  styleUrl: './student-main.component.css'
})
export class StudentMainComponent {
  activeItem: any;
  hasContent = false; // Set to true when child components are present
  get mainContentClasses(): string {
    return 'lg:ml-64';
  }
  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'users': 'User Management',
      'courses': 'Course Management',
      'exams': 'Exam Management',
      'questions': 'Question Bank',
      'reports': 'Reports & Analytics',
      'settings': 'Settings'
    };
    return titles[this.activeItem] || 'Dashboard';
  }
  getPageDescription(): string {
    const descriptions: { [key: string]: string } = {
      'dashboard': 'Overview of your quiz portal activities and statistics',
      'users': 'Manage admins, teachers, and students',
      'courses': 'Create and manage courses for your quiz system',
      'exams': 'Create and configure exams for different courses',
      'questions': 'Manage question pools for your exams',
      'reports': 'View detailed analytics and performance reports',
      'settings': 'Configure system settings and preferences'
    };
    return descriptions[this.activeItem] || 'Welcome to the admin panel';
  }
  getActionButtonText(): string {
    const actions: { [key: string]: string } = {
      'dashboard': 'View Reports',
      'users': 'Add New User',
      'courses': 'Create Course',
      'exams': 'Create Exam',
      'questions': 'Add Question',
      'reports': 'Export Data',
      'settings': 'Save Changes'
    };
    return actions[this.activeItem] || 'Take Action';
  }
}
