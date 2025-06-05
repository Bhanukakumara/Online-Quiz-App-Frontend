import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-main',
  imports: [NgFor],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent {
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
  stats = {
    totalUsers: 1247,
    activeCourses: 24,
    totalExams: 89,
    totalQuestions: 2156,
    activeSessions: 34
  };

  userDistribution = {
    students: 1180,
    teachers: 62,
    admins: 5
  };

  recentActivities = [
    {
      type: 'user',
      title: 'New student registered',
      description: 'John Smith joined Computer Science course',
      time: '2 minutes ago'
    },
    {
      type: 'exam',
      title: 'Exam completed',
      description: 'Mathematics Quiz - 45 students participated',
      time: '15 minutes ago'
    },
    {
      type: 'course',
      title: 'New course created',
      description: 'Advanced Programming course by Dr. Anderson',
      time: '1 hour ago'
    },
    {
      type: 'question',
      title: 'Question bank updated',
      description: '25 new questions added to Physics category',
      time: '2 hours ago'
    },
    {
      type: 'user',
      title: 'Teacher account activated',
      description: 'Sarah Johnson can now create exams',
      time: '3 hours ago'
    }
  ];

  ngOnInit() {
    // Component initialization logic
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Simulate loading data from API
    // You can replace this with actual API calls to your Spring Boot backend
    console.log('Loading dashboard data...');
  }

  getActivityIconClass(type: string): string {
    const classes = {
      'user': 'bg-gradient-to-br from-[#BEEAC5] to-[#76B947] text-[#2F5233]',
      'exam': 'bg-gradient-to-br from-[#76B947] to-[#337B01] text-white',
      'course': 'bg-gradient-to-br from-[#337B01] to-[#2F5233] text-white',
      'question': 'bg-gradient-to-br from-[#2F5233] to-[#337B01] text-white'
    };
    return classes[type as keyof typeof classes] || classes['user'];
  }
}
