import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-sidebar',
  imports: [NgIf, RouterLink],
  templateUrl: './student-sidebar.component.html',
  styleUrl: './student-sidebar.component.css'
})
export class StudentSidebarComponent implements OnInit {
  activeItem = 'dashboard';
  sidebarOpen = false;
  studentId: number = 0;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (user) => {
        this.studentId = user.id;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
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
