import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  imports: [NgIf],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  sidebarOpen = false;
  showProfileMenu = false;
  constructor(public authService: AuthService){}
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
