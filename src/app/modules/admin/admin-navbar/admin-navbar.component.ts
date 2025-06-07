import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  imports: [NgIf],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit{
  sidebarOpen = false;
  showProfileMenu = false;
userName: string = '';
userRole: string = '';
userInitialsValue: string = '';
constructor(private authService: AuthService){}
ngOnInit(): void {
  this.authService.me().subscribe({
    next: (user) => {
      this.userName = user.name;
      this.userRole = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
      this.userInitialsValue = this.getUserInitials(this.userName);
    }
  })
}
getUserInitials(fullName: string): string {
  if (!fullName) return '';
  return fullName
    .split(' ')
    .filter(word => !!word)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }
  onLogout(){
    this.authService.logout();
  }
}
