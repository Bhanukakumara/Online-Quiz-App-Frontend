import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [NgIf, RouterLink],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
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
 // Add these methods
toggleUserDropdown() {
  this.showUserDropdown = !this.showUserDropdown;
  // Close course dropdown when opening user dropdown if needed
  this.showCourseDropdown = false;
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
