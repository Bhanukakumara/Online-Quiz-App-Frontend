import { Component } from '@angular/core';
import { TeacherSidebarComponent } from "../teacher-sidebar/teacher-sidebar.component";
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from "../../admin/admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-teacher-dashboard',
  imports: [TeacherSidebarComponent, RouterOutlet, AdminNavbarComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent {

}
