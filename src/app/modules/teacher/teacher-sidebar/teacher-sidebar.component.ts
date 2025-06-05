import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teacher-sidebar',
  imports: [NgIf, RouterLink],
  templateUrl: './teacher-sidebar.component.html',
  styleUrl: './teacher-sidebar.component.css',
})
export class TeacherSidebarComponent {
  activeItem = 'dashboard';
  sidebarOpen = false;
  showUserDropdown = false;
  showCourseDropdown = false;
  showExamDropdown = false;
  showQuestionDropdown = false;
  toggleQuestionDropdown() {
    this.showQuestionDropdown = !this.showQuestionDropdown;
    // Close other dropdowns if needed
    this.showUserDropdown = false;
    this.showCourseDropdown = false;
    this.showExamDropdown = false;
  }

  toggleCourseDropdown() {
    this.showCourseDropdown = !this.showCourseDropdown;
    // Close user dropdown when opening course dropdown if needed
    this.showUserDropdown = false;
  }
  toggleExamDropdown() {
    this.showExamDropdown = !this.showExamDropdown;
    // Close other dropdowns if needed
    this.showUserDropdown = false;
    this.showCourseDropdown = false;
  }
  setActiveItem(item: string) {
    this.activeItem = item;
    this.closeSidebar(); // Close sidebar on mobile when item is selected
  }
  closeSidebar() {
    this.sidebarOpen = false;
  }
  get sidebarClasses(): string {
    return this.sidebarOpen
      ? 'translate-x-0'
      : '-translate-x-full lg:translate-x-0';
  }
}
