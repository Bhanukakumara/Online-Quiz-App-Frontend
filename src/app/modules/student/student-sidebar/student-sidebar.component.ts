import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-sidebar',
  imports: [NgIf, RouterLink],
  templateUrl: './student-sidebar.component.html',
  styleUrl: './student-sidebar.component.css'
})
export class StudentSidebarComponent {
  activeItem = 'dashboard';
  sidebarOpen = false;
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
